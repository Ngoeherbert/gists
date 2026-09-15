// app/(onboarding)/splash.jsx
// Branded splash. Fades the logo in, then routes onward once the auth session
// has been restored (authStore.restoreSession) and the app is ready.

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import config from "../../constants/config";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useAppStore from "../../stores/appStore";
import useAuthStore from "../../stores/authStore";
import { Text } from "../../components/ui";

const MIN_DISPLAY_MS = 1400;

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);
  const status = useAuthStore((s) => s.status);
  const isLoading = useAuthStore((s) => s.isLoading);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  // Kick off session restore as soon as the splash mounts.
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 6, bounciness: 8 }),
    ]).start();
  }, [opacity, scale]);

  // Route once both the animation window and the session restore have settled.
  useEffect(() => {
    if (isLoading) return undefined;

    const timer = setTimeout(() => {
      if (status === "authenticated") {
        router.replace("/(main)/feeds");
      } else if (hasSeenOnboarding) {
        router.replace("/(auth)/welcome");
      } else {
        router.replace("/(onboarding)/screen-1");
      }
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [isLoading, status, hasSeenOnboarding, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="sparkles" size={layout.iconSize.xxl} color={colors.white} />
        </View>

        <Text variant="display" style={styles.brand}>
          {config.app.displayName}
        </Text>

        <Text variant="body" color="secondary_text" style={styles.tagline}>
          Share your story, one gist at a time
        </Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity }]}>
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.dot, { backgroundColor: colors.borderLight }]} />
        <View style={[styles.dot, { backgroundColor: colors.borderLight }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: layout.borderRadius.xxl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  brand: {
    marginBottom: spacing.sm,
  },
  tagline: {
    textAlign: "center",
    maxWidth: 260,
  },
  footer: {
    position: "absolute",
    bottom: spacing.huge,
    flexDirection: "row",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: spacing.xxs,
  },
});
