// VerifiedBadge component: Facebook-style verification badge.
// Blue circular badge with white checkmark icon, used on reels,
// posts and profiles. Clean, minimal design consistent with Facebook's verification style.
import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useAppTheme from "../../hooks/useAppTheme";
import layout from "../../constants/layout";

export function VerifiedBadge({ size = 20, color = "#1877F2", iconName = "check" }) {
  const { isDark } = useAppTheme();
  const badgeColor = color || "#1877F2"; // Facebook blue
  // Facebook uses white checkmark on blue background regardless of theme
  const iconColor = "#FFFFFF";
  
  return (
    <View
      style={[
        styles.verifiedBadge,
        {
          backgroundColor: badgeColor,
          borderRadius: size / 2, // Fully circular
          width: size,
          height: size,
        },
      ]}
    >
      <MaterialIcons
        name={iconName}
        size={size * 0.55} // Proportional icon size
        color={iconColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  verifiedBadge: {
    alignItems: "center",
    justifyContent: "center",
    // No border - Facebook's badge is a solid blue circle
  },
});