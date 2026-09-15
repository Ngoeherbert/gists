// app/(main)/feeds/_layout.jsx
// Feeds section: the index feed plus the nested post / edit / comments / discover routes.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../../constants/colors";

export default function FeedsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="discover" />
      <Stack.Screen name="post/[id]" />
      <Stack.Screen name="post/[id]/comments" />
      <Stack.Screen name="edit/[id]" />
    </Stack>
  );
}