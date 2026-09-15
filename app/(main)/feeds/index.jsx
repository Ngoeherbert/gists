// app/(main)/feeds/index.jsx
// Home feed. A single "For you" feed with search (discover) and notifications
// shortcuts in the header.

import React, { useCallback, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAuthStore from "../../../stores/authStore";
import useNotificationStore from "../../../stores/notificationStore";
import useStoryStore from "../../../stores/storyStore";
import { Avatar, Badge, IconButton, Text } from "../../../components/ui";
import { Header, Screen } from "../../../components/common";
import FeedList from "../../../components/feeds/FeedList";

export default function FeedsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const groups = useStoryStore((state) => state.groups);
  const seen = useStoryStore((state) => state.seen);
  const fetchStories = useStoryStore((state) => state.fetchStories);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const openStory = useCallback(
    (groupId, index = 0) => {
      router.navigate({
        pathname: "/(main)/stories/viewer",
        params: { groupId, index },
      });
    },
    [router],
  );

  const openMyStory = useCallback(() => {
    router.navigate({ pathname: "/(main)/create/story" });
  }, [router]);

  return (
    <Screen
      padded={false}
      edges={["top"]}
      header={
        <Header
          title="Gist Socials"
          compactTitle
          right={
            <View style={styles.headerRight}>
              <IconButton
                name="search-outline"
                onPress={() => router.navigate("/(main)/feeds/discover")}
              />
              <View>
                <IconButton
                  name="notifications-outline"
                  onPress={() => router.navigate("/(main)/feeds/notifications")}
                />
                {unreadCount > 0 ? (
                  <View style={styles.badge}>
                    <Badge count={unreadCount} tone="error" />
                  </View>
                ) : null}
              </View>
            </View>
          }
        />
      }
    >
      <View style={styles.content}>
        <StoryTray
          groups={groups}
          seen={seen}
          user={user}
          onOpenStory={openStory}
          onAddStory={openMyStory}
        />
        <View style={styles.feedList}>
          <FeedList
            feed="home"
            contentContainerStyle={styles.feedContent}
          />
        </View>
      </View>
    </Screen>
  );
}

function hasUnseenStory(group, seen = {}) {
  if (!group?.hasUnseen || !Array.isArray(group.stories)) return false;
  return group.stories.some(
    (story) => story?.id != null && !seen[story.id] && !story?.seen,
  );
}

function StoryTray({ groups, seen, user, onOpenStory, onAddStory }) {
  const normalizedGroups = groups || [];
  const myGroup = user
    ? normalizedGroups.find((group) => group.author?.id === user.id)
    : null;
  const visibleGroups = normalizedGroups.filter(
    (group) => group.id !== myGroup?.id && group.stories?.length,
  );
  const hasMyStory = Boolean(myGroup?.stories?.length);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.storyTray}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={hasMyStory ? "View my story" : "Add my story"}
        onPress={hasMyStory ? () => onOpenStory(myGroup.id, 0) : onAddStory}
        style={styles.storyCard}
      >
        <View style={styles.avatarStack}>
          <StoryAvatar
            uri={user?.avatarUrl}
            name={user?.name || user?.username || "You"}
            hasStory={hasMyStory}
                hasUnseen={hasMyStory && hasUnseenStory(myGroup, seen)}
          />
          {!hasMyStory ? (
            <View
              style={[
                styles.addBadge,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.white,
                },
              ]}
            >
              <Ionicons name="add" size={12} color={colors.white} />
            </View>
          ) : null}
        </View>
        <Text variant="caption" numberOfLines={1} style={styles.storyLabel}>
          My story
        </Text>
      </Pressable>

      {visibleGroups.map((group) => {
        const author = group.author || {};
        const hasStory = Boolean(group.stories?.length);
        return (
          <Pressable
            key={group.id}
            accessibilityRole="button"
            accessibilityLabel={`View ${author.name || author.username || "story"}`}
            onPress={() => onOpenStory(group.id, 0)}
            style={styles.storyCard}
          >
            <View style={styles.avatarStack}>
              <StoryAvatar
                uri={author.avatarUrl}
                name={author.name || author.username}
                hasStory={hasStory}
                hasUnseen={hasUnseenStory(group, seen)}
              />
            </View>
            <Text variant="caption" numberOfLines={1} style={styles.storyLabel}>
              {author.name || author.username || "Story"}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function StoryAvatar({ uri, name, hasStory, hasUnseen }) {
  return (
    <Avatar
      uri={uri}
      name={name || "Story"}
      size="story"
      ring={hasStory ? (hasUnseen ? "unseen" : "seen") : null}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  content: {
    flex: 1,
  },
  storyTray: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.sm,
  },
  storyCard: {
    width: 82,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxs,
    borderRadius: layout.borderRadius.lg,
    borderWidth: layout.borderWidth.thin,
    borderColor: colors.border,
    backgroundColor: colors.transparent,
  },
  avatarStack: {
    position: "relative",
    marginBottom: spacing.xs,
  },
  addBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    borderWidth: layout.borderWidth.thin,
  },
  storyLabel: {
    maxWidth: 76,
    textAlign: "center",
  },
  feedList: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});