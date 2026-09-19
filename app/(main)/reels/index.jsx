// app/(main)/reels/index.jsx
// Full-screen vertical reel pager with minimal chrome: a centered floating
// glass feed switcher ("For you" / "Following") and pull-to-refresh. One reel
// per viewport; the visible index drives reelStore's active/playing state.
//
// The header carries no action icons — search and notifications live in their
// own tabs — so the switcher sits optically centred. The bottom edge is left
// to the app's floating tab bar (which already owns the create affordance),
// so reels only reserve `bottomInset` of clearance.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useReelStore from "../../../stores/reelStore";
import { Button, Loading, Text } from "../../../components/ui";
import ReelItem from "../../../components/reels/ReelItem";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const SEGMENTS = [
  { value: "home", label: "For you" },
  { value: "following", label: "Following" },
];

// Clearance for the floating tab bar (50px pill + 15px offset + shadow) plus the
// device gesture area, so caption / rail / scrubber never hide behind it.
const TAB_BAR_CLEARANCE = 86;

// Glass treatment shared by the header pill and the empty state.
const GLASS = "rgba(255, 255, 255, 0.16)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.22)";

export default function ReelsScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);

  const feed = useReelStore((s) => s.homeFeed);
  const followingFeed = useReelStore((s) => s.followingFeed);
  const reels = useReelStore((s) => s.reels);
  const setActiveReel = useReelStore((s) => s.setActiveReel);
  const fetchReels = useReelStore((s) => s.fetchReels);
  const incrementView = useReelStore((s) => s.incrementView);

  const [viewportHeight, setViewportHeight] = useState(WINDOW_HEIGHT);
  const [index, setIndex] = useState(0);
  const [feedType, setFeedType] = useState("home");

  const currentFeed = feedType === "home" ? feed : followingFeed;
  const data = useMemo(
    () => (currentFeed.ids ?? []).map((id) => reels[id]).filter(Boolean),
    [currentFeed.ids, reels],
  );

  const topInset = insets.top + spacing.sm;
  const bottomInset = TAB_BAR_CLEARANCE + insets.bottom;

  // Switching feeds has to reset the pager, otherwise the new list inherits the
  // old scroll offset and the wrong reel looks active.
  useEffect(() => {
    if ((currentFeed.ids ?? []).length === 0 && !currentFeed.isLoading) {
      fetchReels({ feedType });
    }
    setIndex(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType]);

  const onRefresh = useCallback(() => {
    fetchReels({ refresh: true, feedType });
  }, [fetchReels, feedType]);

  const onViewableChange = useRef(({ viewableItems }) => {
    const first = viewableItems?.[0];
    if (!first) return;
    setIndex(first.index ?? 0);
    setActiveReel(first.item.id);
    incrementView(first.item.id);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  // Keep the latest visible index in a ref so the auto-scroll callback stays
  // referentially stable (ReelItem rows are memoised on their props).
  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Auto-scroll (off by default, toggled in the reel options sheet): when the
  // visible reel plays to its end, snap to the next one. At the end of the
  // list, pull the next page instead of scrolling into nothing.
  const handleReelEnd = useCallback(() => {
    const next = indexRef.current + 1;
    if (next < data.length) {
      listRef.current?.scrollToIndex({
        index: next,
        animated: true,
        viewPosition: 0,
      });
    } else if (currentFeed.hasMore) {
      fetchReels({ feedType });
    }
  }, [data.length, currentFeed.hasMore, fetchReels, feedType]);

  const renderItem = useCallback(
    ({ item, index: itemIndex }) => (
      <ReelItem
        reel={item}
        isActive={itemIndex === index}
        // Neighbours (±1) mount their VideoView paused so ExoPlayer/AVPlayer
        // pre-rolls the next/previous clip while the current one plays.
        shouldPreload={Math.abs(itemIndex - index) <= 1}
        height={viewportHeight}
        bottomInset={bottomInset}
        onReelEnd={handleReelEnd}
      />
    ),
    [index, viewportHeight, bottomInset, handleReelEnd],
  );

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
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableChange}
        viewabilityConfig={viewabilityConfig}
        // One full-screen row at a time: fixed layout skips measurement, the
        // tight window keeps native players bounded to the visible reel +
        // neighbours, and removeClippedSubviews unmounts distant VideoViews
        // (their poster gradients are cheap to re-render on scroll back).
        getItemLayout={(_, i) => ({
          length: viewportHeight,
          offset: viewportHeight * i,
          index: i,
        })}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (currentFeed.hasMore) fetchReels({ feedType });
        }}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={Boolean(currentFeed.isRefreshing)}
            onRefresh={onRefresh}
            tintColor={colors.white}
            colors={[colors.white]}
            progressBackgroundColor={colors.surface}
          />
        }
        ListEmptyComponent={
          <View style={[styles.center, { height: viewportHeight }]}>
            {currentFeed.isLoading ? (
              <Loading label="Loading reels…" fullscreen={false} />
            ) : (
              <ReelEmpty
                icon={
                  currentFeed.error
                    ? "cloud-offline-outline"
                    : "videocam-outline"
                }
                title={currentFeed.error ? "Couldn't load reels" : "No reels yet"}
                description={
                  currentFeed.error ||
                  "Follow a few people and their reels will show up here."
                }
                actionLabel={currentFeed.error ? "Try again" : undefined}
                onAction={currentFeed.error ? onRefresh : undefined}
              />
            )}
          </View>
        }
      />

      {/* Top scrim keeps the glass header legible over any poster. */}
      <LinearGradient
        colors={["rgba(0,0,0,0.72)", "rgba(0,0,0,0)"]}
        style={[styles.topScrim, { height: topInset + layout.headerHeight }]}
        pointerEvents="none"
      />

      {/* Header overlay: switcher only, centred. No search/bell icons — those
          live in their own tabs, and the spare slots would unbalance the pill. */}
      <View
        style={[styles.topBar, { paddingTop: topInset }]}
        pointerEvents="box-none"
      >
        <FeedSwitcher
          segments={SEGMENTS}
          value={feedType}
          onChange={setFeedType}
        />
      </View>
    </View>
  );
}

// Floating glass pill switcher. Mirrors the floating tab bar's treatment so the
// reels header reads as part of the same chrome.
function FeedSwitcher({ segments, value, onChange }) {
  return (
    <View style={styles.switcher}>
      {segments.map((segment) => {
        const active = segment.value === value;

        return (
          <Pressable
            key={segment.value}
            style={[styles.switcherItem, active && styles.switcherItemActive]}
            onPress={() => onChange?.(segment.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              variant="bodySmall"
              style={active ? styles.switcherLabelActive : styles.switcherLabel}
            >
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Empty / error state. Written locally (instead of ui/EmptyState) because the
// reels surface is always dark, whatever the app theme is.
function ReelEmpty({ icon, title, description, actionLabel, onAction }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={layout.iconSize.xl} color={colors.white} />
      </View>

      <Text variant="subtitle" style={styles.emptyTitle}>
        {title}
      </Text>

      {description ? (
        <Text variant="bodySmall" style={styles.emptyText}>
          {description}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          size="small"
          onPress={onAction}
          style={styles.emptyAction}
        />
      ) : null}
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
  topScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  switcher: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    borderRadius: layout.borderRadius.round,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: layout.borderWidth.thin,
    borderColor: GLASS_BORDER,
  },
  switcherItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.round,
  },
  switcherItemActive: {
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  switcherLabel: {
    color: "rgba(255,255,255,0.72)",
  },
  switcherLabelActive: {
    color: colors.black,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: layout.borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    backgroundColor: GLASS,
    borderWidth: layout.borderWidth.thin,
    borderColor: GLASS_BORDER,
  },
  emptyTitle: {
    color: colors.white,
    marginBottom: spacing.xs,
  },
  emptyText: {
    maxWidth: 300,
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
  },
  emptyAction: {
    marginTop: spacing.xl,
  },
});
