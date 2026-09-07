// apps/mobile/components/comments/CommentHeader.jsx

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CommentHeader({
  user = {},
  comment = {},
  onMore,
  isOwnComment = false,
}) {
  const displayName = user?.name || user?.username || "User";
  const username = user?.username ? `@${user.username}` : "";
  const timestamp =
    comment?.createdAt || comment?.timestamp || comment?.timeAgo || "";

  const verified = Boolean(user?.verified || user?.isVerified);

  return (
    <View style={styles.container}>
      <View style={styles.identity}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>

        {verified && (
          <Ionicons
            name="checkmark-circle"
            size={15}
            color="#000"
            style={styles.verified}
          />
        )}

        {username ? (
          <Text style={styles.username} numberOfLines={1}>
            {username}
          </Text>
        ) : null}

        {timestamp ? (
          <Text style={styles.timestamp} numberOfLines={1}>
            {timestamp}
          </Text>
        ) : null}
      </View>

      {onMore && (
        <Pressable
          onPress={onMore}
          style={styles.more}
          accessibilityRole="button"
          accessibilityLabel={
            isOwnComment ? "Comment options" : "More comment options"
          }
        >
          <Ionicons name="ellipsis-horizontal" size={18} color="#555" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 22,
  },
  identity: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minWidth: 0,
  },
  name: {
    color: "#111",
    fontSize: 14,
    fontWeight: "700",
    maxWidth: "45%",
  },
  verified: {
    marginLeft: -2,
  },
  username: {
    color: "#777",
    fontSize: 12,
    maxWidth: "30%",
  },
  timestamp: {
    color: "#999",
    fontSize: 11,
    marginLeft: 2,
  },
  more: {
    width: 30,
    height: 30,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
