// components/chats/MessageBubble.jsx
// A single chat message. Own messages align right and use the brand bubble;
// incoming messages align left. Includes a timestamp and read receipt.

import React, { memo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";
import Avatar from "../ui/Avatar";
import VoicePlayer from "./VoicePlayer";

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
  voice: "Voice note",
};

function viewOnceTypeLabel(message) {
  if (!message) return "Text";
  if (VIEW_ONCE_TYPE[message.mediaType]) return VIEW_ONCE_TYPE[message.mediaType];
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

// WhatsApp-style curved tail: a quarter-circle extension at a bubble corner.
// `side` is 'left' (received, bottom-left tail) or 'right' (sent, bottom-right tail).
function BubbleTail({ side, color }) {
  return (
    <View
      style={{
        position: 'absolute',
        [side]: -8,
        bottom: 0,
        width: 8,
        height: 8,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: color,
          position: 'absolute',
          bottom: 0,
          [side]: 0,
        }}
      />
    </View>
  );
}

function MessageBubble({
  message,
  onLongPress,
  showAvatar = true,
  showName = false,
  isGroup = false,
  showTail = true,
  isGrouped = false,
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

  const [showMenu, setShowMenu] = useState(false);
  const menuOpacity = React.useRef(new Animated.Value(0)).current;
  const menuScale = React.useRef(new Animated.Value(0.9)).current;
  const messageRef = React.useRef(null);

  // Animate menu in/out
  React.useEffect(() => {
    if (showMenu) {
      Animated.parallel([
        Animated.timing(menuOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(menuScale, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(menuOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(menuScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMenu, menuOpacity, menuScale]);

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

  // Cache the latest message in a ref so callbacks below always see the
  // current value (avoids stale-closure bugs without adding an effect).
  messageRef.current = message;

  return (
    <View
      style={[
        styles.row,
        mine ? styles.rowMine : styles.rowOther,
        isGrouped && styles.rowGrouped,
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
          <Text variant="caption" color={isDark ? "secondary_text" : "tertiary_text"} style={styles.senderName}>
            {message.senderName}
          </Text>
        )}

        <Pressable
          onPress={isViewOnce ? handleBubblePress : undefined}
          onLongPress={isViewOnce ? undefined : () => setShowMenu(true)}
          style={[
            styles.bubble,
            { backgroundColor: bubbleColor },
            mine ? styles.bubbleMine : styles.bubbleOther,
          ]}
        >
          {isViewOnce ? (
            // ── View-once: content is BLOCKED until revealed. The bubble
            //    never reveals text/media inline — that only happens in the
            //    full-screen preview modal after the tap. ──
            <View style={styles.viewOnceLocked}>
              <Ionicons
                name={viewOnceIconName(message, {
                  mine,
                  downloaded: viewOnceDownloaded,
                  consumed: viewOnceConsumed,
                })}
                size={22}
                color={textColor}
                style={{ opacity: 0.75 }}
              />
              <Text
                variant="bodySmall"
                color={isDark ? "secondary_text" : "tertiary"}
                style={styles.viewOnceLockedText}
              >
                {viewOnceTypeLabel(message)}
              </Text>
              <Text
                variant="caption"
                color={isDark ? "secondary_text" : "tertiary"}
                style={[
                  styles.viewOnceLockedHint,
                  { opacity: viewOnceConsumed || mine ? 0.5 : 0.75 },
                ]}
              >
                {mine
                  ? viewOnceConsumed
                    ? "Opened"
                    : "Sent — view once"
                  : viewOnceConsumed
                    ? "Opened — no re-views"
                    : "Tap to open (one view)"}
              </Text>
            </View>
          ) : (
            <>
              {message.replyTo ? (
                <View style={[styles.replyPreview, { borderLeftColor: mine ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)" }]}>
                  <Text variant="caption" color={textColor} style={{ opacity: 0.8, fontWeight: "600" }}>
                    {message.replyTo.senderName || "You"}
                  </Text>
                  <Text variant="caption" color={textColor} style={{ opacity: 0.7, numberOfLines: 1 }}>
                    {message.replyTo.text?.slice(0, 50)}
                  </Text>
                </View>
              ) : null}

              {message.text ? (
                <Text variant="body" style={[styles.text, { color: textColor }]}>
                  {message.text}
                </Text>
              ) : null}

              {message.mediaType === "image" && message.mediaUrl ? (
                <Pressable onPress={() => onMediaPress?.(message)} style={styles.mediaImage}>
                  <Image source={{ uri: message.mediaUrl }} style={styles.mediaImageInner} />
                </Pressable>
              ) : null}

              {message.mediaType === "video" && message.mediaUrl ? (
                <Pressable onPress={() => onMediaPress?.(message)} style={styles.mediaVideo}>
                  <Ionicons name="play-circle" size={48} color={textColor} />
                  {message.duration ? (
                    <Text variant="caption" color={textColor} style={styles.duration}>
                      {Math.floor(message.duration / 60)}:{String(message.duration % 60).padStart(2, "0")}
                    </Text>
                  ) : null}
                </Pressable>
              ) : null}

              {message.mediaType === "file" ? (
                <Pressable onPress={() => onMediaPress?.(message)} style={styles.fileRow}>
                  <Ionicons name="document-outline" size={26} color={textColor} />
                  <View style={styles.fileMeta}>
                    <Text
                      variant="bodySmall"
                      style={{ color: textColor, fontWeight: "600" }}
                      numberOfLines={1}
                    >
                      {message.fileName || "Attachment"}
                    </Text>
                    <Text variant="caption" style={{ color: textColor, opacity: 0.7 }}>
                      PDF · {fileSizeLabel(message.fileSize)} · Tap to open
                    </Text>
                  </View>
                  <Ionicons name="open-outline" size={18} color={textColor} style={{ opacity: 0.8 }} />
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
            <Text
              variant="caption"
              style={[styles.time, { color: textColor, opacity: 0.6 }]}
            >
              {timeLabel(message.createdAt)}
            </Text>
            {isViewOnce ? (
              <Ionicons
                name={
                  viewOnceConsumed
                    ? mine
                      ? "eye-outline" // receiver opened it
                      : "eye-off" // consumed — no re-views
                    : viewOnceDownloaded && !mine
                      ? "download-outline"
                      : "lock-closed"
                }
                size={14}
                color={textColor}
                style={[styles.receipt, { opacity: 0.6 }]}
              />
            ) : mine ? (
              <Ionicons
                name={message.status === "read" ? "checkmark-done" : "checkmark"}
                size={14}
                color={message.status === "read" ? colors.accent : textColor}
                style={styles.receipt}
              />
            ) : null}
          </View>
        </Pressable>

        {showTail && !isGrouped && (
          <BubbleTail side={mine ? 'right' : 'left'} color={bubbleColor} />
        )}

        {showMenu && (
          <Animated.View
            style={[
              styles.menuOverlay,
              { opacity: menuOpacity },
            ]}
            onPress={() => setShowMenu(false)}
            pointerEvents="box-none"
          >
            <Animated.View
              style={[
                styles.menu,
                {
                  backgroundColor: isDark ? colors.surface : colors.white,
                  transform: [{ scale: menuScale }],
                },
              ]}
            >
              <Text variant="bodyMedium" color={isDark ? "secondary_text" : "tertiary_text"} style={styles.menuTitle}>
                Message
              </Text>
              <Pressable style={styles.menuItem} onPress={() => { setShowMenu(false); /* copy */ }}>
                <Ionicons name="copy-outline" size={20} color={theme.text.primary} style={styles.menuIcon} />
                <Text variant="bodyMedium" color="default">Copy</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => { setShowMenu(false); /* forward */ }}>
                <Ionicons name="send-outline" size={20} color={theme.text.primary} style={styles.menuIcon} />
                <Text variant="bodyMedium" color="default">Forward</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => { setShowMenu(false); /* reply */ }}>
                <Ionicons name="reply-outline" size={20} color={theme.text.primary} style={styles.menuIcon} />
                <Text variant="bodyMedium" color="default">Reply</Text>
              </Pressable>
              {mine && (
                <Pressable style={[styles.menuItem, styles.menuItemDestructive]} onPress={() => { setShowMenu(false); /* delete */ }}>
                  <Ionicons name="trash-outline" size={20} color={theme.status.error} style={styles.menuIcon} />
                  <Text variant="bodyMedium" color={theme.status.error}>Delete</Text>
                </Pressable>
              )}
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.sm,
  },
  // Consecutive messages from the same sender sit tight, WhatsApp-style.
  rowGrouped: {
    marginBottom: spacing.xxs,
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
    position: 'relative',
  },
  senderName: {
    marginBottom: spacing.xxs,
    marginLeft: spacing.xs,
  },
  bubble: {
    // WhatsApp-style bubble: rounded body, tail corner is sharp
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 4,
    overflow: 'hidden',
  },
  bubbleMine: {
    // Sharp bottom edge for sent messages
    borderTopLeftRadius: layout.borderRadius.md,
    borderTopRightRadius: layout.borderRadius.md,
    borderBottomLeftRadius: layout.borderRadius.md,
    borderBottomRightRadius: 0,
  },
  bubbleOther: {
    // Sharp bottom-left corner for received bubble (tail attachment point)
    borderTopLeftRadius: layout.borderRadius.md,
    borderTopRightRadius: layout.borderRadius.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: layout.borderRadius.md,
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
    alignItems: "center",
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
    minHeight: 56,
  },
  viewOnceLockedText: {
    fontWeight: "600",
  },
  viewOnceLockedHint: {
    opacity: 0.75,
    fontStyle: "italic",
  },
  // Modern menu: animated, centered, with backdrop
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Semi-transparent backdrop for modal feel
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    // Centered, floating card style
    alignSelf: "center",
    marginHorizontal: spacing.xl,
    borderRadius: layout.borderRadius.lg,
    paddingVertical: spacing.xs,
    minWidth: 160,
    // Prominent shadow for floating card effect
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  menuTitle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    fontWeight: "600",
    fontSize: 11,
    color: colors.tertiary,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.sm,
  },
  menuItemDestructive: {
    marginTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  menuIcon: {
    width: 24,
  },
});

export default memo(MessageBubble);
