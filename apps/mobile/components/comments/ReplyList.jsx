// apps/mobile/components/comments/ReplyList.jsx

import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CommentCard from "./CommentCard";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

export default function ReplyList({
  replies = [],
  loading = false,
  currentUserId,
  onLike,
  onReply,
  onMore,
  onLoadMore,
  hasMore = false,
}) {
  if (loading && replies.length === 0) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }

  if (!loading && replies.length === 0) {
    return (
      <EmptyState title="No replies yet" message="Be the first to reply." />
    );
  }

  const renderReply = ({ item }) => (
    <View style={styles.reply}>
      <CommentCard
        comment={item}
        currentUserId={currentUserId}
        onLike={onLike}
        onReply={onReply}
        onMore={onMore}
        showMore
      />
    </View>
  );

  return (
    <FlatList
      data={replies}
      keyExtractor={(item, index) => String(item?.id || item?._id || index)}
      renderItem={renderReply}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onEndReached={() => {
        if (hasMore && !loading) {
          onLoadMore?.();
        }
      }}
      onEndReachedThreshold={0.6}
      ListFooterComponent={
        loading ? (
          <View style={styles.footerLoader}>
            <Loader size="small" />
          </View>
        ) : null
      }
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 4,
  },
  reply: {
    marginLeft: 28,
    borderLeftWidth: 1,
    borderLeftColor: "#eee",
  },
  loader: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
