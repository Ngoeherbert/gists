// app/(main)/reels/index.jsx
// Full-screen vertical reel pager. One reel per viewport; the visible index
// drives reelStore's active/playing state.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import useReelStore from "../../../stores/reelStore";
import { IconButton, Loading } from "../../../components/ui";
import ReelItem from "../../../components/reels/ReelItem";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

export default function ReelsScreen() {
  const router = useRouter();
  const listRef = useRef(null);

  const feed = useReelStore((s) => s.feed);
  const reels = useReelStore((s) => s.reels);
  const setActiveReel = useReelStore((s) => s.setActiveReel);
  const fetchReels = useReelStore((s) => s.fetchReels);
  const incrementView = useReelStore((s) => s.incrementView);

  const [viewportHeight, setViewportHeight] = useState(WINDOW_HEIGHT);
  const [index, setIndex] = useState(0);

  const data = (feed.ids ?? []).map((id) => reels[id]).filter(Boolean);

  useEffect(() => {
    if (feed.ids.length === 0 && !feed.isLoading) fetchReels({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (feed.isLoading && data.length === 0) {
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
          if (feed.hasMore) fetchReels({});
        }}
        ListEmptyComponent={
          <View style={[styles.center, { height: viewportHeight }]}>
            <Loading label="No reels yet" fullscreen={false} />
          </View>
        }
      />

      {/* Floating chrome */}
      <View style={styles.topBar} pointerEvents="box-none">
        <IconButton
          name="arrow-back"
          color={colors.white}
          onPress={() => router.back()}
        />
        <IconButton
          name="camera-outline"
          color={colors.white}
          onPress={() => router.push("/(main)/create/reel")}
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
    top: layout.headerHeight,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: layout.headerHeight / 2,
  },
});
