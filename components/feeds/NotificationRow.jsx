// components/feeds/NotificationRow.jsx
// One notification entry: actor avatar, action sentence and an unread dot.

import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Avatar from "../ui/Avatar";
import Text from "../ui/Text";

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

      <View style={styles.body}>
        <Text variant="bodySmall" numberOfLines={2}>
          <Text variant="bodyBold">
            {actor.username || actor.name || "Someone"}
          </Text>{" "}
          <Text variant="bodySmall" color="secondary_text">
            {meta.verb}
          </Text>
        </Text>
        {notification.preview ? (
          <Text
            variant="caption"
            color="tertiary"
            numberOfLines={1}
            style={styles.preview}
          >
            {notification.preview}
          </Text>
        ) : null}
      </View>

      {!notification.isRead ? (
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
      ) : null}
    </Pressable>
  );
}

export default memo(NotificationRow);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
  },
  avatarWrap: {
    marginRight: spacing.md,
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
  body: {
    flex: 1,
  },
  preview: {
    marginTop: spacing.xxs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
});
