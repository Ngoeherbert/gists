// apps/mobile/components/comments/ReplyButton.jsx

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReplyButton({ count = 0, onPress, label }) {
  const text = label || `${count} ${count === 1 ? "reply" : "replies"}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel="View replies"
    >
      <View style={styles.line} />
      <Ionicons name="return-down-forward" size={15} color="#777" />
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    gap: 6,
    minHeight: 28,
  },
  line: {
    width: 18,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#bbb",
    marginRight: 1,
  },
  text: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
  },
});
