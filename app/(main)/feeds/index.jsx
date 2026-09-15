// app/(main)/feeds/index.jsx
// Home feed. A "For you" / "Following" switcher over two feedStore feeds,
// with the notifications entry and compose shortcut in the header.

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import useNotificationStore from "../../../stores/notificationStore";
import { Badge, IconButton, SegmentedControl } from "../../../components/ui";
import { Header, Screen } from "../../../components/common";
import FeedList from "../../../components/feeds/FeedList";

const SEGMENTS = [
  { value: "home", label: "For you" },
  { value: "following", label: "Following" },
];

export default function FeedsScreen() {
  const router = useRouter();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [feed, setFeed] = useState("home");

return (
    <Screen
      padded={false}
      header={
        <Header
          title="Gists"
          right={
            <View style={styles.headerRight}>
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
              <IconButton
                name="add"
                onPress={() => router.navigate("/(main)/create")}
              />
            </View>
          }
        />
      }
    >
      <SegmentedControl
        segments={SEGMENTS}
        value={feed}
        onChange={setFeed}
        style={{ paddingHorizontal: spacing.screenHorizontal }}
      />

      <FeedList
        feed={feed}
        emptyProps={
          feed === "following"
            ? {
                icon: "people-outline",
                title: "Follow some people",
                description: "Posts from accounts you follow will appear here.",
                actionLabel: "Back to For you",
                onAction: () => setFeed("home"),
              }
            : {
                icon: "newspaper-outline",
                title: "Your feed is empty",
                description:
                  "New posts will show up here as people share them.",
              }
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
