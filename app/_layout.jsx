// app/_layout.jsx
// Root layout. Sets up safe-area handling, a themed navigation surface and the
// global Toast overlay, then declares the top-level route groups.

import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import colors from "../constants/colors";
import useAppTheme from "../hooks/useAppTheme";
import { Toast } from "../components/ui";

export default function RootLayout() {
  const { isDark } = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" options={{ animation: "none" }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}
