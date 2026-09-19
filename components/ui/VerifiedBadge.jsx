// VerifiedBadge component: tier (blue / gold / custom colour). Used on reels,
// posts and profiles. White on dark mode, black on light mode, 24px MaterialIcons.
import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useAppTheme from "../../hooks/useAppTheme";
import layout from "../../constants/layout";

export function VerifiedBadge({ size = 24, color = "#34B7F1", iconName = "verified" }) {
  const { theme, isDark } = useAppTheme();
  const badgeColor = color || "#34B7F1";
  const iconColor = isDark ? "#FFFFFF" : "#000000";
  return (
    <View
      style={[
        styles.verifiedBadge,
        {
          backgroundColor: badgeColor,
          borderRadius: layout.borderRadius.round,
          width: size,
          height: size,
          borderWidth: 1.5,
          borderColor: isDark ? "#FFFFFF" : "#000000",
        },
      ]}
    >
      <MaterialIcons
        name={iconName}
        size={size - 6}
        color={iconColor}
        style={{ color: isDark ? "#FFFFFF" : "#000000" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  verifiedBadge: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.2)",
  },
});