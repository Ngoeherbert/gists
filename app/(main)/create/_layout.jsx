// app/(main)/create/_layout.jsx
// Composer stack for post / reel / story creation.

import React from "react";
import { Stack } from "expo-router";
import colors from "../../../constants/colors";

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_bottom",
      }}
    />
  );
}
