// components/profile/ProfileTabs.jsx
// The content-grid tabs on a profile (Posts / Reels / Likes / Saved) plus the
// matching grid body. Each tab reads a profileStore list.

import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useProfileStore from "../../stores/profileStore";
import EmptyState from "../ui/EmptyState";
import Loading from "../ui/Loading";
import SegmentedControl from "../ui/SegmentedControl";
import Text from "../ui/Text";

const TABS = [
  { value: "posts", label: "Posts" },
  { value: "reels", label: "Reels" },
  { value: "likes", label: "Likes" },
  { value: "saved", label: "Saved" },
];

export default function ProfileTabs({ userId = "me", ListHeaderComponent }) {
  const { theme, isDark } = useAppTheme();
  const [tab, setTab] = useState("posts");

  const list = useProfileStore((s) => s.lists[`${tab}:${userId}`]);
  const entities = useProfileStore((s) => s.entities);

  const data = (list?.ids ?? []).map((id) => entities[id]).filter(Boolean);

  const renderItem = useCallback(
    ({ item }) => (
      <View
        style={[
          styles.tile,
          { backgroundColor: isDark ? colors.surfaceLight : theme.app.surface },
        ]}
      >
        <Ionicons
          name={
            item.mediaType === "video" ? "play-circle-outline" : "image-outline"
          }
          size={layout.iconSize.lg}
          color={theme.text.muted}
        />
      </View>
    ),
    [isDark, theme],
  );

  return (
    <View style={styles.container}>
      {ListHeaderComponent}
      <SegmentedControl segments={TABS} value={tab} onChange={setTab} />

      {list?.isLoading && data.length === 0 ? (
        <Loading label="Loading…" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.column}
          contentContainerStyle={data.length === 0 ? styles.empty : styles.grid}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={
            <EmptyState
              compact
              icon={tab === "saved" ? "bookmark-outline" : "grid-outline"}
              title={`No ${tab} yet`}
              description={
                tab === "saved"
                  ? "Posts you save will be collected here."
                  : `This account hasn't shared any ${tab} yet.`
              }
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
  grid: {
    padding: spacing.xxs,
  },
  column: {
    paddingHorizontal: spacing.xxs,
  },
  tile: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: spacing.xxs,
    borderRadius: layout.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
