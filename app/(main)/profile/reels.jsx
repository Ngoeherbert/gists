// app/(main)/profile/reels.jsx
// The user's reels, as a 3-up grid.

import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import ProfileListScreen from "../../../components/profile/ProfileListScreen";

export default function ProfileReelsScreen() {
  const { theme, isDark } = useAppTheme();

  return (
    <ProfileListScreen
      type="reels"
      title="Reels"
      numColumns={3}
      columnWrapperStyle={styles.column}
      emptyIcon="play-circle-outline"
      emptyTitle="No reels yet"
      emptyDescription="Reels from this account will appear here."
      renderItem={({ item }) => (
        <View
          style={[
            styles.tile,
            { backgroundColor: isDark ? colors.surfaceLight : theme.app.surface },
          ]}
        >
          <Ionicons name="play-circle-outline" size={layout.iconSize.lg} color={theme.text.muted} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  column: {
    paddingHorizontal: spacing.xxs,
  },
  tile: {
    flex: 1 / 3,
    aspectRatio: 9 / 16,
    margin: spacing.xxs,
    borderRadius: layout.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
