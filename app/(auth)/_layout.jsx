// app/(auth)/_layout.jsx
// Auth funnel stack. Slides in from the right so the back gesture feels natural.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../constants/colors";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    />
  );
}
