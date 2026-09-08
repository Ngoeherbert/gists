import React from "react";
import { Stack } from "expo-router";

export default function FeedsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="discover" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="story" />

      {/*
       * User profile opened from the feed.
       * Pushed as /(main)/feeds/profile/[userId]
       * with param userId; back returns to feed.
       */}
      <Stack.Screen name="profile/[userId]" />
    </Stack>
  );
}
