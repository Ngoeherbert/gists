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
        tabBarVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ tabBarVisible: true }}
      />
      <Stack.Screen name="search" options={{ tabBarVisible: false }} />
      <Stack.Screen name="new-gist" options={{ tabBarVisible: false }} />
      <Stack.Screen name="ai" options={{ tabBarVisible: false }} />
      <Stack.Screen name="info" options={{ tabBarVisible: false }} />
      <Stack.Screen name="[id]" options={{ presentation: "fullScreenModal" }} />
      <Stack.Screen name="archived" options={{ tabBarVisible: false }} />
      <Stack.Screen name="call/voice" options={{ presentation: "fullScreenModal" }} />
      <Stack.Screen name="call/video" options={{ presentation: "fullScreenModal" }} />
      <Stack.Screen name="room/[id]" />
      <Stack.Screen name="room/games" />
      <Stack.Screen name="room/info" />
    </Stack>
  );
}
