// app/(main)/feeds/notifications.jsx
// Activity feed backed by notificationStore, with filter tabs and mark-all-read.

import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../../constants/spacing";
import useNotificationStore from "../../../stores/notificationStore";
import { Header } from "../../../components/common";
import { Button, EmptyState, Loading, SegmentedControl } from "../../../components/ui";
import NotificationRow from "../../../components/feeds/NotificationRow";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "mentions", label: "Mentions" },
  { value: "likes", label: "Likes" },
  { value: "follows", label: "Follows" },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const feed = useNotificationStore((s) => s.feed);
  const items = useNotificationStore((s) => s.items);
  const activeFilter = useNotificationStore((s) => s.activeFilter);
  const setActiveFilter = useNotificationStore((s) => s.setActiveFilter);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const data = (feed.ids ?? []).map((id) => items[id]).filter(Boolean);

  const openNotification = useCallback(
    (notification) => {
      markRead(notification.id);
      if (notification.postId) router.push(`/(main)/feeds/post/${notification.postId}`);
      else if (notification.actor?.id) router.push(`/(main)/profile/${notification.actor.id}`);
    },
    [markRead, router]
  );

  return (
    <View style={styles.container}>
      <Header
        title="Activity"
        showBack
        right={
          unreadCount > 0 ? (
            <Button title="Mark all read" variant="link" size="small" onPress={markAllRead} />
          ) : null
        }
      />

      <SegmentedControl segments={FILTERS} value={activeFilter} onChange={setActiveFilter} />

      {feed.isLoading && data.length === 0 ? (
        <Loading label="Loading activity…" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationRow notification={item} onPress={openNotification} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={data.length === 0 ? styles.empty : undefined}
          ListEmptyComponent={
            <EmptyState
              icon="notifications-outline"
              title="No activity yet"
              description="Likes, comments and new followers will show up here."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: spacing.xxl,
  },
});
