// app/(main)/feeds/post/[id].jsx
// Single post view: the post itself followed by a preview of its comments.

import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import spacing from "../../../../constants/spacing";
import useFeedStore from "../../../../stores/feedStore";
import { Header } from "../../../../components/common";
import { EmptyState, Loading } from "../../../../components/ui";
import PostCard from "../../../../components/feeds/PostCard";
import CommentRow from "../../../../components/feeds/CommentRow";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const post = useFeedStore((s) => s.posts[id]);
  const bucket = useFeedStore((s) => s.comments[id]);

  const comments = (bucket?.ids ?? []).map((cid) => bucket.byId[cid]).filter(Boolean);

  const openComments = useCallback(
    () => router.push(`/(main)/feeds/post/${id}/comments`),
    [router, id]
  );

  if (!post) {
    return (
      <View style={styles.container}>
        <Header title="Post" showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Post unavailable"
          description="This post may have been deleted or is no longer public."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Post" showBack />
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <PostCard post={post} />
            <View style={styles.commentsHeader}>
              <Header title="Comments" border={false} />
            </View>
          </>
        }
        renderItem={({ item }) => <CommentRow postId={id} comment={item} />}
        ListEmptyComponent={
          <EmptyState
            compact
            icon="chatbubble-ellipses-outline"
            title="No comments yet"
            description="Be the first to share what you think."
            actionLabel="Add a comment"
            onAction={openComments}
          />
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentsHeader: {
    marginTop: spacing.sm,
  },
  footerSpace: {
    height: spacing.huge,
  },
});
