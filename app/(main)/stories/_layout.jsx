// app/(main)/stories/_layout.jsx
// Stories group. The viewer presents as a full-screen modal.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../../constants/colors";

export default function StoriesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        tabBarStyle: { display: "none" },
      }}
    >
      <Stack.Screen
        name="viewer"
        options={{ presentation: "fullScreenModal", animation: "fade" }}
      />
      <Stack.Screen name="create" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
