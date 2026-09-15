// components/profile/ProfileListScreen.jsx
// Shared implementation for the profile content routes (feeds / reels / likes /
// saved) and the connection lists (following / gisties). Each route supplies a
// list type, copy and a row renderer.

import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import spacing from "../../constants/spacing";
import useProfileStore from "../../stores/profileStore";
import { Header } from "../common";
import { EmptyState, Loading } from "../ui";

export default function ProfileListScreen({
  type,
  title,
  emptyIcon = "grid-outline",
  emptyTitle,
  emptyDescription,
  renderItem,
  keyExtractor,
  numColumns = 1,
  columnWrapperStyle,
}) {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userId = id || "me";

  const list = useProfileStore((s) => s.lists[`${type}:${userId}`]);
  const entities = useProfileStore((s) => s.entities);
  const resetList = useProfileStore((s) => s.resetList);

  const data = (list?.ids ?? []).map((eid) => entities[eid]).filter(Boolean);

  const render = useCallback(
    (info) => (renderItem ? renderItem(info) : null),
    [renderItem],
  );

  return (
    <View style={styles.container}>
      <Header title={title} showBack />

      {list?.isLoading && data.length === 0 ? (
        <Loading label={`Loading ${title.toLowerCase()}…`} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={keyExtractor ?? ((item) => item.id)}
          renderItem={render}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? columnWrapperStyle : undefined}
          contentContainerStyle={
            data.length === 0 ? styles.empty : styles.content
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={emptyIcon}
              title={emptyTitle ?? `No ${title.toLowerCase()} yet`}
              description={emptyDescription}
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
  content: {
    paddingVertical: spacing.sm,
  },
  empty: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
