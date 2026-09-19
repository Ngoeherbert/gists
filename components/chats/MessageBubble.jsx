// components/chats/MessageBubble.jsx
// A single chat message. Own messages align right and use the brand bubble;
// incoming messages align left. Includes a timestamp and read receipt.

import React, { memo, useRef } from "react";
import { Pressable, StyleSheet, View, Image, Animated } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";
import Avatar from "../ui/Avatar";
import VoicePlayer from "./VoicePlayer";
import { VerifiedBadge } from "../ui/VerifiedBadge";
import useProfileStore from "../../stores/profileStore";

function timeLabel(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const VIEW_ONCE_TYPE = {
  image: "Photo",
  video: "Video",
  voice: "Voice",
};

function viewOnceTypeLabel(message) {
  if (!message) return "Text";
  if (VIEW_ONCE_TYPE[message.mediaType])
    return VIEW_ONCE_TYPE[message.mediaType];
  return message.text ? "Text" : "Message";
}

// Sender-side icon for the view-once bubble:
//   • sent, not yet opened -> lock-closed
//   • opened by receiver   -> eye
// Receiver-side:
//   • locked               -> lock-closed
//   • downloaded (in viewer) -> download-outline
//   • consumed             -> eye-off (no re-views)
function viewOnceIconName(message, { mine, downloaded, consumed }) {
  if (mine) return consumed ? "eye" : "lock-closed";
  if (consumed) return "eye-off";
  if (downloaded) return "download-outline";
  return "lock-closed";
}

function fileSizeLabel(bytes) {
  if (!bytes) return "File";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// iMessage-style curved tail: a small comma-shaped flick sitting just
// outside the bubble's bottom corner (the bubble itself stays a full,
// evenly-rounded pill — the corner is never flattened for the tail).
// `side` is 'left' (received, bottom-left tail) or 'right' (sent, bottom-right tail).
// Requires react-native-svg — run `npx expo install react-native-svg`
// (or `pnpm add react-native-svg`) if it isn't in the project yet.
function BubbleTail({ side, color }) {
  const isRight = side === "right";
  // Sent (right): tail hangs below the bottom-right corner.
  // Received (left): tail points upward from the top-left corner.
  return (
    <View
      style={{
        position: "absolute",
        [isRight ? "bottom" : "top"]: isRight ? -10 : -10,
        [side]: -40,
        width: 52,
        height: 52,
        transform: isRight
          ? undefined
          : [{ scaleX: -1 }, { scaleY: -1 }],
      }}
      pointerEvents="none"
    >
      <Svg width={52} height={52} viewBox="0 0 52 52">
        <Path d="M0,0 Q0,34.4 23.3,46.2 Q8.6,49.2 0,28.8 Z" fill={color} />
      </Svg>
    </View>
  );
}

function MessageBubble({
  message,
  onLongPress,
  onPress,
  onReply,
  selected = false,
  showAvatar = true,
  showName = false,
  isGroup = false,
  showTail = true,
  isGrouped = false,
  // True when the NEXT message in the thread comes from the other participant
  // (and isn't split off by a date divider). The bubble then leaves extra room
  // below itself so a sent message and a received reply never read as one
  // block. Declared here — rather than as a marginTop on the incoming bubble —
  // because marginBottom is this row's only spacing knob: an incoming marginTop
  // would stack on top of whatever the previous row already reserved, giving
  // 4 + top after a grouped run but 12 + top after a lone message.
  senderSwitchAfter = false,
  onViewOnceDownload,
  onViewOnceOpen,
  onMediaPress,
}) {
  const { isDark, theme } = useAppTheme();
  if (!message) return null;

  const mine = Boolean(message.isMine);
  const isViewOnce = Boolean(message.viewOnce);
  const viewOnceDownloaded = isViewOnce && Boolean(message.viewOnceDownloaded);
  // True for BOTH sides once the receiver has viewed the message in the viewer:
  //   • receiver -> bubble becomes inert (no re-views)
  //   • sender   -> drives the "Opened" receipt on their bubble
  const viewOnceConsumed = isViewOnce && Boolean(message.viewOnceConsumed);

  const bubbleColor = mine
    ? colors.chatBubbleMine
    : isDark
      ? colors.chatBubbleOther
      : "#F1F1F5";
  const textColor = mine ? colors.white : isDark ? colors.white : "#111118";
  
  // WhatsApp-style selection overlay color
  const selectionOverlayColor = mine
    ? "rgba(255,255,255,0.3)"
    : isDark
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.1)";

  // Swipe-to-reply gesture (WhatsApp-style: swipe right on received, left on sent)
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const REPLY_THRESHOLD = 60; // px to trigger reply

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: swipeAnim,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE && nativeEvent.state === State.END) {
      const translationX = nativeEvent.translationX;
      // Trigger reply if swipe exceeds threshold
      if ((!mine && translationX > REPLY_THRESHOLD) || (mine && translationX < -REPLY_THRESHOLD)) {
        onReply?.(message);
      }
      // Animate back to 0
      Animated.spring(swipeAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  const bubbleTransform = [
    {
      translateX: swipeAnim.interpolate({
        inputRange: [-REPLY_THRESHOLD * 2, -REPLY_THRESHOLD, 0, REPLY_THRESHOLD, REPLY_THRESHOLD * 2],
        outputRange: [-REPLY_THRESHOLD * 2, -REPLY_THRESHOLD, 0, REPLY_THRESHOLD, REPLY_THRESHOLD * 2],
        extrapolate: "clamp",
      }),
    },
  ];

  // Sender: a view-once message can NEVER be opened by the sender — the bubble
  // only ever shows (icon, type, timestamp) plus an "Opened" receipt once the
  // receiver has viewed it. Receiver: one tap downloads the payload and opens
  // the full-screen reveal modal over the chat; once viewed (consumed) the
  // bubble is inert — no second view.
  const handleBubblePress = () => {
    if (!isViewOnce) return;
    if (mine) return;
    if (viewOnceConsumed) return;
    if (!viewOnceDownloaded) onViewOnceDownload?.(message);
    onViewOnceOpen?.(message);
  };

  return (
    <View
      style={[
        styles.row,
        mine ? styles.rowMine : styles.rowOther,
        isGrouped && styles.rowGrouped,
        // Last so the speaker-change gap wins over the grouped spacing.
        senderSwitchAfter && styles.rowSenderSwitch,
      ]}
    >
      {!mine && showAvatar ? (
        <Avatar
          uri={message.senderAvatar}
          name={message.senderName}
          size="sm"
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarSpacer} />
      )}
      <View style={styles.bubbleWrap}>
                {!mine && showName && message.senderName && (
          <View style={styles.senderNameRow}>
            <Text
              variant="caption"
              color={isDark ? "secondary_text" : "tertiary_text"}
              style={styles.senderName}
            >
              {message.senderName}
            </Text>
            {message.senderId && useProfileStore.getState().verifiedUsers[message.senderId] && (
              <VerifiedBadge
                size={16}
                color={useProfileStore.getState().getVerifiedBadge(message.senderId).color}
                iconName="verified"
              />
            )}
          </View>
        )}

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={[-REPLY_THRESHOLD, REPLY_THRESHOLD]}
          activeOffsetY={[-8, 8]}
        >
          <Animated.View style={[{ transform: bubbleTransform }]}>
            <Pressable
              // Hand the *message* to the host callbacks — a bare
              // `onPress={onPress}` would pass the GestureResponderEvent
              // instead, which is why the long-press action sheet could never
              // tell an own message from a received one (hiding Edit/Delete).
              onPress={isViewOnce ? handleBubblePress : () => onPress?.(message)}
              onLongPress={isViewOnce ? undefined : () => onLongPress?.(message)}
              style={[
                styles.bubble,
                { backgroundColor: bubbleColor },
                isViewOnce && styles.bubblePill,
                message.mediaType === "voice" && styles.bubbleVoicePill,
              ]}
            >
          {selected && (
            <View style={[styles.selectionOverlay, { backgroundColor: selectionOverlayColor }]} pointerEvents="none" />
          )}
          {isViewOnce ? (
            // ── View-once: content is BLOCKED until revealed. The bubble
            //    never reveals text/media inline — that only happens in the
            //    full-screen preview modal after the tap. ──
            <View style={[styles.viewOnceLocked, { justifyContent: mine ? "flex-end" : "flex-start" }]}>
              <View style={styles.viewOnceLockedIcon}>
                <MaterialCommunityIcons
                  name="progress-clock"
                  size={24}
                  color={textColor}
                />
              </View>
              <Text
                variant="bodySmall"
                style={[styles.viewOnceLockedText, { color: textColor }]}
              >
                {mine
                  ? viewOnceConsumed
                    ? "Opened"
                    : "Sent"
                  : viewOnceConsumed
                    ? "Viewed"
                    : viewOnceTypeLabel(message)}
              </Text>
            </View>
          ) : (
            <>
              {message.replyTo ? (
                <View
                  style={[
                    styles.replyPreview,
                    {
                      borderLeftColor: mine
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.2)",
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    color={textColor}
                    style={{ opacity: 0.8, fontWeight: "600" }}
                  >
                    {message.replyTo.senderName || "You"}
                  </Text>
                  <Text
                    variant="caption"
                    color={textColor}
                    style={{ opacity: 0.7, numberOfLines: 1 }}
                  >
                    {message.replyTo.text?.slice(0, 50)}
                  </Text>
                </View>
              ) : null}

              {message.text ? (
                <Text
                  variant="body"
                  style={[styles.text, { color: textColor }]}
                >
                  {message.text}
                </Text>
              ) : null}

              {message.mediaType === "image" && message.mediaUrl ? (
                <Pressable
                  onPress={() => onMediaPress?.(message)}
                  // The media pressable owns the touch responder, so a long
                  // press here would otherwise never reach the bubble's own
                  // handler and the action sheet (Edit / Delete) wouldn't open.
                  onLongPress={
                    isViewOnce ? undefined : () => onLongPress?.(message)
                  }
                  style={styles.mediaImage}
                >
                  <Image
                    source={{ uri: message.mediaUrl }}
                    style={styles.mediaImageInner}
                  />
                </Pressable>
              ) : null}

              {message.mediaType === "video" && message.mediaUrl ? (
                <Pressable
                  onPress={() => onMediaPress?.(message)}
                  onLongPress={
                    isViewOnce ? undefined : () => onLongPress?.(message)
                  }
                  style={styles.mediaVideo}
                >
                  <Ionicons name="play-circle" size={48} color={textColor} />
                  {message.duration ? (
                    <Text
                      variant="caption"
                      color={textColor}
                      style={styles.duration}
                    >
                      {Math.floor(message.duration / 60)}:
                      {String(message.duration % 60).padStart(2, "0")}
                    </Text>
                  ) : null}
                </Pressable>
              ) : null}

              {message.mediaType === "file" ? (
                <Pressable
                  onPress={() => onMediaPress?.(message)}
                  onLongPress={
                    isViewOnce ? undefined : () => onLongPress?.(message)
                  }
                  style={styles.fileRow}
                >
                  <Ionicons
                    name="document-outline"
                    size={26}
                    color={textColor}
                  />
                  <View style={styles.fileMeta}>
                    <Text
                      variant="bodySmall"
                      style={{ color: textColor, fontWeight: "600" }}
                      numberOfLines={1}
                    >
                      {message.fileName || "Attachment"}
                    </Text>
                    <Text
                      variant="caption"
                      style={{ color: textColor, opacity: 0.7 }}
                    >
                      PDF · {fileSizeLabel(message.fileSize)} · Tap to open
                    </Text>
                  </View>
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color={textColor}
                    style={{ opacity: 0.8 }}
                  />
                </Pressable>
              ) : null}

              {message.mediaType === "voice" ? (
                <View style={styles.voiceMessage}>
                  <VoicePlayer
                    uri={message.mediaUrl || null}
                    duration={message.duration}
                    waveform={message.waveform}
                    color={textColor}
                  />
                </View>
              ) : null}
            </>
          )}

          <View style={styles.meta}>
            {message.edited ? (
              <Text
                variant="caption"
                style={[styles.time, { color: textColor, opacity: 0.6 }]}
              >
                edited
              </Text>
            ) : null}
            <Text
              variant="caption"
              style={[styles.time, { color: textColor, opacity: 0.6 }]}
            >
              {timeLabel(message.createdAt)}
            </Text>
            {isViewOnce ? null : mine ? (
              <Ionicons
                name={
                  message.status === "read" ? "checkmark-done" : "checkmark"
                }
                size={14}
                color={message.status === "read" ? colors.accent : textColor}
                style={styles.receipt}
              />
            ) : null}
          </View>
        </Pressable>
        {showTail && !isGrouped && (
          <BubbleTail side={mine ? "right" : "left"} color={bubbleColor} />
        )}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.screenHorizontal,
    // Breathing room between consecutive bubbles. WhatsApp sits around 10-12px
    // between separate messages; grouped runs close back up to a hairline.
    marginBottom: spacing.md,
  },
  // Consecutive messages from the same sender sit tight, but never touch —
  // a small gap keeps the stacked bubbles readable.
  rowGrouped: {
    marginBottom: spacing.xs,
  },
  // Speaker change: the last bubble of one person's run leaves a wider gap so
  // the other person's reply reads as a distinct turn instead of a continuation
  // of the block above it.
  rowSenderSwitch: {
    marginBottom: spacing.xl,
  },
  rowMine: {
    justifyContent: "flex-end",
  },
  rowOther: {
    justifyContent: "flex-start",
  },
  avatar: {
    marginTop: 2,
    marginRight: spacing.xs,
  },
  avatarSpacer: {
    width: 28,
    marginRight: spacing.xs,
  },
  bubbleWrap: {
        maxWidth: "78%",
    position: "relative",
  },
  senderName: {
    marginBottom: spacing.xxs,
    marginLeft: spacing.xs,
  },
    marginBottom: spacing.xxs,
    marginLeft: spacing.xs,
  },
  senderNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xxs,
    marginLeft: spacing.xs,
  },
  bubble: {
    // iMessage-style pill bubble: fully, evenly rounded on all four
    // corners. The tail is a separate SVG element positioned just outside
    // the bottom corner (see BubbleTail) rather than a flattened corner,
    // so overflow must stay visible or the tail gets clipped.
    borderRadius: 10,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 4,
    overflow: "visible",
  },
  // Modern reply preview — subtle, no harsh border
  replyPreview: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderLeftWidth: 3,
    borderRadius: layout.borderRadius.xs,
    marginBottom: spacing.xxs,
    backgroundColor: "rgba(0,0,0,0.04)",
    // Slightly rounded for a modern feel
    borderTopRightRadius: layout.borderRadius.xs,
    borderBottomRightRadius: layout.borderRadius.xs,
    borderTopLeftRadius: layout.borderRadius.xs,
    borderBottomLeftRadius: layout.borderRadius.xs,
  },
  text: {
    marginBottom: spacing.xxs,
    lineHeight: 20,
  },
  mediaImage: {
    marginTop: spacing.xs,
    borderRadius: layout.borderRadius.md,
    overflow: "hidden",
  },
  mediaImageInner: {
    width: 200,
    height: 200,
    borderRadius: layout.borderRadius.md,
  },
  mediaVideo: {
    marginTop: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 150,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: layout.borderRadius.md,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 170,
  },
  fileMeta: {
    flex: 1,
    minWidth: 0,
  },
  voiceMessage: {
    paddingVertical: spacing.xs,
  },
  duration: {
    marginLeft: spacing.xs,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: spacing.xxs,
    gap: spacing.xxs,
  },
  time: {
    fontSize: 10,
  },
  receipt: {
    marginLeft: spacing.xxs,
  },
// ── View-once bubble state (icon + type + timestamp only) ──
  //   • sent (mine, unopened) -> "Sent — view once"
  //   • opened by receiver (mine) -> "Opened"
  //   • receiver, before open -> "Tap to open (one view)"
  //   • receiver, after open  -> "Opened — no re-views" (bubble is inert)
  // Content is never rendered inline for a view-once message; it only becomes
  // available through the secure ViewOnce viewer after an explicit download.
  // The sender can NEVER open their own view-once message.
  viewOnceLocked: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.m,
    paddingVertical: 0,
  },
  viewOnceLockedIcon: {
    // Fixed-width slot so the type label stays aligned regardless of icon
    // glyph width.
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  viewOnceLockedText: {
    fontWeight: "600",
  },
  // Selection overlay for multi-select mode (WhatsApp-style)
  selectionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
});

export default memo(MessageBubble);
