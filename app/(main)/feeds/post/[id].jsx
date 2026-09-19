// app/(main)/feeds/post/[id].jsx
// Single post view: the post itself followed by a preview of its comments.

import React, { useCallback, useEffect, useRef } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import spacing from "../../../../constants/spacing";
import useFeedStore from "../../../../stores/feedStore";
import useProfileStore from "../../../../stores/profileStore";
import useAppTheme from "../../../../hooks/useAppTheme";
import { Header, Screen } from "../../../../components/common";
import { EmptyState } from "../../../../components/ui";
import PostCard from "../../../../components/feeds/PostCard";
import CommentRow from "../../../../components/feeds/CommentRow";
import Avatar from "../../../../components/ui/Avatar";
import Text from "../../../../components/ui/Text";
import { VerifiedBadge } from "../../../../components/ui/VerifiedBadge";

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

function PostHeaderTitle({ author, createdAt, theme }) {
  const router = useRouter();
  const { verifiedUsers, getVerifiedBadge } = useProfileStore.getState();
  const isVerified = author.id && verifiedUsers[author.id];

  return (
    <Pressable
      style={styles.headerTitle}
      onPress={() => author.id && router.navigate(`/profile/${author.id}`)}
    >
      <Avatar
        uri={author.avatarUrl}
        name={author.name || author.username}
        size="sm"
      />
      <View style={styles.headerTitleMeta}>
        <View style={styles.headerNameRow}>
          <Text variant="bodyMedium" color="default" numberOfLines={1}>
            {author.name || author.username || "Someone"}
          </Text>
          {isVerified && (
            <VerifiedBadge
              size={18}
              color={getVerifiedBadge(author.id).color}
              iconName="verified"
            />
          )}
        </View>
        <Text variant="caption" color="tertiary">
          @{author.username || "user"} · {timeAgo(createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

function PostHeaderOptions({ onPress, theme }) {
  return (
    <Ionicons
      name="ellipsis-horizontal"
      size={24}
      color={theme.text.tertiary}
      style={styles.headerOption}
    />
  );
}

export default function PostDetailScreen() {
  const { id, commentId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useAppTheme();
  const flatListRef = useRef(null);

  const post = useFeedStore((s) => s.posts[id]);
  const bucket = useFeedStore((s) => s.comments[id]);

  const comments = (bucket?.ids ?? []).map((cid) => bucket.byId[cid]).filter(Boolean);
  const author = post?.author || {};

  // Scroll to specific comment when commentId is provided
  useEffect(() => {
    if (commentId && flatListRef.current) {
      const index = comments.findIndex((c) => c.id === commentId);
      if (index >= 0) {
        flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.3 });
      }
    }
  }, [commentId, comments]);

  const openComments = useCallback(
    () => router.navigate(`/(main)/feeds/post/${id}/comments`),
    [router, id]
  );

  const headerTitle = post ? (
    <PostHeaderTitle author={author} createdAt={post.createdAt} theme={theme} />
  ) : "Post";

  const headerRight = post ? (
    <PostHeaderOptions
      onPress={() => {
        // TODO: show post options modal
      }}
      theme={theme}
    />
  ) : null;

  if (!post) {
    return (
      <Screen padded={false} header={<Header title="Post" showBack />}>
        <EmptyState
          icon="alert-circle-outline"
          title="Post unavailable"
          description="This post may have been deleted or is no longer public."
        />
      </Screen>
    );
  }

  return (
    <Screen
      padded={false}
      header={<Header showBack centerTitle title={headerTitle} right={headerRight} />}
    >
      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <PostCard post={post} showAuthor={false} showOptions={false} />
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  commentsHeader: {
    marginTop: spacing.sm,
  },
  footerSpace: {
    height: spacing.huge,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerTitleMeta: {
    flex: 1,
  },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerOption: {
    paddingHorizontal: spacing.xs,
  },
});