// apps/mobile/components/ai/GistAIButton.jsx

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GistAIButton({
  onPress,
  label = "Gist AI",
  compact = false,
  disabled = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compactButton,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name="sparkles" size={compact ? 17 : 19} color="#fff" />

      {!compact && <Text style={styles.text}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    paddingHorizontal: 17,
    borderRadius: 23,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  compactButton: {
    width: 44,
    height: 44,
    minHeight: 44,
    paddingHorizontal: 0,
    borderRadius: 22,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
});
