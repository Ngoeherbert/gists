// VerifiedBadge component: just the verified icon, no background.
// Uses MaterialIcons verified glyph with customizable color and size.
import React from "react";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function VerifiedBadge({ size = 24, color = "#083F64", iconName = "verified" }) {
  return (
    <MaterialIcons
      name={iconName}
      size={size}
      color={color}
      style={styles.badge}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: 4,
  },
});