// components/ui/Toast.jsx
// Renders the transient message held in appStore.toast (set via
// useAppStore.getState().showToast(message, type)). Mount it once near the app
// root — it is an absolute overlay and self-hides using RN Animated.

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useAppStore from "../../stores/appStore";
import Text from "./Text";

const ICONS = {
  success: "checkmark-circle",
  error: "alert-circle",
  warning: "warning",
  info: "information-circle",
};

export default function Toast({ duration = 2600 }) {
  const toast = useAppStore((state) => state.toast);
  const hideToast = useAppStore((state) => state.hideToast);
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  useEffect(() => {
    if (!toast) return undefined;

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    timer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => finished && hideToast());
    }, duration);

    return () => clearTimeout(timer.current);
  }, [toast, duration, translateY, opacity, hideToast]);

  if (!toast) return null;

  const tone = toast.type || "info";
  const iconColor = theme.status[tone] || theme.status.info;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          top: insets.top + spacing.sm,
          backgroundColor: theme.dark ? colors.surfaceLight : colors.white,
          borderColor: theme.dark ? colors.border : theme.colors.border,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Ionicons
        name={ICONS[tone] || ICONS.info}
        size={layout.iconSize.md}
        color={iconColor}
      />
      <Text variant="bodySmall" style={styles.text} numberOfLines={3}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadius.md,
    borderWidth: layout.borderWidth.thin,
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    zIndex: 999,
  },
  text: {
    marginLeft: spacing.sm,
    flex: 1,
  },
});
