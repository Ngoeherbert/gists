// app/(main)/feeds/_layout.jsx
// Feeds section: the index feed plus the nested post / edit / comments / discover routes.
//
// Only the root `index` route is a tab screen — every nested screen (post detail,
// comments, editor, discover) hides the bottom tab bar so the tab stays visible
// only on the main tab screens.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../../constants/colors";

export default function FeedsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        tabBarStyle: { display: "none" },
      }}
      initialRouteName="index"
    >
      <Stack.Screen
        name="index"
        options={{ tabBarStyle: { display: "flex" } }}
      />
      <Stack.Screen name="discover" />
      <Stack.Screen name="post/[id]" />
      <Stack.Screen name="post/[id]/comments" />
      <Stack.Screen name="edit/[id]" />
    </Stack>
  );
}