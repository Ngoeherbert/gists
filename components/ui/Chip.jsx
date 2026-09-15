// components/ui/Chip.jsx
// Compact pill used for filters, categories, tags and selectable options.

import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "./Text";

export default function Chip({
  label,
  selected = false,
  disabled = false,
  icon,
  onPress,
  onRemove,
  size = "medium",
  style,
}) {
  const { theme, isDark } = useAppTheme();
  const selectedBg = theme.colors.primary;
  const selectedFg = colors.white;

  const bg = selected
    ? selectedBg
    : isDark
      ? colors.surfaceLight
      : theme.app.surface;
  const fg = selected ? selectedFg : theme.text.secondary;
  const height = size === "small" ? 28 : 34;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        {
          height,
          backgroundColor: bg,
          borderRadius: layout.borderRadius.round,
          borderColor: selected
            ? selectedBg
            : isDark
              ? colors.border
              : theme.colors.border,
          borderWidth: layout.borderWidth.thin,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={layout.iconSize.sm}
          color={fg}
          style={{ marginRight: spacing.xs }}
        />
      ) : null}

      <Text
        color={fg}
        style={{ fontSize: size === "small" ? 12 : 13, fontWeight: "600" }}
      >
        {label}
      </Text>

      {onRemove ? (
        <Pressable
          onPress={onRemove}
          hitSlop={spacing.sm}
          style={styles.remove}
        >
          <Ionicons
            name="close"
            size={layout.iconSize.sm}
            color={selected ? selectedFg : theme.text.tertiary}
          />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    alignSelf: "flex-start",
  },
  remove: {
    marginLeft: spacing.xs,
  },
});
