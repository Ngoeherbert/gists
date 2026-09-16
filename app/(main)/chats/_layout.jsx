// app/(main)/chats/_layout.jsx
// Chats section: conversation list plus every nested chat surface.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../../constants/colors";

export default function ChatsLayout() {
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
      <Stack.Screen name="search" />
      <Stack.Screen name="new-gist" />
      <Stack.Screen name="ai" />
      <Stack.Screen name="info" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="call/voice" options={{ presentation: "fullScreenModal" }} />
      <Stack.Screen name="call/video" options={{ presentation: "fullScreenModal" }} />
      <Stack.Screen name="room/[id]" />
      <Stack.Screen name="room/games" />
      <Stack.Screen name="room/info" />
    </Stack>
  );
}
