// app/(onboarding)/_layout.jsx
// Onboarding stack: no headers, fade transitions between slides.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../constants/colors";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "fade",
      }}
    />
  );
}
