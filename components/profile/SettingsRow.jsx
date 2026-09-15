// components/profile/SettingsRow.jsx
// A single tappable settings line: optional leading icon, label, value text,
// chevron or a trailing node (e.g. a Switch).

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";

export default function SettingsRow({
  icon,
  iconColor,
  label,
  description,
  value,
  trailing,
  tone,
  showChevron = true,
  onPress,
  style,
}) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed, style]}
    >
      {icon ? (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: `${iconColor || theme.colors.primary}1A` },
          ]}
        >
          <Ionicons
            name={icon}
            size={layout.iconSize.sm}
            color={iconColor || theme.colors.primary}
          />
        </View>
      ) : null}

      <View style={styles.body}>
        <Text variant="bodyMedium" color={tone || "default"}>
          {label}
        </Text>
        {description ? (
          <Text variant="caption" color="tertiary">
            {description}
          </Text>
        ) : null}
      </View>

      {value ? (
        <Text variant="bodySmall" color="tertiary" style={styles.value}>
          {value}
        </Text>
      ) : null}

      {trailing}

      {!trailing && showChevron ? (
        <Ionicons name="chevron-forward" size={layout.iconSize.md} color={theme.text.tertiary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.cardPadding,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  pressed: {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: layout.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
  },
  value: {
    marginLeft: spacing.sm,
  },
});
