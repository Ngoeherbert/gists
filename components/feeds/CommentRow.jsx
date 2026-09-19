// components/feeds/CommentRow.jsx
// One comment with author, body, like toggle and a reply affordance.

import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useFeedStore from "../../stores/feedStore";
import useProfileStore from "../../stores/profileStore";
import { formatRelativeTime } from "../../utils/formatters";
import Avatar from "../ui/Avatar";
import Text from "../ui/Text";
import { VerifiedBadge } from "../ui/VerifiedBadge";

function CommentRow({ postId, comment }) {
  const { theme } = useAppTheme();
  const toggleCommentLike = useFeedStore((s) => s.toggleCommentLike);

  if (!comment) return null;
  const author = comment.author || {};

  return (
    <View style={styles.wrap}>
      <Avatar
        uri={author.avatarUrl}
        name={author.name || author.username}
        size="sm"
      />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text variant="bodySmall" numberOfLines={1} style={styles.name}>
              {author.username || author.name || "user"}
            </Text>
            {author.id && useProfileStore.getState().verifiedUsers[author.id] && (
              <VerifiedBadge
                size={16}
                color={useProfileStore.getState().getVerifiedBadge(author.id).color}
                iconName="verified"
              />
            )}
          </View>
          <Text variant="caption" color="tertiary">
            {comment.createdAt ? `· ${formatRelativeTime(comment.createdAt)}` : ""}
          </Text>
        </View>

        <Text variant="bodySmall" color="secondary_text" style={styles.text}>
          {comment.text}
        </Text>

        <Pressable style={styles.reply} hitSlop={spacing.sm}>
          <Text variant="caption" color="tertiary">
            Reply
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => toggleCommentLike({ postId, commentId: comment.id })}
        hitSlop={spacing.sm}
        style={styles.like}
      >
        <Ionicons
          name={comment.isLiked ? "heart" : "heart-outline"}
          size={layout.iconSize.sm}
          color={comment.isLiked ? colors.like : theme.text.tertiary}
        />
        {comment.likesCount ? (
          <Text variant="caption" color="tertiary" style={styles.likeCount}>
            {comment.likesCount}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

export default memo(CommentRow);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
  },
  body: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xxs,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    marginRight: spacing.xs,
  },
  text: {
    marginBottom: spacing.xs,
  },
  reply: {
    alignSelf: "flex-start",
  },
  like: {
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  likeCount: {
    marginTop: spacing.xxs,
  },
});
