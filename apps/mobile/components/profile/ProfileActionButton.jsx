import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileActionButton({
  label,
  icon,
  onPress,
  variant = "secondary",
  disabled = false,
  flex = 1,
}) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          flex,
        },
        isPrimary && styles.primary,
        !isPrimary && !isDanger && styles.secondary,
        isDanger && styles.danger,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={isPrimary || isDanger ? "#fff" : "#000"}
          style={styles.icon}
        />
      )}

      <Text
        style={[
          styles.label,
          isPrimary && styles.primaryLabel,
          !isPrimary && !isDanger && styles.secondaryLabel,
          isDanger && styles.dangerLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  primary: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  secondary: {
    backgroundColor: "#fff",
    borderColor: "#D9D9D9",
  },

  danger: {
    backgroundColor: "#E53935",
    borderColor: "#E53935",
  },

  icon: {
    marginRight: 7,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
  },

  primaryLabel: {
    color: "#fff",
  },

  secondaryLabel: {
    color: "#000",
  },

  dangerLabel: {
    color: "#fff",
  },

  disabled: {
    opacity: 0.45,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
