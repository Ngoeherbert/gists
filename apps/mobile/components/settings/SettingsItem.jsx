import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SettingsIcon from "./SettingsIcon";

export default function SettingsItem({
  title,
  description,
  icon = "settings-outline",
  iconColor = "#000",
  iconBackgroundColor = "#F1F1F1",
  onPress,
  right,
  showChevron = true,
  disabled = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.container,
        disabled && styles.disabled,
        pressed && onPress && !disabled && styles.pressed,
      ]}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
    >
      <SettingsIcon
        name={icon}
        color={iconColor}
        backgroundColor={iconBackgroundColor}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>

      {right !== undefined ? (
        right
      ) : showChevron ? (
        <Ionicons name="chevron-forward" size={19} color="#999" />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
  },

  content: {
    flex: 1,
    marginHorizontal: 12,
  },

  title: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },

  description: {
    color: "#777",
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
