// apps/mobile/components/chats/GistAIFab.jsx

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GistAIFab({
  onPress,
  bottom = 82,
  right = 18,
  size = 56,
  disabled = false,
}) {
  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          bottom,
          right,
          width: size,
          height: size,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Open Gist AI"
      >
        <Ionicons name="sparkles" size={23} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    zIndex: 1000,
    elevation: 10,
  },

  button: {
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 8,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },

  disabled: {
    opacity: 0.45,
  },
});
