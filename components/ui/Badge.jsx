// components/ui/Badge.jsx
// Small status/count pill. `dot` renders a presence-sized indicator instead of
// a label, and `count` clamps to "99+" automatically.

import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "./Text";

const TONES = {
  primary: (t) => t.colors.primary,
  secondary: () => colors.secondary,
  accent: () => colors.accent,
  success: (t) => t.status.success,
  warning: (t) => t.status.warning,
  error: (t) => t.status.error,
  info: (t) => t.status.info,
  neutral: () => colors.textTertiary,
};

const SIZES = {
  small: { px: spacing.sm, h: 18, font: 11 },
  medium: { px: spacing.sm, h: 22, font: 12 },
};

export default function Badge({
  label,
  count,
  tone = "primary",
  size = "small",
  variant = "solid", // "solid" | "soft" | "outline"
  dot = false,
  style,
}) {
  const { theme, isDark } = useAppTheme();
  const toneColor = (TONES[tone] || TONES.primary)(theme);
  const conf = SIZES[size] || SIZES.small;

  if (dot) {
    return (
      <View
        style={[
          {
            width: conf.h * 0.5,
            height: conf.h * 0.5,
            borderRadius: conf.h * 0.25,
            backgroundColor: toneColor,
          },
          style,
        ]}
      />
    );
  }

  const text = count != null ? (count > 99 ? "99+" : String(count)) : label;

  const palette =
    variant === "solid"
      ? { bg: toneColor, fg: colors.white, border: "transparent" }
      : variant === "soft"
        ? { bg: `${toneColor}22`, fg: toneColor, border: "transparent" }
        : { bg: "transparent", fg: toneColor, border: toneColor };

  return (
    <View
      style={[
        styles.base,
        {
          height: conf.h,
          paddingHorizontal: conf.px,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth:
            palette.border === "transparent" ? 0 : layout.borderWidth.thin,
          borderRadius: layout.borderRadius.round,
        },
        style,
      ]}
    >
      <Text
        color={palette.fg}
        style={{ fontSize: conf.font, fontWeight: "600" }}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
});
