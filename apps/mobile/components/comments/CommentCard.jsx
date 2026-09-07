// apps/mobile/components/comments/CommentCard.jsx

import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Avatar from "../common/Avatar";
import CommentHeader from "./CommentHeader";
import CommentActions from "./CommentActions";
import ReplyButton from "./ReplyButton";

export default function CommentCard({
  comment,
  onLike,
  onReply,
  onMore,
  onViewReplies,
  currentUserId,
}) {
  const [liked, setLiked] = useState(Boolean(comment?.liked));
  const [likeCount, setLikeCount] = useState(comment?.likeCount || 0);

  const user = comment?.user || {};
  const text = comment?.text || comment?.content || "";
  const repliesCount = comment?.repliesCount || comment?.replyCount || 0;

  const isOwnComment =
    currentUserId && user?.id && String(currentUserId) === String(user.id);

  const handleLike = () => {
    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikeCount((value) => Math.max(0, value + (nextLiked ? 1 : -1)));

    onLike?.(comment, nextLiked);
  };

  const handleReply = () => {
    onReply?.(comment);
  };

  return (
    <View style={styles.container}>
      <Avatar
        uri={user?.avatar || user?.avatarUrl}
        name={user?.name || user?.username || "User"}
        size={42}
      />

      <View style={styles.content}>
        <CommentHeader
          comment={comment}
          user={user}
          isOwnComment={isOwnComment}
          onMore={() => onMore?.(comment)}
        />

        <Text style={styles.text}>{text}</Text>

        <CommentActions
          liked={liked}
          likeCount={likeCount}
          onLike={handleLike}
          onReply={handleReply}
          onMore={() => onMore?.(comment)}
        />

        {repliesCount > 0 && (
          <ReplyButton
            count={repliesCount}
            onPress={() => onViewReplies?.(comment)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  text: {
    marginTop: 6,
    color: "#222",
    fontSize: 14,
    lineHeight: 20,
  },
});
