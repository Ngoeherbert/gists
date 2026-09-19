// components/feeds/NotificationRow.jsx
// One notification entry: actor avatar, action sentence, preview, time and unread dot.
// Instagram-style: avatar left, username+action+preview in column, time+unread right.

import React, { memo } from "react";
import { Pressable, StyleSheet, View, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Avatar from "../ui/Avatar";
import Text from "../ui/Text";
import { VerifiedBadge } from "../ui/VerifiedBadge";
import useProfileStore from "../../stores/profileStore";

const TYPE_META = {
  like: { icon: "heart", color: colors.like, verb: "liked your post" },
  comment: {
    icon: "chatbubble",
    color: colors.comment,
    verb: "commented on your post",
  },
  follow: {
    icon: "person-add",
    color: colors.primary,
    verb: "started following you",
  },
  mention: { icon: "at", color: colors.accent, verb: "mentioned you" },
  repost: { icon: "repeat", color: colors.repost, verb: "reposted your post" },
  message: {
    icon: "chatbubbles",
    color: colors.primary,
    verb: "sent you a message",
  },
};

function timeAgo(ts) {
  if (!ts) return "";
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (seconds < 60) return "now";
  const units = [
    ["m", 60],
    ["h", 3600],
    ["d", 86400],
    ["w", 604800],
  ];
  let out = "now";
  for (const [suffix, secs] of units) {
    if (seconds >= secs) out = `${Math.floor(seconds / secs)}${suffix}`;
  }
  return out;
}

function NotificationRow({ notification, onPress }) {
  const { theme, isDark } = useAppTheme();
  const meta = TYPE_META[notification.type] || TYPE_META.like;
  const actor = notification.actor || {};

  return (
    <Pressable
      onPress={() => onPress?.(notification)}
      style={[
        styles.wrap,
        {
          backgroundColor: notification.isRead
            ? "transparent"
            : isDark
              ? `${colors.primary}14`
              : `${colors.primary}0D`,
        },
      ]}
      android_ripple={isDark ? { color: `${colors.primary}14` } : { color: `${colors.primary}0D` }}
    >
      <View style={styles.avatarWrap}>
        <Avatar
          uri={actor.avatarUrl}
          name={actor.name || actor.username}
          size="md"
        />
        <View style={[styles.typeBadge, { backgroundColor: meta.color }]}>
          <Ionicons name={meta.icon} size={11} color={colors.white} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text variant="bodyBold" style={styles.username}>
              {actor.name || actor.username || "Someone"}
            </Text>
            {actor.id && useProfileStore.getState().verifiedUsers[actor.id] && (
              <VerifiedBadge
                size={16}
                color={useProfileStore.getState().getVerifiedBadge(actor.id).color}
                iconName="verified"
              />
            )}
          </View>
          <RNText style={[styles.actionText, { color: theme.text.primary }]} numberOfLines={2}>
            <RNText style={styles.actionBold}>{meta.verb}</RNText>
            {notification.preview ? `  ${notification.preview}` : ""}
          </RNText>
        </View>

        <View style={styles.rightSide}>
          <Text variant="caption" color="tertiary" style={styles.time}>
            {timeAgo(notification.createdAt)}
          </Text>
          {!notification.isRead ? (
            <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default memo(NotificationRow);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    minHeight: 72,
  },
  avatarWrap: {
    marginRight: spacing.md,
    flexShrink: 0,
    marginTop: 1, // align with first line of text
  },
  typeBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minWidth: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: spacing.sm,
  },
  username: {
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    lineHeight: 18,
  },
  actionBold: {
    fontWeight: "200",
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: spacing.sm,
    marginTop: 1, // align with username
    paddingLeft: spacing.xs,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.xs,
  },
});
