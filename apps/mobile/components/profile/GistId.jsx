import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GistId({
  username,
  prefix = "@",
  onPress,
  copyable = false,
}) {
  if (!username) {
    return null;
  }

  const content = (
    <>
      <Text style={styles.text}>
        {prefix}
        {username.replace(/^@/, "")}
      </Text>

      {copyable && (
        <Ionicons
          name="copy-outline"
          size={15}
          color="#666"
          style={styles.icon}
        />
      )}
    </>
  );

  if (onPress || copyable) {
    return (
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.container,
          pressed && onPress && styles.pressed,
        ]}
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={`Gist ID ${prefix}${username.replace(/^@/, "")}`}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  text: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },

  icon: {
    marginLeft: 6,
  },

  pressed: {
    opacity: 0.6,
  },
});
