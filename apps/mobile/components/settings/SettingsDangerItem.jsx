import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsDangerItem({
  title,
  description,
  icon = "trash-outline",
  onPress,
  disabled = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#E53935" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={18} color="#E53935" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginHorizontal: 12,
  },

  title: {
    color: "#E53935",
    fontSize: 14,
    fontWeight: "700",
  },

  description: {
    color: "#999",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  disabled: {
    opacity: 0.45,
  },

  pressed: {
    opacity: 0.65,
  },
});
