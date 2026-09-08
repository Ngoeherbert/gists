/* eslint-disable react/no-unescaped-entities */

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { SafeAreaView, StyleSheet, View } from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";

import FeedHeader from "../../../components/feeds/FeedHeader";
import FeedList from "../../../components/feeds/FeedList";

import {
  currentUser as dummyCurrentUser,
  stories as dummyStories,
  posts as dummyPosts,
} from "../../../features/posts/dummyData";

import useAuthStore from "../../../stores/authStore";
import useStoryStore from "../../../stores/storyStore";

export default function FeedsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [refreshing, setRefreshing] = useState(false);

  const [posts, setPosts] = useState(dummyPosts);

  const currentUser = useAuthStore((state) => state.user) || dummyCurrentUser;

  const storeStories = useStoryStore((state) => state.stories);
  const addStoryToStore = useStoryStore((state) => state.addStory);

  const [stories, setStories] = useState(storeStories);

  const [unreadNotifications, setUnreadNotifications] = useState(3);

  /*
   * --------------------------------------------------
   * SEED STORIES ON FIRST LOAD
   *
   * If the store is empty (first launch), seed it
   * with the dummy stories so the Story Bar is
   * populated immediately.
   * --------------------------------------------------
   */

  useEffect(() => {
    if (storeStories.length === 0) {
      dummyStories.forEach((story) => {
        addStoryToStore(story);
      });
    }
  }, [storeStories.length, addStoryToStore]);

  /*
   * Keep local state in sync with the store.
   */

  useEffect(() => {
    setStories(storeStories);
  }, [storeStories]);

  /*
   * --------------------------------------------------
   * PUBLISHED STORY HANDLER
   *
   * When a story is published from the creator,
   * the settings screen sends it back as a param.
   * We prepend it to the story list so it appears
   * at the front of the Story Bar.
   * --------------------------------------------------
   */

  useEffect(() => {
    const raw = params.publishedStory;

    if (typeof raw !== "string" || !raw) {
      return;
    }

    let published = null;

    try {
      published = JSON.parse(raw);
    } catch (error) {
      console.warn("Unable to parse published story:", error);

      return;
    }

    if (!published || !published.id) {
      return;
    }

    addStoryToStore(published);

    /*
     * Clear the param so re-rendering the screen
     * does not prepend the story again.
     */

    router.replace({
      pathname: "/(main)/feeds",
      params: {},
    });
  }, [params.publishedStory, router, addStoryToStore]);

  /*
   * =========================================================
   * NORMALIZE STORIES
   * =========================================================
   *
   * Feed data can come in either of these forms:
   *
   * 1. Flat:
   *
   * [
   *   {
   *     id: "1",
   *     userId: "10",
   *     uri: "...",
   *   },
   *   {
   *     id: "2",
   *     userId: "10",
   *     uri: "...",
   *   }
   * ]
   *
   * 2. Grouped:
   *
   * [
   *   {
   *     userId: "10",
   *     username: "Herbert",
   *     stories: [
   *       {
   *         id: "1",
   *         uri: "..."
   *       },
   *       {
   *         id: "2",
   *         uri: "..."
   *       }
   *     ]
   *   }
   * ]
   *
   * The Story Viewer needs the FLAT version.
   */

  const viewerStories = useMemo(() => {
    if (!Array.isArray(stories)) {
      return [];
    }

    const flattened = [];

    stories.forEach((item, groupIndex) => {
      /*
       * -------------------------------------------------------
       * GROUPED STORY
       * -------------------------------------------------------
       */

      if (Array.isArray(item?.stories) && item.stories.length > 0) {
        item.stories.forEach((nestedStory, storyIndex) => {
          if (!nestedStory) {
            return;
          }

          flattened.push({
            ...item,

            /*
             * The nested story must override
             * the group-level values.
             */
            ...nestedStory,

            id:
              nestedStory?.id ||
              `${item?.userId || groupIndex}-story-${storyIndex}`,

            userId: nestedStory?.userId || item?.userId || item?.id,

            username: nestedStory?.username || item?.username || "User",

            avatar: nestedStory?.avatar || item?.avatar || null,

            uri:
              nestedStory?.uri ||
              nestedStory?.url ||
              nestedStory?.mediaUrl ||
              null,
          });
        });

        return;
      }

      /*
       * -------------------------------------------------------
       * ALREADY FLAT STORY
       * -------------------------------------------------------
       */

      if (item?.id) {
        flattened.push({
          ...item,

          id: item.id,

          userId:
            item?.userId || item?.user?.id || item?.user?.userId || item.id,

          username:
            item?.username ||
            item?.user?.username ||
            item?.user?.name ||
            "User",

          avatar:
            item?.avatar ||
            item?.user?.avatar ||
            item?.user?.profileImage ||
            null,

          /*
           * Support several common backend field names.
           */
          uri:
            item?.uri ||
            item?.url ||
            item?.mediaUrl ||
            item?.media?.url ||
            null,
        });
      }
    });

    return flattened;
  }, [stories]);

  /*
   * =========================================================
   * FEED DATA
   * =========================================================
   */

  const feedData = useMemo(
    () => ({
      posts,
      stories,
      currentUser,
    }),
    [posts, stories, currentUser],
  );

  /*
   * =========================================================
   * REFRESH
   * =========================================================
   */

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

  /*
   * =========================================================
   * OPEN STORY
   * =========================================================
   */

  const handleStoryPress = useCallback(
    (story) => {
      if (!story) {
        return;
      }

      /*
       * -------------------------------------------------------
       * Find the actual story that was pressed.
       * -------------------------------------------------------
       */

      let firstStory = story;

      /*
       * If FeedList gives us a user/group object,
       * use its first nested story.
       */

      if (Array.isArray(story?.stories) && story.stories.length > 0) {
        firstStory = story.stories[0];
      }

      if (!firstStory?.id) {
        console.warn("Cannot open story: missing story ID", story);

        return;
      }

      /*
       * -------------------------------------------------------
       * Find the story in our normalized flat array.
       * -------------------------------------------------------
       */

      let index = viewerStories.findIndex(
        (item) => String(item?.id) === String(firstStory?.id),
      );

      /*
       * If the nested story has no matching ID,
       * try matching the original group/user.
       */

      if (index < 0) {
        const userId = firstStory?.userId || story?.userId || story?.id;

        index = viewerStories.findIndex(
          (item) => String(item?.userId) === String(userId),
        );
      }

      /*
       * If we still cannot find it, don't crash.
       */

      if (index < 0) {
        console.warn("Story not found in viewer stories:", firstStory);

        index = 0;
      }

      const selectedStory = viewerStories[index];

      /*
       * -------------------------------------------------------
       * Debug information.
       *
       * Keep this for now while testing.
       * It will tell us exactly what the viewer receives.
       * -------------------------------------------------------
       */

      console.log("Opening story:", {
        id: selectedStory?.id,
        userId: selectedStory?.userId,
        username: selectedStory?.username,
        uri: selectedStory?.uri,
        type: selectedStory?.type,
      });

      /*
       * -------------------------------------------------------
       * Open viewer.
       * -------------------------------------------------------
       */

      router.push({
        pathname: "/(main)/feeds/story/viewer",

        params: {
          /*
           * IMPORTANT:
           *
           * Send the normalized flat story array,
           * NOT the original grouped data.
           */
          stories: JSON.stringify(viewerStories),

          index: String(index),

          storyId: String(selectedStory?.id || firstStory?.id),

          /*
           * Pass the current user so the viewer
           * can show "Add Story" when viewing
           * the user's own stories.
           */
          currentUser: JSON.stringify({
            id: currentUser?.id,
            userId: currentUser?.userId,
            username: currentUser?.username,
          }),
        },
      });
    },
    [router, viewerStories],
  );

  /*
   * =========================================================
   * CREATE STORY
   * =========================================================
   */

  const handleCreateStory = useCallback(() => {
    router.push("/(main)/feeds/story/create");
  }, [router]);

  /*
   * =========================================================
   * OPEN POST
   * =========================================================
   */

  const handlePostPress = useCallback(
    (post) => {
      if (!post?.id) {
        return;
      }

      router.push({
        pathname: "/(main)/feeds/post/[id]",

        params: {
          id: String(post.id),
        },
      });
    },
    [router],
  );

  /*
   * =========================================================
   * OPEN PROFILE
   * =========================================================
   */

  const handleUserPress = useCallback(
    (post, user) => {
      const selectedUser = user || post?.user;

      if (!selectedUser) {
        console.log("No user found:", post);

        return;
      }

      const userId = selectedUser?.id || selectedUser?.userId || post?.userId;

      if (!userId) {
        console.log("No user ID found:", selectedUser);

        return;
      }

      router.push({
        pathname: "/(main)/feeds/profile/[userId]",

        params: {
          userId: String(userId),

          user: JSON.stringify({
            ...selectedUser,

            id: userId,

            verified: Boolean(
              selectedUser?.verified ??
              selectedUser?.isVerified ??
              post?.verified ??
              false,
            ),
          }),
        },
      });
    },
    [router],
  );

  /*
   * =========================================================
   * POST MENU
   * =========================================================
   */

  const handlePostMenu = useCallback((post) => {
    if (!post?.id) {
      return;
    }

    console.log("Post menu:", post.id);
  }, []);

  /*
   * =========================================================
   * LIKE
   * =========================================================
   */

  const handleLike = useCallback((post) => {
    if (!post?.id) {
      return;
    }

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

  /*
   * =========================================================
   * COMMENTS
   * =========================================================
   */

  const handleComment = useCallback(
    (post) => {
      if (!post?.id) {
        return;
      }

      router.push({
        pathname: "/(main)/feeds/post/comments",

        params: {
          postId: String(post.id),
        },
      });
    },
    [router],
  );

  /*
   * =========================================================
   * REPOST
   * =========================================================
   */

  const handleRepost = useCallback((post) => {
    if (!post?.id) {
      return;
    }

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

  /*
   * =========================================================
   * SHARE
   * =========================================================
   */

  const handleShare = useCallback((post) => {
    if (!post?.id) {
      return;
    }

    console.log("Share post:", post.id);
  }, []);

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  const handleSave = useCallback((post) => {
    if (!post?.id) {
      return;
    }

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

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const handleSearch = useCallback(() => {
    router.push("/(main)/feeds/discover");
  }, [router]);

  /*
   * =========================================================
   * NOTIFICATIONS
   * =========================================================
   */

  const handleNotifications = useCallback(() => {
    setUnreadNotifications(0);

    router.push("/(main)/feeds/notifications");
  }, [router]);

  /*
   * =========================================================
   * PAGINATION
   * =========================================================
   */

  const handleEndReached = useCallback(() => {
    console.log("Load more posts");
  }, []);

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */

  const emptyState = useMemo(() => <View style={styles.empty} />, []);

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

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
