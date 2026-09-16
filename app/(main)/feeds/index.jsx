// app/(main)/feeds/index.jsx
// Home feed. A single "For you" feed with search (discover) and notifications
// shortcuts in the header.

import React, { useCallback, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../../constants/colors";
import spacing from "../../../constants/spacing";
import useAuthStore from "../../../stores/authStore";
import useNotificationStore from "../../../stores/notificationStore";
import useStoryStore from "../../../stores/storyStore";
import { Badge, IconButton } from "../../../components/ui";
import { Header, Screen } from "../../../components/common";
import FeedList from "../../../components/feeds/FeedList";
import StoryCard from "../../../components/feeds/StoryCard";

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
          titleVariant="heading"
          titleStyle={{ fontWeight: "800" }}
          border={false}
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
        <FeedList
          feed="home"
          listHeaderComponent={<StoryTray groups={groups} seen={seen} user={user} onOpenStory={openStory} onAddStory={openMyStory} />}
          contentContainerStyle={styles.feedContent}
        />
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
  const myCover = myGroup?.stories?.[0]?.mediaUri ?? null;
  // The "My story" card needs a cover + avatar even when the user has no
  // uploaded avatar and no matching story group — fall back to a placeholder.
  const myAvatar = user?.avatarUrl || "https://i.pravatar.cc/200?img=12";

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyTrayContent} style={styles.storyTray}>
      <StoryCard
        uri={myAvatar}
        coverUri={myCover}
        name={user?.name || user?.username || "You"}
        hasStory={hasMyStory}
        hasUnseen={hasMyStory && hasUnseenStory(myGroup, seen)}
        label="My story"
        accessibilityLabel={hasMyStory ? "View my story" : "Add my story"}
        onPress={hasMyStory ? () => onOpenStory(myGroup.id, 0) : onAddStory}
        showAddBadge={!hasMyStory}
        badgeStyle={{
          backgroundColor: colors.primary,
          borderColor: colors.white,
        }}
      />

      {visibleGroups.map((group) => {
        const author = group.author || {};
        const hasStory = Boolean(group.stories?.length);
        const cover = group.stories?.[0]?.mediaUri ?? null;
        const authorAvatar = author.avatarUrl || "https://i.pravatar.cc/200?img=8";
        return (
          <StoryCard
            key={group.id}
            uri={authorAvatar}
            coverUri={cover}
            name={author.name || author.username}
            hasStory={hasStory}
            hasUnseen={hasUnseenStory(group, seen)}
            label={author.name || author.username || "Story"}
            accessibilityLabel={`View ${author.name || author.username || "story"}`}
            onPress={() => onOpenStory(group.id, 0)}
          />
        );
      })}
      </ScrollView>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  storyTrayContent: {
    gap: spacing.sm,
  },
  feedContent: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
});