// apps/mobile/components/ai/AISuggestion.jsx

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AISuggestion({ suggestion, onPress }) {
  const text =
    typeof suggestion === "string"
      ? suggestion
      : suggestion?.text || suggestion?.label || suggestion?.title || "";

  const icon = typeof suggestion === "object" ? suggestion?.icon : null;

  if (!text) return null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      <Ionicons name={icon || "sparkles-outline"} size={17} color="#111" />

      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>

      <Ionicons name="arrow-forward" size={16} color="#777" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pressed: {
    opacity: 0.65,
  },
  text: {
    flex: 1,
    color: "#111",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
});
