// app/(main)/reels/index.jsx
// Full-screen vertical reel pager. One reel per viewport; the visible index
// drives reelStore's active/playing state. Has a "For you" / "Following" switcher
// plus search (discover) and notifications shortcuts in the header.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useReelStore from "../../../stores/reelStore";
import useNotificationStore from "../../../stores/notificationStore";
import { Badge, IconButton, Loading, SegmentedControl } from "../../../components/ui";
import ReelItem from "../../../components/reels/ReelItem";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const SEGMENTS = [
  { value: "home", label: "For you" },
  { value: "following", label: "Following" },
];

export default function ReelsScreen() {
  const router = useRouter();
  const listRef = useRef(null);

  const feed = useReelStore((s) => s.homeFeed);
  const followingFeed = useReelStore((s) => s.followingFeed);
  const reels = useReelStore((s) => s.reels);
  const setActiveReel = useReelStore((s) => s.setActiveReel);
  const fetchReels = useReelStore((s) => s.fetchReels);
  const incrementView = useReelStore((s) => s.incrementView);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const [viewportHeight, setViewportHeight] = useState(WINDOW_HEIGHT);
  const [index, setIndex] = useState(0);
  const [feedType, setFeedType] = useState("home");

  const currentFeed = feedType === "home" ? feed : followingFeed;
  const data = (currentFeed.ids ?? []).map((id) => reels[id]).filter(Boolean);

  useEffect(() => {
    if (currentFeed.ids.length === 0 && !currentFeed.isLoading) fetchReels({ feedType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType]);

  const onViewableChange = useRef(({ viewableItems }) => {
    const first = viewableItems?.[0];
    if (!first) return;
    setIndex(first.index ?? 0);
    setActiveReel(first.item.id);
    incrementView(first.item.id);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const renderItem = useCallback(
    ({ item, index: itemIndex }) => (
      <ReelItem
        reel={item}
        isActive={itemIndex === index}
        height={viewportHeight}
      />
    ),
    [index, viewportHeight],
  );

  if (currentFeed.isLoading && data.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar style="light" />
        <Loading label="Loading reels…" />
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
    >
      <StatusBar style="light" />

      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        snapToInterval={viewportHeight}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableChange}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, i) => ({
          length: viewportHeight,
          offset: viewportHeight * i,
          index: i,
        })}
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (currentFeed.hasMore) fetchReels({ feedType });
        }}
        ListEmptyComponent={
          <View style={[styles.center, { height: viewportHeight }]}>
            <Loading label="No reels yet" fullscreen={false} />
          </View>
        }
      />

      {/* Header overlay */}
      <View style={styles.topBar} pointerEvents="box-none">
        <View style={styles.leftSlot} />
        <SegmentedControl
          segments={SEGMENTS}
          value={feedType}
          onChange={setFeedType}
          style={styles.segmented}
        />
        <View style={styles.rightSlot}>
          <IconButton
            name="search-outline"
            color={colors.white}
            onPress={() => router.navigate("/(main)/feeds/discover")}
          />
          <View>
            <IconButton
              name="notifications-outline"
              color={colors.white}
              onPress={() => router.navigate("/(main)/feeds/notifications")}
            />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Badge count={unreadCount} tone="error" />
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Floating chrome */}
      <View style={styles.bottomBar} pointerEvents="box-none">
        <IconButton
          name="camera-outline"
          color={colors.white}
          onPress={() => router.navigate("/(main)/create/reel")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: layout.headerHeight / 2,
    paddingHorizontal: spacing.sm,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: spacing.lg,
  },
  leftSlot: {
    width: 80,
  },
  rightSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  segmented: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
  },
});
