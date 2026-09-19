// app/(main)/feeds/notifications.jsx
// Activity feed backed by notificationStore, with filter tabs, pull-to-refresh,
// infinite scroll, and mark-all-read. Instagram-style flat list.

import React, { useCallback, useEffect, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../../constants/spacing";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import useNotificationStore from "../../../stores/notificationStore";
import { Header, Screen } from "../../../components/common";
import { Button, EmptyState, Loading, SegmentedControl } from "../../../components/ui";
import NotificationRow from "../../../components/feeds/NotificationRow";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "mentions", label: "Mentions" },
  { value: "likes", label: "Likes" },
  { value: "comments", label: "Comments" },
  { value: "follows", label: "Follows" },
];

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

export default function NotificationsScreen() {
  const router = useRouter();

  const feed = useNotificationStore((s) => s.feed);
  const items = useNotificationStore((s) => s.items);
  const activeFilter = useNotificationStore((s) => s.activeFilter);
  const setActiveFilter = useNotificationStore((s) => s.setActiveFilter);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const loadMoreNotifications = useNotificationStore((s) => s.loadMoreNotifications);
  const refreshNotifications = useNotificationStore((s) => s.refreshNotifications);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const data = useMemo(
    () => (feed.ids ?? []).map((id) => items[id]).filter(Boolean),
    [feed.ids, items]
  );

  const openNotification = useCallback(
    (notification) => {
      markRead(notification.id);
      const { type, postId, commentId, actor } = notification;

      switch (type) {
        case "mention":
        case "comment":
          if (postId) {
            // Navigate to post, and if there's a commentId, we can pass it to scroll to that comment
            router.navigate(`/(main)/feeds/post/${postId}${commentId ? `?commentId=${commentId}` : ""}`);
          } else if (actor?.id) {
            router.navigate(`/profile/${actor.id}`);
          }
          break;

        case "follow":
          if (actor?.id) {
            router.navigate(`/profile/${actor.id}`);
          }
          break;

        case "like":
        case "repost":
          if (postId) {
            router.navigate(`/(main)/feeds/post/${postId}`);
          } else if (actor?.id) {
            router.navigate(`/profile/${actor.id}`);
          }
          break;

        case "message":
          // For messages, we'd need conversationId - fallback to actor profile
          if (actor?.id) {
            router.navigate(`/profile/${actor.id}`);
          }
          break;

        default:
          if (postId) {
            router.navigate(`/(main)/feeds/post/${postId}`);
          } else if (actor?.id) {
            router.navigate(`/profile/${actor.id}`);
          }
      }
    },
    [markRead, router]
  );

  const onRefresh = useCallback(() => refreshNotifications(), [refreshNotifications]);
  const onEndReached = useCallback(() => loadMoreNotifications(), [loadMoreNotifications]);

  const isEmpty = data.length === 0 && !feed.isLoading;
  const filterLabels = {
    all: "No activity yet",
    mentions: "No mentions yet",
    likes: "No likes yet",
    comments: "No comments yet",
    follows: "No new followers yet",
  };

  return (
    <Screen
      header={
        <Header
          title="Activity"
          showBack
          right={
            unreadCount > 0 ? (
              <Button title="Mark all read" variant="link" size="small" onPress={markAllRead} />
            ) : null
          }
        />
      }
    >
      <SegmentedControl segments={FILTERS} value={activeFilter} onChange={setActiveFilter} />

      {feed.isLoading && data.length === 0 ? (
        <Loading label="Loading activity…" style={styles.loading} />
      ) : isEmpty ? (
        <EmptyState
          icon="notifications-outline"
          title={filterLabels[activeFilter] || filterLabels.all}
          description={
            activeFilter === "all"
              ? "Likes, comments and new followers will show up here."
              : `No ${activeFilter} to show right now.`
          }
          style={styles.emptyState}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationRow notification={item} onPress={openNotification} />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={feed.isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={feed.hasMore ? null : <View style={styles.endFooter} />}
          contentContainerStyle={styles.content}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  separator: {
    height: layout.borderWidth.thin,
    backgroundColor: colors.border,
    marginLeft: spacing.screenHorizontal + 48 + spacing.md,
  },
  endFooter: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
});
