// VerifiedBadge component: Facebook-style verification badge.
// Blue circular badge with white checkmark icon, used on reels,
// posts and profiles. Clean, minimal design consistent with Facebook's verification style.
import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function VerifiedBadge({ size = 24, color = "#1877F2", iconName = "verified" }) {
  const badgeColor = color || "#1877F2"; // Facebook blue
    // White checkmark on blue background
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
        size={size * 0.6}
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