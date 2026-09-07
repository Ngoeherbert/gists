// apps/mobile/app/(main)/feeds/index.jsx

import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import FeedHeader from "../../../components/feeds/FeedHeader";
import FeedList from "../../../components/feeds/FeedList";

import {
  currentUser as dummyCurrentUser,
  stories as dummyStories,
  posts as dummyPosts,
} from "../../../features/posts/dummyData";

export default function FeedsScreen() {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(dummyPosts);
  const [stories] = useState(dummyStories);
  const [currentUser] = useState(dummyCurrentUser);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const feedData = useMemo(
    () => ({
      posts,
      stories,
      currentUser,
    }),
    [posts, stories, currentUser],
  );

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await new Promise((resolve) => setTimeout(resolve, 700));

      setPosts([...dummyPosts]);
    } catch (error) {
      console.error("Failed to refresh feed:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleStoryPress = useCallback(
    (story) => {
      if (!story?.id) return;

      router.push({
        pathname: "/(main)/feeds/story",
        params: {
          storyId: String(story.id),
        },
      });
    },
    [router],
  );

  const handleCreateStory = useCallback(() => {
    router.push("/(main)/feeds/story/create");
  }, [router]);

  const handlePostPress = useCallback(
    (post) => {
      if (!post?.id) return;

      router.push({
        pathname: "/(main)/feeds/post",
        params: {
          postId: String(post.id),
        },
      });
    },
    [router],
  );

  const handleUserPress = useCallback(
    (post, user) => {
      const userId = user?.id || post?.userId || post?.user?.id;

      if (!userId) return;

      router.push({
        pathname: "/(main)/profile",
        params: {
          userId: String(userId),
        },
      });
    },
    [router],
  );

  const handlePostMenu = useCallback((post) => {
    if (!post?.id) return;

    console.log("Post menu:", post.id);
  }, []);

  const handleLike = useCallback((post) => {
    if (!post?.id) return;

    setPosts((currentPosts) =>
      currentPosts.map((item) => {
        if (item.id !== post.id) {
          return item;
        }

        const liked = !(item.liked || item.isLiked);

        const currentCount = Number(item.likeCount ?? item.likesCount ?? 0);

        return {
          ...item,
          liked,
          isLiked: liked,
          likeCount: Math.max(0, currentCount + (liked ? 1 : -1)),
        };
      }),
    );
  }, []);

  const handleComment = useCallback(
    (post) => {
      if (!post?.id) return;

      router.push({
        pathname: "/(main)/feeds/post",
        params: {
          postId: String(post.id),
          focus: "comments",
        },
      });
    },
    [router],
  );

  const handleRepost = useCallback((post) => {
    if (!post?.id) return;

    setPosts((currentPosts) =>
      currentPosts.map((item) => {
        if (item.id !== post.id) {
          return item;
        }

        const reposted = !(item.reposted || item.isReposted);

        const currentCount = Number(item.repostCount ?? item.repostsCount ?? 0);

        return {
          ...item,
          reposted,
          isReposted: reposted,
          repostCount: Math.max(0, currentCount + (reposted ? 1 : -1)),
        };
      }),
    );
  }, []);

  const handleShare = useCallback((post) => {
    if (!post?.id) return;

    console.log("Share post:", post.id);
  }, []);

  const handleSave = useCallback((post) => {
    if (!post?.id) return;

    setPosts((currentPosts) =>
      currentPosts.map((item) => {
        if (item.id !== post.id) {
          return item;
        }

        const saved = !(item.saved || item.isSaved);

        return {
          ...item,
          saved,
          isSaved: saved,
        };
      }),
    );
  }, []);

  const handleSearch = useCallback(() => {
    router.push("/(main)/feeds/discover");
  }, [router]);

  const handleNotifications = useCallback(() => {
    setUnreadNotifications(0);

    router.push("/(main)/feeds/notifications");
  }, [router]);

  const handleEndReached = useCallback(() => {
    console.log("Load more posts");
  }, []);

  const emptyState = useMemo(() => <View style={styles.empty} />, []);

  return (
    <SafeAreaView style={styles.container}>
      <FeedHeader
        title="Gist Socials"
        onSearch={handleSearch}
        onNotifications={handleNotifications}
        unreadNotifications={unreadNotifications}
      />

      <FeedList
        posts={feedData.posts}
        stories={feedData.stories}
        currentUser={feedData.currentUser}
        onStoryPress={handleStoryPress}
        onCreateStory={handleCreateStory}
        onPostPress={handlePostPress}
        onUserPress={handleUserPress}
        onPostMenu={handlePostMenu}
        onLike={handleLike}
        onComment={handleComment}
        onRepost={handleRepost}
        onShare={handleShare}
        onSave={handleSave}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        ListEmptyComponent={emptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  empty: {
    flex: 1,
    minHeight: 300,
  },
});
