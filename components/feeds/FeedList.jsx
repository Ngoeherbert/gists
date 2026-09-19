// components/feeds/FeedList.jsx
// Paginated list bound to one feedStore feed (home / following / discover).
// Owns pull-to-refresh, infinite scroll, loading and empty/error states so the
// screens stay declarative.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useFeedStore from "../../stores/feedStore";
import EmptyState from "../ui/EmptyState";
import Loading, { Spinner } from "../ui/Loading";
import PostCard from "./PostCard";

export default function FeedList({
  feed = "home",
  fetchPage,
  emptyProps,
  contentContainerStyle,
  style,
  listHeaderComponent,
}) {
  const { theme, isDark } = useAppTheme();

  const feedState = useFeedStore((s) => s.feeds[feed]);
  const posts = useFeedStore((s) => s.posts);
  const fetchFeed = useFeedStore((s) => s.fetchFeed);

  const ids = feedState?.ids ?? [];
  const data = ids.map((id) => posts[id]).filter(Boolean);

  const load = useCallback(
    (refresh) => fetchFeed({ feed, refresh, fetchPage }),
    [feed, fetchFeed, fetchPage],
  );

  useEffect(() => {
    if (ids.length === 0 && !feedState?.isLoading) load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed]);

  const [visibleItems, setVisibleItems] = useState({});
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    const newVisible = {};
    viewableItems?.forEach(({ item, isViewable }) => {
      if (item?.id) newVisible[item.id] = isViewable;
    });
    setVisibleItems((prev) => ({ ...prev, ...newVisible }));
  }, []);

  const renderItem = useCallback(
    ({ item }) => <PostCard post={item} isVisible={visibleItems[item.id] ?? false} />,
    [visibleItems],
  );

  if (feedState?.isLoading && data.length === 0) {
    return <Loading label="Loading your feed…" />;
  }

  if (feedState?.error && data.length === 0) {
    return (
      <EmptyState
        tone="error"
        icon="cloud-offline-outline"
        title="Couldn't load the feed"
        description={feedState.error}
        actionLabel="Try again"
        onAction={() => load(true)}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={listHeaderComponent}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={[styles.list, style]}
      contentContainerStyle={[
        data.length === 0 ? styles.emptyContent : styles.content,
        contentContainerStyle,
      ]}
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (feedState?.hasMore && !feedState?.isLoading) load(false);
      }}
      refreshControl={
        <RefreshControl
          refreshing={Boolean(feedState?.isRefreshing)}
          onRefresh={() => load(true)}
          tintColor={theme.colors.primary}
        />
      }
      ListEmptyComponent={
        <EmptyState
          icon={emptyProps?.icon ?? "newspaper-outline"}
          title={emptyProps?.title ?? "Nothing here yet"}
          description={
            emptyProps?.description ??
            "Posts from people you follow will show up here."
          }
          actionLabel={emptyProps?.actionLabel}
          onAction={emptyProps?.onAction}
        />
      }
      ListFooterComponent={
        feedState?.isLoading && data.length > 0 ? (
          <Spinner style={styles.footer} />
        ) : null
      }
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  footer: {
    marginVertical: spacing.xl,
  },
});
