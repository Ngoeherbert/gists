// components/chats/MessageBubble.jsx
// A single chat message. Own messages align right and use the brand bubble;
// incoming messages align left. Includes a timestamp and read receipt.

import React, { memo, useState } from "react";
import { Pressable, StyleSheet, View, Animated, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";
import Avatar from "../ui/Avatar";

function timeLabel(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({ message, onLongPress, showAvatar = true, showName = false, isGroup = false }) {
  const { isDark, theme } = useAppTheme();
  if (!message) return null;

  const mine = Boolean(message.isMine);
  const bubbleColor = mine
    ? colors.chatBubbleMine
    : isDark
      ? colors.chatBubbleOther
      : "#F1F1F5";
  const textColor = mine ? colors.white : isDark ? colors.white : "#111118";

  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowOther]}>
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
          onLongPress={() => setShowMenu(true)}
          style={[styles.bubble, { backgroundColor: bubbleColor }]}
        >
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
            <View style={styles.mediaImage}>
              <Image source={{ uri: message.mediaUrl }} style={styles.mediaImageInner} />
            </View>
          ) : null}

          {message.mediaType === "video" && message.mediaUrl ? (
            <View style={styles.mediaVideo}>
              <Ionicons name="play-circle" size={48} color={textColor} />
              {message.duration && (
                <Text variant="caption" color={textColor} style={styles.duration}>
                  {Math.floor(message.duration / 60)}:{String(message.duration % 60).padStart(2, "0")}
                </Text>
              )}
            </View>
          ) : null}

          {message.mediaType === "voice" ? (
            <View style={styles.voiceMessage}>
              <Ionicons name="mic-outline" size={20} color={textColor} style={styles.voiceIcon} />
              <Animated.View style={[styles.waveform, { width: message.waveform?.length * 4 || 80 }]}>
                {message.waveform?.map((val, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      { height: Math.max(4, val * 30), backgroundColor: textColor },
                    ]}
                  />
                ))}
              </Animated.View>
              {message.duration && (
                <Text variant="caption" color={textColor} style={styles.duration}>
                  {Math.floor(message.duration / 60)}:{String(message.duration % 60).padStart(2, "0")}
                </Text>
              )}
            </View>
          ) : null}

          <View style={styles.meta}>
            <Text
              variant="caption"
              style={[styles.time, { color: textColor, opacity: 0.7 }]}
            >
              {timeLabel(message.createdAt)}
            </Text>
            {mine ? (
              <Ionicons
                name={message.status === "read" ? "checkmark-done" : "checkmark"}
                size={14}
                color={message.status === "read" ? colors.accent : textColor}
                style={styles.receipt}
              />
            ) : null}
          </View>
        </Pressable>

        {showMenu && (
          <View style={styles.menuOverlay} onTouchStart={() => setShowMenu(false)}>
            <View style={[styles.menu, { backgroundColor: isDark ? colors.surface : colors.white }]}>
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
            </View>
          </View>
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
  },
  senderName: {
    marginBottom: spacing.xxs,
    marginLeft: spacing.xs,
  },
  bubble: {
    borderRadius: layout.borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  replyPreview: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderLeftWidth: 3,
    borderRadius: layout.borderRadius.xs,
    marginBottom: spacing.xxs,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  text: {
    marginBottom: spacing.xxs,
  },
  mediaImage: {
    marginTop: spacing.xs,
    borderRadius: layout.borderRadius.md,
    overflow: "hidden",
  },
  mediaImageInner: {
    width: 200,
    height: 200,
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
  voiceMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  voiceIcon: {
    marginRight: spacing.xs,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 30,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
  },
  duration: {
    marginLeft: spacing.xs,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: spacing.xxs,
  },
  time: {
    fontSize: 10,
  },
  receipt: {
    marginLeft: spacing.xxs,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: "absolute",
    borderRadius: layout.borderRadius.md,
    paddingVertical: spacing.xs,
    minWidth: 140,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  menuTitle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontSize: 11,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
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