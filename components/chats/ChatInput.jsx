// components/chats/ChatInput.jsx
// Reusable chat input composer — the "chatbox" area at the bottom of any
// conversation thread. Includes a reply bar, a text/voice composer with attach
// and voice-note affordances, and an inline attachment panel that takes the
// keyboard's place (WhatsApp-style) instead of a floating modal.
//
// The component is fully self-contained: it manages its own draft, recording
// and attachment-sheet state. Side-effects (sending, typing flags, toasts,
// attachment selection, scroll-to-end) are delegated to callbacks so the
// component has no hard dependency on any store or navigation layer.
//
// Usage:
//   <ChatInput
//     conversationId={id}
//     user={user}
//     onSend={sendMessage}
//     onTyping={(typing) => setTyping(id, user?.id, typing)}
//     replyTo={replyTo}
//     onReplyChange={setReplyTo}
//     listRef={listRef}
//     onToast={showToast}
//   />
//
// Props
//   conversationId      Thread the draft belongs to (forwarded to onSend).
//   user                Current user, used to stamp outgoing messages.
//   onSend              Called with the chatStore sendMessage payload.
//   onTyping            Called with true/false as the draft gains/loses content,
//                       and with false on unmount and after sending.
//   replyTo             Message being replied to (null hides the reply bar).
//   onReplyChange       Called with the next reply target (null to clear).
//   listRef             FlatList ref; scrolled to the end after a send.
//   onToast             (message, variant) toast helper.
//   onAttachmentPress   Optional override for the default "coming soon" toast.
//                       Receives (item, { viewOnce }) so hosts can tag file /
//                       media sends with the composer toggle state.
//   showViewOnce        Show the view-once toggle on the text composer row
//                       (default true). Locked voice mode keeps its own toggle.
//   attachmentOptions   Optional [{ name, label, provider?, icon? }] to override
//                       the sheet grid. Each tile accepts:
//                         name      Icon name (string)
//                         label     Tile label (used as the React key)
//                         provider  Any @expo/vector-icons family: "ionicons",
//                                   "material", "feather", "fontawesome", …
//                         icon      Full descriptor { name, provider } or a React
//                                   element — wins over name/provider when set.
//   maxMessageLength    Optional draft character cap (defaults to config).
//   placeholder         Optional input placeholder.
//   style               Optional style merged onto the composer container.
//   micIcon             Icon name for the idle voice button. Accepts a string,
//                       a { name, provider } descriptor, or a React element.
//   micIconFamily       Provider for a string micIcon ("material" default;
//                       "ionicons", "feather", "fontawesome", … all work).
//   micIconProvider     Alias of micIconFamily.
//   micRecordingIcon    Icon shown while recording. Same flexible shape as
//                       micIcon (string | { name, provider } | element).
//   micRecordingIconProvider  Provider for a string micRecordingIcon.
//   sendIcon            Send-button icon. Same flexible shape as micIcon.
//   sendIconProvider    Provider for a string sendIcon (default "ionicons").
//   attachIcon          "+" button icon when the panel is closed (same shape).
//   attachIconProvider  Provider for a string attachIcon (default "ionicons").
//   keyboardIcon        Icon shown while the panel is open (same shape).
//   keyboardIconProvider  Provider for a string keyboardIcon.
//   replyCloseIcon      Reply-bar close icon (same shape).
//   viewOnceIcon        View-once "seen" icon (same shape).
//   viewOnceOffIcon     View-once "unseen" icon (same shape).
//   trashIcon           Locked-panel delete icon (same shape).
//   pauseIcon           Locked-panel pause icon (same shape).
//   playIcon            Locked-panel play/resume icon (same shape).
//   iconProvider        Default provider for string icons that don't name one
//                       (default "ionicons").
//   messageIdPrefix     Prefix for locally generated message ids.
//   onRecordStart       Optional () => void replacing the default start toast.
//   onRecordStop        Optional (cancelled) => void replacing the default
//                       "Voice note sent" / "Recording cancelled" toasts.
//
// Voice notes
//   One mic button, both gestures, on every screen:
//     • press and hold  → starts recording after a short delay; release STOPS
//       the capture and shows the locked preview panel (never auto-sends)
//     • swipe up + release → LOCKS hands-free: the capture keeps running and
//       the locked panel appears with a live timer/wave
//     • drag down 40px+ (while holding) → red tint; releasing discards
//     • quick tap       → no-op, so a stray tap can never send a voice note
//
// Locked panel (isRecording && isLocked):
//   • after hold-release → finished take as preview (timer/wave frozen until
//     play resumes it)
//   • after swipe-release → live capture (timer/wave running hands-free)
//   Row 1: [VM counter (replaces +)] [waveform centred] [view-once toggle]
//   Row 2: [delete] [pause/resume] [send]

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Keyboard,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from "expo-audio";
import { createVoiceRecorder } from "../../utils/voiceRecorder";
import colors from "../../constants/colors";
import config from "../../constants/config";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import typography from "../../constants/typography";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";
import AppIcon, { ICON_PROVIDERS } from "../ui/AppIcon";

const DEFAULT_ATTACHMENT_OPTIONS = [
  { name: "camera-outline", label: "Camera", provider: "ionicons" },
  { name: "image-outline", label: "Photo", provider: "ionicons" },
  { name: "videocam-outline", label: "Video", provider: "ionicons" },
  { name: "document-outline", label: "File", provider: "ionicons" },
  { name: "location-outline", label: "Location", provider: "ionicons" },
  { name: "person-outline", label: "Contact", provider: "ionicons" },
];

// Back-compat re-export: ICON_PROVIDERS lives in ../ui/AppIcon (single
// source of truth); kept here so existing imports keep working.
export { ICON_PROVIDERS };
const ComposerIcon = AppIcon;

// Voice-note gestures. Holding the mic for HOLD_TO_RECORD_DELAY_MS arms the
// recorder; dragging up does the same instantly; dragging back down past the
// cancel threshold turns the button red and discards the note on release.
const HOLD_TO_RECORD_DELAY_MS = 220;
const SWIPE_UP_THRESHOLD = -30;
const SWIPE_CANCEL_THRESHOLD = 40;

function ChatInput({
  conversationId,
  user,
  onSend,
  onTyping,
  onChangeText = () => {},
  replyTo,
  onReplyChange,
  listRef,
  onToast,
  onAttachmentPress,
  attachmentOptions,
  maxMessageLength = config.limits.maxMessageLength,
  placeholder = "Message…",
  style,
  micIcon = "multitrack-audio",
  micIconFamily = "material",
  micIconProvider,
  micRecordingIcon = "mic",
  micRecordingIconProvider,
  sendIcon = "send",
  sendIconProvider,
  attachIcon = "add",
  attachIconProvider,
  keyboardIcon = "keyboard-outline",
  keyboardIconProvider = "MaterialCommunityIcons",
  replyCloseIcon = "close",
  replyCloseIconProvider,
  viewOnceIcon = "progress-clock",
  viewOnceIconProvider = "MaterialCommunityIcons",
  viewOnceOffIcon = "progress-clock",
  viewOnceOffIconProvider = "MaterialCommunityIcons",
  trashIcon = "trash-outline",
  trashIconProvider,
  pauseIcon = "pause",
  pauseIconProvider,
  playIcon = "play",
  playIconProvider,
  showViewOnce = true,
  iconProvider = "ionicons",
  messageIdPrefix = "local",
  onRecordStart,
  onRecordStop,
}) {
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  // ── Internal state ─────────────────────────────────
  const [draft, setDraft] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  // Locked (WhatsApp-style) recording: entered on swipe-up + release. The
  // recorder keeps running hands-free until delete / send is tapped.
  const [isLocked, setIsLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [viewOnce, setViewOnce] = useState(false);
  // WhatsApp-style attachment panel: an inline view that takes the keyboard's
  // place instead of a floating Modal. Opening it dismisses the keyboard; the
  // "+" button becomes a keyboard icon that restores the keyboard on tap.
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  // Ref for the text <TextInput> — focused/blurred from the keyboard &
  // attachment-panel logic in the callbacks below.
  const inputRef = useRef(null);
  // ── Recording-lifecycle refs — declared early so every effect + cleanup
  // that touches them is defined after they exist (avoids a TDZ /
  // forward-reference crash when a hook body runs during render). These refs
  // are the single source of truth for "are we capturing / paused /
  // swiped-up / view-once?", so the gesture responders, timer effects, and
  // locked-panel render all derive from them consistently.
  const recordingActiveRef = useRef(false);
  const didSwipeUpRef = useRef(false);
  const isPausedRef = useRef(false);
  const viewOnceRef = useRef(false);
  const holdTimerRef = useRef(null);

  // A JS-only controller is created on mount; native allocation is deferred
  // until permission and audio mode have succeeded after a mic gesture.
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [micEnergy, setMicEnergy] = useState(0);
  const controllerRef = useRef(null);
  const mountedRef = useRef(false);
  const holdingRef = useRef(false);
  const callbacksRef = useRef({ onToast, onTyping });
  callbacksRef.current = { onToast, onTyping };

  const clearHoldTimer = useCallback(() => {
    clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const controller = createVoiceRecorder({
      audio: AudioModule,
      setAudioMode: setAudioModeAsync,
      createRecorder: () => {
        const preset = RecordingPresets.HIGH_QUALITY;
        // Match SDK 54 useAudioRecorder's platform-option flattening without
        // importing private Expo helpers or allocating during React render.
        const { android, ios, web, ...common } = preset;
        return new AudioModule.AudioRecorder({
          ...common,
          ...Platform.select({ android, ios, default: web }),
          isMeteringEnabled: true,
        });
      },
      onState: ({ phase, durationMillis, energy }) => {
        if (!mountedRef.current) return;
        const active = ["recording", "paused"].includes(phase);
        recordingActiveRef.current = active;
        isPausedRef.current = phase === "paused";
        setIsRecording(active || ["stopping", "stopped"].includes(phase));
        setIsPaused(phase === "paused");
        setRecordingDuration(Math.floor(durationMillis / 1000));
        setMicEnergy(energy);
        if (phase === "idle") {
          setIsLocked(false);
          setIsCancelling(false);
          didSwipeUpRef.current = false;
          setRecordingDuration(0);
        }
      },
      onError: (message) => callbacksRef.current.onToast?.(message, "error"),
    });
    controllerRef.current = controller;
    return () => {
      mountedRef.current = false;
      holdingRef.current = false;
      recordingActiveRef.current = false;
      didSwipeUpRef.current = false;
      isPausedRef.current = false;
      clearHoldTimer();
      callbacksRef.current.onTyping?.(false);
      controllerRef.current = null;
      void controller.dispose();
    };
  }, [clearHoldTimer]);

  useEffect(() => {
    onTyping?.(Boolean(draft.trim()));
  }, [draft, onTyping]);

  const waveBars = useMemo(() => Array.from({ length: 16 }, (_, i) => {
    const base = 0.15 + ((i * 7) % 5) * 0.06;
    const peak = 1 - Math.abs((i % 7) - 3) * 0.12;
    return Math.min(1, base + peak * micEnergy);
  }), [micEnergy]);

  const startRecording = useCallback(async () => {
    const controller = controllerRef.current;
    if (!holdingRef.current || !controller || controller.phase !== "idle") return;
    const started = await controller.start();
    if (!started || !mountedRef.current || controllerRef.current !== controller) return;
    setDraft("");
    setViewOnce(false);
    viewOnceRef.current = false;
    callbacksRef.current.onTyping?.(false);
    if (onRecordStart) onRecordStart();
    else onToast?.("Recording...", "info");
  }, [onRecordStart, onToast]);

  const stopRecording = useCallback(async (cancelled = false) => {
    const controller = controllerRef.current;
    if (!controller || !["recording", "paused"].includes(controller.phase)) return;
    const voiceViewOnce = viewOnceRef.current;
    const waveform = waveBars.slice();
    const take = await controller.finish(cancelled);
    if (!mountedRef.current || controllerRef.current !== controller) return;
    setViewOnce(false);
    viewOnceRef.current = false;
    if (cancelled) {
      if (onRecordStop) onRecordStop(true);
      else onToast?.("Recording cancelled", "info");
      return;
    }
    if (!take) return;
    try {
      await onSend?.({
        conversationId,
        message: {
          id: `${messageIdPrefix}-${Date.now()}`,
          text: "",
          mediaType: "voice",
          duration: take.duration,
          mediaUrl: take.uri,
          waveform,
          viewOnce: voiceViewOnce,
          senderId: user?.id,
          senderName: user?.name,
          senderAvatar: user?.avatarUrl,
          isMine: true,
          createdAt: new Date().toISOString(),
          status: "sent",
          replyTo: replyTo ? {
            id: replyTo.id,
            text: replyTo.text?.slice(0, 100),
            senderName: replyTo.isMine ? "You" : replyTo.senderName || "Unknown",
          } : undefined,
        },
      });
      if (!mountedRef.current) return;
      onReplyChange?.(null);
      onTyping?.(false);
      listRef?.current?.scrollToEnd?.({ animated: true });
      if (onRecordStop) onRecordStop(false);
      else onToast?.("Voice note sent", "success");
    } catch (error) {
      if (mountedRef.current) onToast?.(`Sending failed: ${error.message}`, "error");
    }
  }, [conversationId, listRef, messageIdPrefix, onRecordStop, onReplyChange,
    onSend, onToast, onTyping, replyTo, user, waveBars]);

  const discardRecording = useCallback(() => stopRecording(true), [stopRecording]);
  const sendRecording = useCallback(() => stopRecording(false), [stopRecording]);
  const togglePauseRecording = useCallback(() => {
    const controller = controllerRef.current;
    if (controller?.phase === "paused") controller.resume();
    else if (controller?.phase === "recording") controller.pause();
  }, []);

  const toggleViewOnce = useCallback(() => {
    viewOnceRef.current = !viewOnceRef.current;
    setViewOnce(viewOnceRef.current);
  }, []);

  // Track the keyboard height so the inline attachment panel can reuse the
  // exact same slot when the keyboard is dismissed.
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const onShow = (e) => setKeyboardHeight(e.endCoordinates?.height ?? 0);
    const onHide = () => setKeyboardHeight(0);
    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const openAttachmentSheet = useCallback(() => {
    // Takes the keyboard's place: dismiss first so the panel owns the slot.
    Keyboard.dismiss();
    inputRef.current?.blur();
    setShowAttachmentSheet(true);
  }, []);

  const closeAttachmentSheet = useCallback(() => {
    setShowAttachmentSheet(false);
  }, []);

  // "+" toggles the attachment panel; once open it becomes a keyboard icon
  // that restores the keyboard instead.
  const toggleAttachmentSheet = useCallback(() => {
    if (showAttachmentSheet) {
      setShowAttachmentSheet(false);
      inputRef.current?.focus();
    } else {
      openAttachmentSheet();
    }
  }, [showAttachmentSheet, openAttachmentSheet]);

  const send = useCallback(() => {
    if (!draft.trim()) return;
    const isViewOnce = viewOnceRef.current;
    onSend?.({
      conversationId,
      message: {
        id: `${messageIdPrefix}-${Date.now()}`,
        text: draft.trim(),
        createdAt: new Date().toISOString(),
        senderId: user?.id,
        senderName: user?.name,
        senderAvatar: user?.avatarUrl,
        isMine: true,
        status: "sent",
        viewOnce: isViewOnce,
      },
    });
    setDraft("");
    setViewOnce(false);
    viewOnceRef.current = false;
    onTyping?.(false);
    requestAnimationFrame(() => {
      listRef?.current?.scrollToEnd?.({ animated: true });
    });
  }, [draft, conversationId, onSend, onTyping, messageIdPrefix, user, listRef]);

  const handleAttachmentPress = useCallback(
    (item) => {
      const attachmentViewOnce = viewOnceRef.current;
      closeAttachmentSheet();
      if (onAttachmentPress) {
        // Hosts build the file / media payload themselves — hand over the
        // toggle so they can tag the message with viewOnce.
        onAttachmentPress(item, { viewOnce: attachmentViewOnce });
      } else {
        onToast?.(`${item.label} coming soon`, "info");
      }
      setViewOnce(false);
      viewOnceRef.current = false;
    },
    [closeAttachmentSheet, onAttachmentPress, onToast],
  );

  // ── Mic responder ─────────────────────────────────
  // A single responder drives both gestures. Its handlers are routed through
  // refs so the instance created on first render never captures a stale
  // recording flag or stale callbacks.
  //   • hold + release              → STOP capture, show preview panel
  //   • swipe up + release          → LOCK hands-free, capture keeps running
  // Sending only happens from the locked panel's send button; a downward drag
  // past the cancel threshold still discards on release.
  const recordingControlsRef = useRef({});
  useEffect(() => {
    recordingControlsRef.current = {
      startRecording,
      stopRecording,
      clearHoldTimer,
      // Marks the in-progress HOLD gesture as "swipe-up seen". Intentionally
      // does NOT setIsLocked here — the locked panel swaps out the mic view,
      // so flipping it mid-gesture would unmount the responder and drop the
      // release event. The UI locks on release instead (see below).
      flagSwipeUp: () => {
        didSwipeUpRef.current = true;
        setIsCancelling(false);
      },
    };
  }, [
    startRecording,
    stopRecording,
    clearHoldTimer,
  ]);

  const micPanResponder = useMemo(
    () =>
      PanResponder.create({
        // The mic claims the touch from the first frame so the release always
        // comes back here — even though the composer swaps in the wave + timer
        // while the finger is still down.
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        // Never surrender the gesture half way through: a stolen responder fires
        // onPanResponderTerminate, which would bin the note being recorded.
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          holdingRef.current = true;
          didSwipeUpRef.current = false;
          setIsLocked(false);
          setIsCancelling(false);
          recordingControlsRef.current.clearHoldTimer?.();
          holdTimerRef.current = setTimeout(() => {
            holdTimerRef.current = null;
            recordingControlsRef.current.startRecording?.();
          }, HOLD_TO_RECORD_DELAY_MS);
        },
        onPanResponderMove: (_, gestureState) => {
          // Dragging up arms the recorder straight away, without waiting out the
          // hold delay, and flags the gesture for LOCK on release. The locked
          // panel itself only appears AFTER release — swapping the mic view
          // mid-gesture would unmount this responder and drop the release.
          if (gestureState.dy < SWIPE_UP_THRESHOLD) {
            if (!recordingActiveRef.current) {
              recordingControlsRef.current.clearHoldTimer?.();
              recordingControlsRef.current.startRecording?.();
            }
            recordingControlsRef.current.flagSwipeUp?.();
          }
          if (recordingActiveRef.current && !didSwipeUpRef.current) {
            // Swipe back down past the threshold to discard the note —
            // hold-to-record only; locked mode uses the trash button.
            setIsCancelling(gestureState.dy > SWIPE_CANCEL_THRESHOLD);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          holdingRef.current = false;
          controllerRef.current?.cancelStart();
          recordingControlsRef.current.clearHoldTimer?.();
          if (recordingActiveRef.current) {
            // Dragged down past the cancel threshold → discard (the red tint
            // shown while holding).
            if (gestureState.dy > SWIPE_CANCEL_THRESHOLD) {
              recordingControlsRef.current.stopRecording?.(true);
              return;
            }
            if (didSwipeUpRef.current) {
              // Swipe-up + release → LOCK hands-free: the capture keeps
              // running, so just reveal the locked panel with its live
              // timer/wave. Nothing sends here — send only happens from the
              // panel's send button. The finger is up, so swapping views
              // is safe.
              setIsLocked(true);
              setIsCancelling(false);
              return;
            }
            // Plain hold + release → STOP the capture but keep the take on
            // screen: freeze the second counter + wave, then show the locked
            // panel as a preview (timer / wave / view-once / delete / play /
            // send). Nothing sends here either.
            controllerRef.current?.pause();
            setIsLocked(true);
            setIsCancelling(false);
            return;
          }
          // Otherwise it was a plain tap: nothing recorded, nothing sent.
        },
        onPanResponderTerminate: () => {
          holdingRef.current = false;
          controllerRef.current?.cancelStart();
          recordingControlsRef.current.clearHoldTimer?.();
          if (recordingActiveRef.current) {
            recordingControlsRef.current.stopRecording?.(true);
          }
        },
      }),
    [],
  );

  const resolvedAttachmentOptions =
    attachmentOptions ?? DEFAULT_ATTACHMENT_OPTIONS;

  const formatDuration = (totalSeconds) =>
    `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;

  // The mic button stays mounted for the whole HOLD gesture (see the composer
  // below), so only its look changes while holding — never its identity.
  // Once LOCKED (finger released after swipe-up) the mic is swapped for a
  // real send button — taps there send, no responder involved.
  //
  // Any icon accepts a plain name (resolved via its provider prop, then the
  // component-wide iconProvider default) or a full { name, provider }
  // descriptor / React element, so callers can mix Ionicons, Material,
  // Feather, FontAwesome, … per icon.
  const recordingAccent = isCancelling ? colors.error : colors.primary;
  const locked = isRecording && isLocked;
  const micIdleProvider = micIconProvider ?? micIconFamily ?? "material";
  const micIconColor =
    isRecording && !locked ? colors.white : theme.text.secondary;
  const micIconElement =
    isRecording && !locked ? (
      <ComposerIcon
        icon={micRecordingIcon}
        provider={micRecordingIconProvider ?? iconProvider}
        size={22}
        color={micIconColor}
      />
    ) : (
      <ComposerIcon
        icon={micIcon}
        provider={micIdleProvider}
        size={22}
        color={micIconColor}
      />
    );
  const micButtonStyle = [
    styles.voiceButton,
    {
      backgroundColor:
        isRecording && !locked
          ? recordingAccent
          : isDark
            ? colors.surfaceLight
            : "#F3F4F6",
    },
  ];
  // The text send button only appears for a real draft, and never
  // mid-recording (locked mode has its own send buttons).
  const showSendButton = !isRecording && Boolean(draft.trim() || replyTo);

  // ── Render ────────────────────────────────────────
  return (
    <>
      {/* ── Reply bar ────────────────────────────────── */}
      {replyTo ? (
        <View
          style={[
            styles.replyBar,
            {
              backgroundColor: colors.primary + "10",
              borderBottomColor: isDark ? colors.border : "rgba(0,0,0,0.08)",
            },
          ]}
        >
          <Pressable
            onPress={() => onReplyChange?.(null)}
            style={styles.replyClose}
            hitSlop={8}
          >
            <ComposerIcon
              icon={replyCloseIcon}
              provider={replyCloseIconProvider ?? iconProvider}
              size={16}
              color={theme.text.tertiary}
            />
          </Pressable>
          <View style={styles.replyPreview}>
            <View
              style={[
                styles.replyAccent,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <View style={styles.replyTextWrap}>
              <Text variant="caption" color="primary" style={styles.replyFrom}>
                Replying to{" "}
                {replyTo.isMine ? "you" : replyTo.senderName || "Unknown"}
              </Text>
              <Text variant="caption" color="tertiary" numberOfLines={1}>
                {replyTo.text?.slice(0, 50)}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* ── Composer ─────────────────────────────────── */}
      {locked ? (
        // ── LOCKED (hands-free) MODE — swipe-up + release. Row 1 mirrors the
        // input row: VM counter (replaces +), wave centred, view-once toggle.
        // Row 2: delete / pause / send (former mic slot).
        // Full-bleed bottom: eats the safe area with the composer's own bg so
        // Screen's darker background never shows through as a strip.
        <View
          style={[
            styles.composerLocked,
            {
              paddingBottom: insets.bottom + spacing.sm,
              backgroundColor: isDark ? colors.surface : colors.white,
              borderTopColor: isDark ? colors.border : "rgba(0,0,0,0.08)",
            },
            style,
          ]}
        >
          <View style={styles.lockedRow}>
            <View style={styles.vmCounter}>
              <Text
                variant="caption"
                style={[styles.vmCounterText, { color: theme.text.primary }]}
              >
                {formatDuration(recordingDuration)}
              </Text>
            </View>
            <View
              style={[
                styles.lockedWaveWrap,
                {
                  backgroundColor: isDark
                    ? colors.primary + "22"
                    : colors.primary + "12",
                  borderColor: recordingAccent + "40",
                },
              ]}
            >
              {waveBars.map((energy, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.waveBar,
                    styles.lockedWaveBar,
                    {
                      backgroundColor: recordingAccent,
                      // When paused, the mic isn't streaming — hold the last
                      // energy we saw, dimmed so it reads as "frozen".
                      opacity: isPaused ? 0.35 : 1,
                      transform: [
                        {
                          scaleY: Math.max(
                            0.12,
                            Math.min(1, energy),
                          ),
                        },
                      ],
                    },
                  ]}
                />
              ))}
            </View>
            {/* Fixed-width slot matching vmCounter so the wave stays dead-center
                while the 36px toggle stays centered inside its slot. */}
            <View style={styles.viewOnceSlot}>
              <Pressable
                onPress={toggleViewOnce}
                hitSlop={8}
                accessibilityRole="togglebutton"
                accessibilityState={{ selected: viewOnce }}
                accessibilityLabel="View once"
                style={[
                  styles.viewOnceButton,
                  {
                    backgroundColor: viewOnce
                      ? colors.primary
                      : isDark
                        ? colors.surfaceLight
                        : "#F3F4F6",
                  },
                ]}
              >
                <ComposerIcon
                  icon={viewOnce ? viewOnceIcon : viewOnceOffIcon}
                  provider={
                    viewOnce
                      ? (viewOnceIconProvider ?? iconProvider)
                      : (viewOnceOffIconProvider ?? iconProvider)
                  }
                  size={18}
                  color={viewOnce ? colors.white : theme.text.secondary}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.lockedRowBottom}>
            <View style={styles.lockedSide}>
              <Pressable
                onPress={discardRecording}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Delete recording"
                style={styles.lockedAction}
              >
                <ComposerIcon
                  icon={trashIcon}
                  provider={trashIconProvider ?? iconProvider}
                  size={24}
                  color={colors.error}
                />
              </Pressable>
            </View>
            <View style={styles.lockedCenterAction}>
              <Pressable
                onPress={togglePauseRecording}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={isPaused ? "Resume" : "Pause"}
                style={styles.lockedAction}
              >
                <ComposerIcon
                  icon={isPaused ? playIcon : pauseIcon}
                  provider={
                    isPaused
                      ? (playIconProvider ?? iconProvider)
                      : (pauseIconProvider ?? iconProvider)
                  }
                  size={26}
                  color={theme.text.primary}
                />
              </Pressable>
            </View>
            <View style={styles.lockedSide}>
              <Pressable
                onPress={sendRecording}
                accessibilityRole="button"
                accessibilityLabel="Send voice message"
                style={styles.lockedSendButton}
              >
                <ComposerIcon
                  icon={sendIcon}
                  provider={sendIconProvider ?? iconProvider}
                  size={20}
                  color={colors.white}
                />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        // Full-bleed bottom — same as locked mode above.
        <View
          style={[
            styles.composer,
            {
              paddingBottom: insets.bottom + spacing.sm,
              backgroundColor: isDark ? colors.surface : colors.white,
              borderTopColor: isDark ? colors.border : "rgba(0,0,0,0.08)",
            },
            style,
          ]}
        >
          {/* Attach — rendered once, outside the recording switch, so the layout
              left of the mic never changes identity mid-gesture. When the
              attachment panel is open this becomes a keyboard icon that
              restores the keyboard on tap. */}
          <Pressable
            onPress={toggleAttachmentSheet}
            style={styles.attachButton}
            accessibilityRole="button"
            accessibilityLabel={
              showAttachmentSheet ? "Show keyboard" : "Show attachments"
            }
          >
            <ComposerIcon
              icon={showAttachmentSheet ? keyboardIcon : attachIcon}
              provider={
                showAttachmentSheet
                  ? (keyboardIconProvider ?? iconProvider)
                  : (attachIconProvider ?? iconProvider)
              }
              size={24}
              color={theme.text.secondary}
            />
          </Pressable>

          {isRecording ? (
            // ── RECORDING MODE: the wave + timer replace the text input ──
            <View
              style={[
                styles.recordingWaveWrap,
                {
                  backgroundColor: isCancelling
                    ? colors.error + (isDark ? "22" : "12")
                    : isDark
                      ? colors.primary + "22"
                      : colors.primary + "12",
                  borderColor: recordingAccent + "40",
                },
              ]}
            >
              {waveBars.slice(0, 7).map((energy, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.waveBar,
                    {
                      backgroundColor: recordingAccent,
                      // Live mic energy drives the bar height; silence still
                      // shows a thin bar rather than collapsing to zero.
                      transform: [
                        {
                          scaleY: Math.max(0.12, Math.min(1, energy)),
                        },
                      ],
                    },
                  ]}
                />
              ))}

              {/* Duration timer */}
              <Text
                variant="caption"
                style={[styles.durationText, { color: recordingAccent }]}
              >
                {formatDuration(recordingDuration)}
              </Text>
            </View>
          ) : (
            // ── NORMAL MODE: text input ──
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: isDark ? colors.surfaceLight : "#F3F4F6",
                  borderColor: isDark ? colors.borderLight : "#E5E7EB",
                },
              ]}
            >
              <TextInput
                ref={inputRef}
                value={draft}
                onChangeText={(text) => {
                  setDraft(text);
                  onChangeText(text);
                }}
                placeholder={placeholder}
                placeholderTextColor={theme.text.tertiary}
                maxLength={maxMessageLength}
                multiline
                onFocus={() => {
                  // Typing brings the keyboard back — the panel yields its slot.
                  if (showAttachmentSheet) setShowAttachmentSheet(false);
                }}
                style={[
                  styles.input,
                  {
                    color: theme.text.primary,
                    fontSize: typography.size.md,
                  },
                ]}
              />
            </View>
          )}

          {/* One mic, both gestures, on both screens — and crucially it stays
              mounted for the whole gesture. Swapping the mic out mid-press (as the
              old press-only / swipe-only variants did) unmounted the responder and
              dropped the release event, which is why exactly one gesture worked on
              each screen. */}
          {/* View-once toggle for text / file / media sends — always visible
              (even on an empty composer) so it's there while typing and when
              the attachment panel is open. Armed state is shared with the
              locked recorder and the attachment sheet. */}
          {showViewOnce && !isRecording ? (
            <Pressable
              onPress={toggleViewOnce}
              hitSlop={8}
              accessibilityRole="togglebutton"
              accessibilityState={{ selected: viewOnce }}
              accessibilityLabel="View once"
              style={[
                styles.composerViewOnce,
                {
                  backgroundColor: viewOnce
                    ? colors.primary
                    : isDark
                      ? colors.surfaceLight
                      : "#F3F4F6",
                },
              ]}
            >
              <ComposerIcon
                icon={viewOnce ? viewOnceIcon : viewOnceOffIcon}
                provider={
                  viewOnce
                    ? (viewOnceIconProvider ?? iconProvider)
                    : (viewOnceOffIconProvider ?? iconProvider)
                }
                size={18}
                color={viewOnce ? colors.white : theme.text.secondary}
              />
            </Pressable>
          ) : null}
          {showSendButton ? (
            <Pressable onPress={send} style={styles.sendButton}>
              <ComposerIcon
                icon={sendIcon}
                provider={sendIconProvider ?? iconProvider}
                size={20}
                color={colors.white}
              />
            </Pressable>
          ) : (
            <View style={micButtonStyle} {...micPanResponder.panHandlers}>
              {micIconElement}
            </View>
          )}
        </View>
      )}

      {/* ── Attachment panel: inline, takes the keyboard's slot ──
          Rendered inside the composer column (not a Modal) so it pushes the
          thread up exactly like the keyboard does. Height is a compact fixed
          value, capped below a full keyboard height so there's no tall empty
          block under the 2-row grid. */}
      {showAttachmentSheet ? (
        <View
          style={[
            styles.sheetInline,
            {
              // Extra room for the view-once row when it's shown.
              height:
                (keyboardHeight ? Math.min(keyboardHeight, 200) : 184) +
                (showViewOnce ? 52 : 0),
              paddingBottom: insets.bottom + spacing.sm,
              backgroundColor: isDark ? colors.surface : colors.white,
            },
          ]}
        >
          {/* View-once arming while picking file / media — same shared state
              as the composer row, so arming here carries into the send. */}
          {showViewOnce ? (
            <Pressable
              onPress={toggleViewOnce}
              hitSlop={8}
              accessibilityRole="togglebutton"
              accessibilityState={{ selected: viewOnce }}
              accessibilityLabel="View once"
              style={styles.sheetViewOnceRow}
            >
              <View
                style={[
                  styles.sheetViewOnceToggle,
                  {
                    backgroundColor: viewOnce
                      ? colors.primary
                      : isDark
                        ? colors.surfaceLight
                        : "#F3F4F6",
                  },
                ]}
              >
                <ComposerIcon
                  icon={viewOnce ? viewOnceIcon : viewOnceOffIcon}
                  provider={
                    viewOnce
                      ? (viewOnceIconProvider ?? iconProvider)
                      : (viewOnceOffIconProvider ?? iconProvider)
                  }
                  size={18}
                  color={viewOnce ? colors.white : theme.text.secondary}
                />
              </View>
              <Text
                variant="bodyMedium"
                color={viewOnce ? "primary" : "secondary"}
                style={styles.sheetViewOnceLabel}
              >
                View once{viewOnce ? " • on" : ""}
              </Text>
            </Pressable>
          ) : null}
          <View style={styles.sheetGrid}>
            {resolvedAttachmentOptions.map((item) => (
              <Pressable
                key={item.label}
                style={styles.sheetItem}
                onPress={() => handleAttachmentPress(item)}
              >
                <View style={styles.sheetItemIcon}>
                  {/* Per-tile provider: item.icon ({name, provider} or element)
                      wins, else item.name via item.provider, else the
                      component-wide iconProvider default. */}
                  <ComposerIcon
                    icon={item.icon ?? item.name}
                    provider={item.provider ?? iconProvider}
                    size={28}
                    color={theme.colors.primary}
                  />
                </View>
                <Text
                  variant="bodyMedium"
                  color="default"
                  style={styles.sheetItemLabel}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}

export default memo(ChatInput);

const styles = StyleSheet.create({
  // ── Composer container ──────────────────────────
  composer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
    borderTopWidth: layout.borderWidth.thin,
  },

  // ── Attach button ─────────────────────────────────
  // Fixed 40x40 to mirror the mic/send slot on the right, so the wave
  // pill between them sits dead-center in recording mode.
  attachButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },

  // ── Text input ────────────────────────────────────
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === "ios" ? 6 : 2,
    minHeight: 40,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    fontSize: typography.size.md,
    textAlignVertical: "center",
  },

  // ── Send / voice buttons ────────────────────────
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
  },

  // ── View-once toggle on the text composer row ───
  // Sits between the input and the mic/send slot; styled like the idle
  // voice button so the row keeps its rhythm, primary-filled when armed.
  composerViewOnce: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
  },

  // ── Recording mode ──────────────────────────────
  recordingWaveWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 40,
    gap: 4,
    overflow: "hidden",
  },
  durationText: {
    fontWeight: "700",
    fontSize: 13,
    marginLeft: spacing.xs,
    minWidth: 36,
    textAlign: "right",
  },
  waveBar: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    backgroundColor: colors.primary,
  },

  // ── Locked (hands-free) recording ─────────────────
  composerLocked: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: layout.borderWidth.thin,
    gap: spacing.xs,
  },
  lockedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  vmCounter: {
    width: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  vmCounterText: {
    fontWeight: "700",
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  lockedWaveWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 40,
    gap: 3,
    overflow: "hidden",
  },
  lockedWaveBar: {
    width: 3,
  },
  viewOnceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  // Mirrors vmCounter's width so row 1's wave stays dead-center; the 36px
  // view-once toggle stays centered inside its 64px slot.
  viewOnceSlot: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  // Row 2 mirrors row 1's columns — 64px | flex wave | 64px — so trash sits
  // under the duration, pause/play under the wave's center, and send under
  // the view-once toggle. Same gap as lockedRow keeps the columns aligned.
  lockedRowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    gap: spacing.xs,
  },
  lockedSide: {
    width: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  lockedCenterAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedAction: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedSendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Reply bar ─────────────────────────────────────
  replyBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
    borderBottomWidth: layout.borderWidth.thin,
  },
  replyClose: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  replyPreview: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.sm,
  },
  replyAccent: {
    width: 3,
    alignSelf: "stretch",
    borderRadius: 1.5,
    marginRight: spacing.sm,
  },
  replyTextWrap: {
    flex: 1,
  },
  replyFrom: {
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },

  // ── Attachment panel (inline, keyboard slot) ────
  // Compact: just tall enough for the view-once row + 2-row grid + safe
  // area, capped well below a full keyboard height so there's no tall empty
  // block.
  sheetInline: {
    borderTopWidth: 0,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  // View-once arming row above the grid — slim, left-aligned, mirrors the
  // circular toggle styling used on the composer row.
  sheetViewOnceRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  sheetViewOnceToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },
  sheetViewOnceLabel: {
    fontWeight: "600",
  },
  sheetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // Exact thirds with NO gap: a gap on top of 33.33% widths pushes every
    // 3rd item onto its own row (2 columns x 3 rows underneath each other),
    // and the fixed panel height then clips the last row.
  },
  sheetItem: {
    width: "33.33%",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  sheetItemIcon: {
    width: 52,
    height: 52,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  sheetItemLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
});
