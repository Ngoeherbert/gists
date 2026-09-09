import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import StoryBar from "./StoryBar";
import PostCard from "./PostCard";

export default function FeedList({
  posts = [],
  stories = [],
  currentUser = null,

  onStoryPress,
  onCreateStory,
  onStoryDelete,

  onPostPress,
  onUserPress,
  onPostMenu,
  onLike,
  onComment,
  onRepost,
  onShare,
  onSave,

  refreshing = false,
  onRefresh,
  onEndReached,
  ListEmptyComponent,
}) {
  const handleStoryPress = useCallback(
    (story) => {
      if (typeof onStoryPress !== "function") {
        return;
      }

      onStoryPress(story);
    },
    [onStoryPress],
  );

  const handleCreateStory = useCallback(() => {
    if (typeof onCreateStory !== "function") {
      return;
    }

    onCreateStory();
  }, [onCreateStory]);

  const handleStoryDelete = useCallback(
    (story) => {
      if (typeof onStoryDelete !== "function") {
        return;
      }

      onStoryDelete(story);
    },
    [onStoryDelete],
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <StoryBar
          stories={stories}
          currentUser={currentUser}
          onStoryPress={handleStoryPress}
          onCreateStory={handleCreateStory}
          onStoryDelete={handleStoryDelete}
        />
      </View>
    ),
    [stories, currentUser, handleStoryPress, handleCreateStory, handleStoryDelete],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        onUserPress={onUserPress}
        onMenuPress={() => {
          if (typeof onPostMenu === "function") {
            onPostMenu(item);
          }
        }}
        onMediaPress={() => {
          if (typeof onPostPress === "function") {
            onPostPress(item);
          }
        }}
        onLike={() => {
          if (typeof onLike === "function") {
            onLike(item);
          }
        }}
        onComment={() => {
          if (typeof onComment === "function") {
            onComment(item);
          }
        }}
        onRepost={() => {
          if (typeof onRepost === "function") {
            onRepost(item);
          }
        }}
        onShare={() => {
          if (typeof onShare === "function") {
            onShare(item);
          }
        }}
        onSave={() => {
          if (typeof onSave === "function") {
            onSave(item);
          }
        }}
      />
    ),
    [
      onUserPress,
      onPostMenu,
      onPostPress,
      onLike,
      onComment,
      onRepost,
      onShare,
      onSave,
    ],
  );

  const keyExtractor = useCallback(
    (item, index) => String(item?.id ?? `post-${index}`),
    [],
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={ListEmptyComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        posts.length === 0
          ? styles.emptyContent
          : styles.content
      }
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },

  emptyContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },

  header: {
    width: "100%",
  },
});
