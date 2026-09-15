// components/ui/Loading.jsx
// Two loading affordances:
//   <Spinner />  — inline, themed activity indicator
//   <Loading />  — full-area centered spinner with optional label

import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "./Text";

export function Spinner({ size = "small", color, style }) {
  const { theme } = useAppTheme();
  return (
    <ActivityIndicator
      size={size}
      color={color || theme.colors.primary}
      style={style}
      animating
    />
  );
}

export default function Loading({ label, fullscreen = true, style }) {
  return (
    <View style={[fullscreen ? styles.full : styles.inline, style]}>
      <Spinner size="large" />
      {label ? (
        <Text variant="bodySmall" color="secondary_text" style={styles.label}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  inline: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  label: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});
