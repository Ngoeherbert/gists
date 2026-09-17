// app/profile/_layout.jsx
// Profile group stack: user profile view & share modal.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../constants/colors";

export default function UserProfileGroup() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen name="share" options={{ presentation: "modal" }} />
    </Stack>
  );
}
