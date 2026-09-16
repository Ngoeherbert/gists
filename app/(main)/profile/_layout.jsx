// app/(main)/profile/_layout.jsx
// Profile section: the profile itself, its tabbed content lists, and settings.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../../constants/colors";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        tabBarStyle: { display: "none" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ tabBarStyle: { display: "flex" } }}
      />
      <Stack.Screen name="edit" />
      <Stack.Screen name="feeds" />
      <Stack.Screen name="reels" />
      <Stack.Screen name="likes" />
      <Stack.Screen name="saved" />
      <Stack.Screen name="following" />
      <Stack.Screen name="gisties" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
