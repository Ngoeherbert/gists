// app/(main)/reels/_layout.jsx
// Reels section: the full-screen vertical player plus its nested routes.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../../constants/colors";

export default function ReelsLayout() {
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
      <Stack.Screen name="comments/[id]" />
      <Stack.Screen name="editor" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
