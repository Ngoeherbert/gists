// components/chats/ConversationRow.jsx
// One conversation in the chats list: avatar (+ presence), name, last message
// preview, timestamp and unread badge.

import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Text from "../ui/Text";
import { VerifiedBadge } from "../ui/VerifiedBadge";
import useProfileStore from "../../stores/profileStore";

function timeLabel(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 86400) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (seconds < 604800) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { day: "2-digit", month: "short" });
}

function ConversationRow({ conversation, muted = false, onPress }) {
  const { theme } = useAppTheme();
  if (!conversation) return null;

  const peer = conversation.participants?.[0] || conversation.peer || {};
  const isGroup = conversation.type === "group";
  const title = isGroup
    ? conversation.name
    : peer.name || peer.username || "Unknown";
  const unread = conversation.unreadCount ?? 0;
  const last = conversation.lastMessage;

  const preview = last?.text
    ? last.text
    : last?.mediaType
      ? `Sent ${last.mediaType}`
      : "Say hello 👋";

  const isMine = last?.isMine;
  const isTyping = Boolean(conversation.isTyping);

  return (
    <Pressable
      onPress={() => onPress?.(conversation)}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      {isGroup ? (
        <View
          style={[
            styles.groupAvatar,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Ionicons
            name="people"
            size={layout.iconSize.md}
            color={colors.white}
          />
        </View>
      ) : (
        <Avatar
          uri={peer.avatarUrl}
          name={title}
          size="lg"
          online={peer.isOnline}
        />
      )}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text variant="bodyMedium" numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            {!isGroup && peer.id && useProfileStore.getState().verifiedUsers[peer.id] && (
              <VerifiedBadge
                size={18}
                color={useProfileStore.getState().getVerifiedBadge(peer.id).color}
                iconName="verified"
              />
            )}
          </View>
          <Text variant="caption" color="tertiary">
            {timeLabel(conversation.updatedAt)}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          {isTyping ? (
            <Text
              variant="bodySmall"
              color="primary"
              numberOfLines={1}
              style={styles.preview}
            >
              typing…
            </Text>
          ) : (
            <Text
              variant="bodySmall"
              color={unread > 0 ? "default" : "tertiary"}
              numberOfLines={1}
              style={styles.preview}
            >
              {isMine ? "You: " : ""}
              {preview}
            </Text>
          )}

          <View style={styles.trailing}>
            {muted ? (
              <Ionicons
                name="notifications-off-outline"
                size={layout.iconSize.sm}
                color={theme.text.tertiary}
              />
            ) : null}
            {unread > 0 ? <Badge count={unread} tone="primary" /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default memo(ConversationRow);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
  },
  pressed: {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  groupAvatar: {
    width: layout.avatarSize.lg,
    height: layout.avatarSize.lg,
    borderRadius: layout.avatarSize.lg / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xxs,
  },
    title: {
    flex: 1,
    marginRight: spacing.sm,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  preview: {
    flex: 1,
    marginRight: spacing.sm,
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
  },
});
