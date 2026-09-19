// app/(main)/chats/[id].jsx
// Individual conversation: message thread, typing indicator, and a composer
// with attach / voice-note affordances. Sending writes into chatStore.

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useChatStore from "../../../stores/chatStore";
import useAppStore from "../../../stores/appStore";
import useAuthStore from "../../../stores/authStore";
import useAppTheme from "../../../hooks/useAppTheme";
import { Header, Screen } from "../../../components/common";
import { Avatar, EmptyState, IconButton, Text, VerifiedBadge } from "../../../components/ui";
import useProfileStore from "../../../stores/profileStore";
import MessageBubble from "../../../components/chats/MessageBubble";
import ChatInput from "../../../components/chats/ChatInput";
import VoicePlayer from "../../../components/chats/VoicePlayer";
import DateDivider from "../../../components/chats/DateDivider";
import { startsNewDay } from "../../../utils/chatDates";

// View-once reveal helpers (the preview modal over the chat screen).
function fmtTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// A message can be edited only by its author, only when it isn't a view-once
// payload (those are immutable by design), and only when it actually carries
// editable text — either a plain text message or a media caption.
function canEditMessage(message) {
  return Boolean(
    message?.isMine &&
      !message.viewOnce &&
      typeof message.text === "string" &&
      message.text.trim().length > 0,
  );
}

// Full-screen video surface for media previews (expo-video, SDK 54). Rendered
// only while a video preview is open, so the player hook lives and dies with
// the preview. Autoplays; ✕ closes and unmounts it.
function VideoPreviewLayer({ uri }) {
  const player = useVideoPlayer(uri, (p) => {
    p.play();
  });
  return (
    <VideoView
      style={styles.revealMediaFull}
      player={player}
      contentFit="contain"
      allowsFullscreen
      allowsPictureInPicture={false}
    />
  );
}

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const listRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const conversation = useChatStore((s) => s.conversationsById[id]);
  const thread = useChatStore((s) => s.threads[id]);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const deleteMessage = useChatStore((s) => s.deleteMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const downloadViewOnceMessage = useChatStore(
    (s) => s.downloadViewOnceMessage,
  );
  const markViewOnceViewed = useChatStore((s) => s.markViewOnceViewed);
  const showToast = useAppStore((s) => s.showToast);
  const { isDark, theme } = useAppTheme();
  const typing = useChatStore((s) => s.typing[id]);
  const fetchMessages = useChatStore((s) => s.fetchMessages);

  const [replyTo, setReplyTo] = useState(null);
  // View-once message currently revealed in the full-screen preview modal.
  const [reveal, setReveal] = useState(null);
  // Regular media message currently open in the preview modal.
  const [preview, setPreview] = useState(null);
  // Long-press menu: stores the full message for the popover menu.
  const [activeMenuMessage, setActiveMenuMessage] = useState(null);
  // Message currently being edited in the composer (null when not editing).
  const [editingMessage, setEditingMessage] = useState(null);
  // Track selected message for visual feedback (WhatsApp-style)
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  // Multi-select mode
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!id) return;
    setActiveConversation(id);
    // Load messages if thread doesn't exist or is empty
    if (!thread?.ids?.length) {
      fetchMessages({ conversationId: id });
    }
  }, [id, setActiveConversation, thread?.ids?.length, fetchMessages]);

  // Keep the FlatList from trying to render messages while the thread is still
  // initialising (i.e. before fetchMessages has populated `byId`). The `thread`
  // selector above can expose an empty `byId` during the brief window between the
  // `setActiveConversation` write and the async `fetchMessages` response, which
  // would otherwise crash MessageBubble on missing message shapes.
  const safeThread = thread && Array.isArray(thread.ids) ? thread : null;
  const messages =
    safeThread?.ids?.map((mid) => safeThread.byId[mid]).filter(Boolean) ?? [];

  const peer = conversation?.participants?.[0] || {};
  const isGroup = conversation?.type === "group";
  const title = isGroup ? conversation.name : peer.name || peer.username;
  const isVerified = useProfileStore((s) =>
    Boolean(!isGroup && peer?.id && s.verifiedUsers[peer.id]),
  );
  const verifiedBadge = isVerified
    ? useProfileStore.getState().getVerifiedBadge(peer.id)
    : null;

  // The composer (components/chats/ChatInput) owns the draft, recording and
  // attachment-sheet state. It reports typing changes so the store can broadcast
  // them to the other participants.
  const handleTyping = useCallback(
    (isTyping) => {
      setTyping(id, user?.id, isTyping);
    },
    [id, setTyping, user?.id],
  );

  const typingUsers = typing
    ? Object.entries(typing)
        .filter(([_, expires]) => expires > Date.now())
        .map(
          ([userId]) =>
            conversation?.participants?.find((p) => p.id === userId)?.name,
        )
        .filter(Boolean)
    : [];

  const typingText =
    typingUsers.length > 0
      ? typingUsers.length === 1
        ? `${typingUsers[0]} is typing...`
        : `${typingUsers.slice(0, 2).join(", ")} are typing...`
      : null;

  const handleLongPress = useCallback(
    (message) => {
      // Haptic feedback (WhatsApp-style medium impact)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Set visual selection state
      setSelectedMessageId(message.id);

      // If already in multi-select mode, toggle selection
      if (selectedMessages.size > 0) {
        const newSelected = new Set(selectedMessages);
        if (newSelected.has(message.id)) {
          newSelected.delete(message.id);
        } else {
          newSelected.add(message.id);
        }
        setSelectedMessages(newSelected);
        if (newSelected.size === 0) {
          setActiveMenuMessage(null);
        }
        return;
      }

      // First long press - open menu
      setActiveMenuMessage(message);
      setSelectedMessages(new Set([message.id]));
    },
    [selectedMessages],
  );

  const handleMessagePress = useCallback(
    (message) => {
      // In multi-select mode, toggle selection on tap
      if (selectedMessages.size > 0) {
        Haptics.selectionAsync();
        const newSelected = new Set(selectedMessages);
        if (newSelected.has(message.id)) {
          newSelected.delete(message.id);
        } else {
          newSelected.add(message.id);
        }
        setSelectedMessages(newSelected);
        if (newSelected.size === 0) {
          setActiveMenuMessage(null);
        }
      }
      // Clear visual selection after a moment
      setTimeout(() => setSelectedMessageId(null), 150);
    },
    [selectedMessages],
  );

  const clearSelection = useCallback(() => {
    setSelectedMessageId(null);
    setSelectedMessages(new Set());
    setActiveMenuMessage(null);
  }, []);

  const handleReply = useCallback((message) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Reply and edit share the bar above the composer — replying exits edit mode.
    setEditingMessage(null);
    setReplyTo(message);
    clearSelection();
  }, [clearSelection]);

  // ── Edit / delete ─────────────────────────────────
  // Edit seeds the composer with the message text (ChatInput prefills the draft
  // and shows the "Editing message" bar); Delete removes it from the local
  // thread after a confirmation.
  const startEditing = useCallback(
    (message) => {
      if (!canEditMessage(message)) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setEditingMessage(message);
      setReplyTo(null);
      clearSelection();
    },
    [clearSelection],
  );

  const cancelEditing = useCallback(() => setEditingMessage(null), []);

  const submitEdit = useCallback(
    ({ messageId, text }) => {
      const trimmed = text?.trim();
      if (!messageId || !trimmed) return;
      // A re-submitted, unchanged draft must not flag the bubble as "edited".
      if (trimmed === editingMessage?.text?.trim()) {
        setEditingMessage(null);
        return;
      }
      updateMessage({
        conversationId: id,
        messageId,
        patch: { text: trimmed, edited: true, editedAt: Date.now() },
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setEditingMessage(null);
      showToast("Message edited", "success");
    },
    [id, editingMessage, updateMessage, showToast],
  );

  const removeMessages = useCallback(
    (messageIds) => {
      const ids = (Array.isArray(messageIds) ? messageIds : [messageIds]).filter(
        Boolean,
      );
      ids.forEach((messageId) =>
        deleteMessage({ conversationId: id, messageId }),
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      clearSelection();
      showToast(
        ids.length > 1 ? `${ids.length} messages deleted` : "Message deleted",
        "success",
      );
    },
    [id, deleteMessage, clearSelection, showToast],
  );

  const confirmDelete = useCallback(
    (message) => {
      if (!message) return;
      Alert.alert(
        "Delete message?",
        "This message will be removed from this conversation.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => removeMessages(message.id),
          },
        ],
      );
    },
    [removeMessages],
  );

  const confirmDeleteSelected = useCallback(() => {
    const count = selectedMessages.size;
    if (!count) return;
    Alert.alert(
      `Delete ${count} messages?`,
      "These messages will be removed from this conversation.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeMessages([...selectedMessages]),
        },
      ],
    );
  }, [selectedMessages, removeMessages]);

  const openChatInfo = () => {
    router.navigate(`/(main)/chats/info?id=${id}`);
  };

  // ── View-once flow ─────────────────────────────────
  // Sent/received view-once messages are BLOCKED in-thread: their content is
  // never rendered inline. A receiver tap downloads the payload and reveals it
  // in a full-screen preview modal OVER the chat screen — closing the modal
  // lands straight back on the chat with the bubble flipped to
  // "Opened — no re-views". The sender's bubble can never open; it only
  // reflects the "Opened" receipt once the receiver has viewed it.
  const handleViewOnceDownload = useCallback(
    (message) => {
      downloadViewOnceMessage({ conversationId: id, message });
    },
    [id, downloadViewOnceMessage],
  );

  const handleViewOnceOpen = useCallback(
    (message) => {
      // Consume the one-time reveal up front: the bubble flips to
      // "Opened — no re-views" the moment the preview modal opens, and a
      // second tap on it is inert.
      markViewOnceViewed(message.id);
      setReveal(message);
    },
    [markViewOnceViewed],
  );

  const closeReveal = useCallback(() => setReveal(null), []);

  // Chat-bubble palette for the in-modal text / voice bubbles — mirrors the
  // other-side styling used by MessageBubble.
  const revealBubbleColor = isDark ? colors.chatBubbleOther : "#F1F1F5";
  const revealContentColor = isDark ? colors.white : "#111118";

  // ── Media interactions ─────────────────────────────
  // Photos / videos open the in-app full-screen preview. Files (PDF) download
  // to cache and are handed to the phone's PDF viewer via the system sheet.
  const openPdfExternally = useCallback(
    async (message) => {
      const url = message?.mediaUrl;
      if (!url) {
        showToast("File unavailable", "error");
        return;
      }
      try {
        let fileUri = url;
        if (!url.startsWith("file:")) {
          // Download to cache first, then hand off to the system viewer.
          const destination = new Directory(Paths.cache, "pdfs");
          const output = await File.downloadFileAsync(url, destination);
          fileUri = output.uri;
        }
        if (await Sharing.isAvailableAsync()) {
          // System sheet -> any installed PDF viewer ("Open with …").
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            UTI: "com.adobe.pdf",
            dialogTitle: message.fileName || "Open PDF",
          });
        } else {
          await Linking.openURL(url);
        }
      } catch {
        showToast("Couldn't open the PDF", "error");
      }
    },
    [showToast],
  );

  const handleMediaPress = useCallback(
    (message) => {
      if (!message) return;
      if (message.mediaType === "file") {
        openPdfExternally(message);
        return;
      }
      if (message.mediaType === "image" || message.mediaType === "video") {
        if (!message.mediaUrl) {
          showToast("Preview unavailable", "info");
          return;
        }
        setPreview(message);
      }
    },
    [openPdfExternally, showToast],
  );

  const closePreview = useCallback(() => setPreview(null), []);

  const subtitle = typingText || (peer?.isOnline ? "online" : undefined);

  // Build header title with avatar(s) next to name
  const HeaderTitle = () => {
    if (isGroup) {
      const participants = conversation?.participants || [];
      // Show up to 3 avatars for groups
      const displayParticipants = participants.slice(0, 3);
      return (
        <View style={styles.groupTitle}>
          <View style={styles.avatarStack}>
            {displayParticipants.map((p, i) => (
              <Avatar
                key={p.id}
                uri={p.avatarUrl}
                name={p.name}
                size="sm"
                style={[
                  styles.stackAvatar,
                  { zIndex: 3 - i, marginLeft: i > 0 ? -12 : 0 },
                ]}
              />
            ))}
            {participants.length > 3 && (
              <View
                style={[styles.stackAvatar, styles.stackMore, { zIndex: 0 }]}
              >
                <Text
                  variant="caption"
                  color="default"
                  style={{ fontWeight: "600", fontSize: 10 }}
                >
                  +{participants.length - 3}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.titleColumn}>
            <View style={styles.titleLine}>
              <Text
                variant="subtitle"
                color="default"
                numberOfLines={1}
                onPress={openChatInfo}
              >
                {title}
              </Text>
              {verifiedBadge && (
                <VerifiedBadge
                  size={18}
                  color={verifiedBadge.iconColor || verifiedBadge.color}
                  iconName="verified"
                />
              )}
            </View>
            {subtitle && (
              <Text variant="caption" color="tertiary" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      );
    }
    // Direct message - single avatar next to name
    return (
      <View style={styles.dmTitle}>
        <Pressable onPress={openChatInfo} hitSlop={8}>
          <Avatar
            uri={peer.avatarUrl}
            name={peer.name}
            size="md"
            online={peer.isOnline}
          />
        </Pressable>
        <View style={styles.titleColumn}>
          <View style={styles.titleLine}>
            <Text
              variant="subtitle"
              color="default"
              numberOfLines={1}
              onPress={openChatInfo}
            >
              {title}
            </Text>
            {verifiedBadge && (
              <VerifiedBadge
                size={18}
                color={verifiedBadge.iconColor || verifiedBadge.color}
                iconName="verified"
              />
            )}
          </View>
          {subtitle && (
            <Text variant="caption" color="tertiary" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <Screen
      style={styles.container}
      padded={false}
      keyboardAvoiding={false}
      edges={["top"]}
      header={
        <Header
          showBack
          centerTitle={false}
          compactTitle
          title={<HeaderTitle />}
          subtitle={null}
          right={
            <View style={styles.headerActions}>
              <IconButton
                name="call-outline"
                onPress={() =>
                  router.navigate(`/(main)/chats/call/voice?id=${id}`)
                }
              />
              <IconButton
                name="videocam-outline"
                onPress={() =>
                  router.navigate(`/(main)/chats/call/video?id=${id}`)
                }
              />
            </View>
          }
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.keyboardAvoiding}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
              const prevMsg = messages[index - 1];
              const nextMsg = messages[index + 1];
              // A new calendar day breaks the "same sender" run: the day's
              // first bubble gets its avatar, name and tail back even when the
              // previous message came from the same person.
              const opensDay = startsNewDay(messages, index);
              const sameSenderAsPrev =
                !opensDay &&
                prevMsg &&
                prevMsg.isMine === item.isMine &&
                prevMsg.senderId === item.senderId;
              // The speaker changes after this bubble -> widen the gap below it.
              // Skipped when the next message opens a new day, because the
              // DateDivider above that message already provides the separation
              // (adding both would leave an oversized hole).
              const senderSwitchAfter =
                Boolean(nextMsg) &&
                !startsNewDay(messages, index + 1) &&
                (nextMsg.isMine !== item.isMine ||
                  nextMsg.senderId !== item.senderId);
              const showAvatar = item.isMine
                ? false
                : !prevMsg ||
                  opensDay ||
                  prevMsg.isMine ||
                  prevMsg.senderId !== item.senderId;
              const showName = isGroup && !item.isMine && showAvatar;
              const isSelected = selectedMessages.has(item.id);
              return (
                <View>
                  {opensDay ? <DateDivider date={item.createdAt} /> : null}
                  <MessageBubble
                    message={item}
                    onLongPress={handleLongPress}
                    onPress={handleMessagePress}
                    onReply={handleReply}
                    selected={isSelected}
                    showAvatar={showAvatar}
                    showName={showName}
                    isGroup={isGroup}
                    showTail={!sameSenderAsPrev}
                    isGrouped={Boolean(sameSenderAsPrev)}
                    senderSwitchAfter={senderSwitchAfter}
                    onViewOnceDownload={handleViewOnceDownload}
                    onViewOnceOpen={handleViewOnceOpen}
                    onMediaPress={handleMediaPress}
                  />
                </View>
              );
            }}
            contentContainerStyle={
              messages.length === 0 ? styles.emptyContent : styles.content
            }
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd?.({ animated: false })
            }
            ListEmptyComponent={
              <EmptyState
                icon="chatbubble-outline"
                title="No messages yet"
                description={`Say hi to ${title || "them"} — this conversation is just getting started.`}
              />
            }
          />

          <ChatInput
            key={id}
            conversationId={id}
            user={user}
            onSend={sendMessage}
            onTyping={handleTyping}
            replyTo={replyTo}
            onReplyChange={setReplyTo}
            editingMessage={editingMessage}
            onEditSubmit={submitEdit}
            onCancelEdit={cancelEditing}
            listRef={listRef}
            onToast={showToast}
          />
      </KeyboardAvoidingView>

      {/* ── View-once preview modal ──────────────────────
          Rendered over the chat screen itself (no route push): closing it
          drops the user straight back into the conversation, with the
          bubble already marked "Opened — no re-views". Minimal chrome:
          an ✕ to dismiss (top-left) and a view-once eye (top-right) — no
          sender profile, no footer button. Image / video take the full
          screen; text / voice render as chat-style bubbles. */}
      <Modal
        visible={Boolean(reveal)}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={closeReveal}
      >
        <View
          style={[
            styles.revealBackdrop,
            {
              paddingTop: insets.top + spacing.sm,
              paddingBottom: insets.bottom + spacing.sm,
            },
          ]}
        >
          {reveal ? (
            <>
              {/* Top bar: ✕ dismiss · view-once eye */}
              <View style={styles.revealHeader}>
                <Pressable
                  onPress={closeReveal}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.revealXBtn,
                    pressed && { opacity: 0.6 },
                  ]}
                  accessibilityLabel="Close view once"
                >
                  <Ionicons name="close" size={26} color={colors.white} />
                </Pressable>
                <MaterialCommunityIcons
                  name="progress-check"
                  size={24}
                  color={colors.white}
                />
              </View>

              <View style={styles.revealBody}>
                {reveal.mediaType === "image" && reveal.mediaUrl ? (
                  // Full-screen photo
                  <Image
                    source={{ uri: reveal.mediaUrl }}
                    style={styles.revealMediaFull}
                    resizeMode="contain"
                  />
                ) : reveal.mediaType === "video" ? (
                  // Full-screen video surface (plays when a source exists)
                  reveal.mediaUrl ? (
                    <VideoPreviewLayer uri={reveal.mediaUrl} />
                  ) : (
                    <View style={styles.revealMediaFull}>
                      <Ionicons
                        name="play-circle"
                        size={96}
                        color="rgba(255,255,255,0.9)"
                      />
                    </View>
                  )
                ) : (
                  // Text / voice render as chat-style bubbles
                  <ScrollView
                    contentContainerStyle={styles.revealBubbleScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    <View
                      style={[
                        styles.revealBubble,
                        { backgroundColor: revealBubbleColor },
                      ]}
                    >
                      <View
                        style={[
                          styles.revealTail,
                          { borderRightColor: revealBubbleColor },
                        ]}
                      />
                      {reveal.mediaType === "voice" ? (
                        <VoicePlayer
                          uri={reveal.mediaUrl || null}
                          duration={reveal.duration}
                          waveform={reveal.waveform}
                          color={revealContentColor}
                        />
                      ) : null}

                      {reveal.text ? (
                        <Text
                          variant="body"
                          style={[
                            styles.revealBubbleText,
                            { color: revealContentColor },
                          ]}
                        >
                          {reveal.text}
                        </Text>
                      ) : null}

                      <Text
                        variant="caption"
                        style={[
                          styles.revealBubbleTime,
                          { color: revealContentColor },
                        ]}
                      >
                        {fmtTime(reveal.createdAt)}
                      </Text>
                    </View>
                  </ScrollView>
                )}
              </View>
            </>
          ) : null}
        </View>
      </Modal>

      {/* ── Media preview modal (photos / videos) ────────
          Also rendered over the chat screen: ✕ closes back into the
          conversation. Photos render edge-to-edge; videos autoplay via
          expo-video. PDFs never land here — they go to the system viewer. */}
      <Modal
        visible={Boolean(preview)}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View
          style={[
            styles.revealBackdrop,
            {
              paddingTop: insets.top + spacing.sm,
              paddingBottom: insets.bottom + spacing.sm,
            },
          ]}
        >
          {preview ? (
            <>
              <View style={styles.revealHeader}>
                <Pressable
                  onPress={closePreview}
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.revealXBtn,
                    pressed && { opacity: 0.6 },
                  ]}
                  accessibilityLabel="Close preview"
                >
                  <Ionicons name="close" size={26} color={colors.white} />
                </Pressable>
                {/* <Text
                  variant="caption"
                  numberOfLines={1}
                  style={{ color: colors.white, opacity: 0.75, flex: 1, textAlign: "right" }}
                >
                  {preview.fileName || "Preview"}
                </Text> */}
              </View>

              <View style={styles.revealBody}>
                {preview.mediaType === "video" && preview.mediaUrl ? (
                  <VideoPreviewLayer uri={preview.mediaUrl} />
                ) : preview.mediaUrl ? (
                  <Image
                    source={{ uri: preview.mediaUrl }}
                    style={styles.revealMediaFull}
                    resizeMode="contain"
                  />
                ) : (
                  <Ionicons
                    name="image-outline"
                    size={64}
                    color="rgba(255,255,255,0.5)"
                  />
                )}
              </View>
            </>
          ) : null}
        </View>
      </Modal>

      {/* ── Message long-press action sheet (bottom sheet) ─────
          Slides up from bottom like WhatsApp on iOS. Contains message actions:
          Copy, Forward, Reply, Edit (own text / captions only), React and
          Delete. */}
      <Modal
        visible={Boolean(activeMenuMessage)}
        transparent
        animationType="fade"
        onRequestClose={clearSelection}
      >
        <Pressable style={styles.actionSheetBackdrop} onPress={clearSelection}>
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionSheetHandle} />
            <View
              style={[
                styles.actionSheetContent,
                {
                  backgroundColor: isDark ? colors.surface : colors.white,
                  paddingBottom: spacing.lg + (insets?.bottom || 0),
                },
              ]}
            >
              {selectedMessages.size > 1 && (
                <Text
                  variant="bodyMedium"
                  color={isDark ? "secondary_text" : "tertiary_text"}
                  style={styles.actionSheetTitle}
                >
                  {selectedMessages.size} messages selected
                </Text>
              )}
              <Pressable
                style={styles.actionSheetItem}
                onPress={() => {
                  clearSelection(); /* copy */
                }}
              >
                <Ionicons
                  name="copy-outline"
                  size={24}
                  color={theme.text.primary}
                  style={styles.actionSheetIcon}
                />
                <Text variant="bodyLarge" color="default">
                  Copy
                </Text>
              </Pressable>
              <Pressable
                style={styles.actionSheetItem}
                onPress={() => {
                  clearSelection(); /* forward */
                }}
              >
                <Ionicons
                  name="send-outline"
                  size={24}
                  color={theme.text.primary}
                  style={styles.actionSheetIcon}
                />
                <Text variant="bodyLarge" color="default">
                  Forward
                </Text>
              </Pressable>
              <Pressable
                style={styles.actionSheetItem}
                onPress={() => {
                  if (activeMenuMessage) setReplyTo(activeMenuMessage);
                  clearSelection(); /* reply */
                }}
              >
                <MaterialCommunityIcons
                  name="reply-outline"
                  size={24}
                  color={theme.text.primary}
                  style={styles.actionSheetIcon}
                />
                <Text variant="bodyLarge" color="default">
                  Reply
                </Text>
              </Pressable>
              {canEditMessage(activeMenuMessage) && selectedMessages.size === 1 && (
                <Pressable
                  style={styles.actionSheetItem}
                  onPress={() => startEditing(activeMenuMessage)}
                >
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={theme.text.primary}
                    style={styles.actionSheetIcon}
                  />
                  <Text variant="bodyLarge" color="default">
                    Edit
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={styles.actionSheetItem}
                onPress={() => {
                  clearSelection(); /* react */
                }}
              >
                <MaterialCommunityIcons
                  name="emoticon-happy-outline"
                  size={24}
                  color={theme.text.primary}
                  style={styles.actionSheetIcon}
                />
                <Text variant="bodyLarge" color="default">
                  React
                </Text>
              </Pressable>
              {activeMenuMessage && selectedMessages.size === 1 && (
                <Pressable
                  style={[
                    styles.actionSheetItem,
                    styles.actionSheetItemDestructive,
                  ]}
                  onPress={() => confirmDelete(activeMenuMessage)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={theme.status.error}
                    style={styles.actionSheetIcon}
                  />
                  <Text variant="bodyLarge" color={theme.status.error}>
                    Delete
                  </Text>
                </Pressable>
              )}
              {selectedMessages.size > 1 && (
                <Pressable
                  style={[
                    styles.actionSheetItem,
                    styles.actionSheetItemDestructive,
                  ]}
                  onPress={confirmDeleteSelected}
                >
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={theme.status.error}
                    style={styles.actionSheetIcon}
                  />
                  <Text variant="bodyLarge" color={theme.status.error}>
                    Delete {selectedMessages.size} messages
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Wraps the whole thread (list + composer) so a tap anywhere outside an
  // open long-press menu dismisses it. Child Pressables (bubbles, composer
  // buttons) still receive their own press events — dismissing the menu on a
  // tap that also sends a message is the expected behaviour.
  screenTapArea: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarStack: {
    flexDirection: "row",
  },
  stackAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.background,
  },
  stackMore: {
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  dmTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    paddingVertical: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // ── View-once preview modal (over the chat screen) ──
  revealBackdrop: {
    flex: 1,
    backgroundColor: colors.black,
  },
  // ✕ (left) · view-once eye (right) — no sender profile, no timestamp.
  revealHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  revealXBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  revealBody: {
    flex: 1,
  },
  // Photo / video fill the whole area between the top bar and the safe area.
  revealMediaFull: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  // Text / voice: chat-style bubble — hugs its content like bubbles in the
  // thread (children of a ScrollView stretch by default, hence alignSelf),
  // with the same WhatsApp corner + tail treatment.
  revealBubbleScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  revealBubble: {
    alignSelf: "flex-start",
    maxWidth: "78%",
    borderRadius: layout.borderRadius.sm,
    borderTopLeftRadius: layout.borderRadius.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
  },
  revealTail: {
    position: "absolute",
    top: 0,
    left: -5,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 0,
    borderRightWidth: 7,
  },
  revealBubbleText: {
    marginBottom: spacing.xxs,
  },
  revealBubbleTime: {
    alignSelf: "flex-end",
    fontSize: 10,
    opacity: 0.6,
  },
  // ── Message long-press action sheet (bottom sheet) ──
  actionSheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  actionSheetContainer: {
    backgroundColor: "transparent",
  },
  actionSheetHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionSheetContent: {
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: layout.borderRadius.xl,
    borderTopRightRadius: layout.borderRadius.xl,
  },
  actionSheetTitle: {
    paddingVertical: spacing.sm,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
  },
  actionSheetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.md,
  },
  actionSheetItemDestructive: {
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  actionSheetIcon: {
    width: 28,
    textAlign: "center",
  },
});
