import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsValue({
  value,
  placeholder = "Not set",
  onPress,
  showChevron = false,
  color = "#555",
  numberOfLines = 1,
}) {
  const content = (
    <>
      <Text
        style={[
          styles.value,
          !value && styles.placeholder,
          { color: value ? color : "#999" },
        ]}
        numberOfLines={numberOfLines}
      >
        {value || placeholder}
      </Text>

      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#999"
          style={styles.chevron}
        />
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 180,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },

  placeholder: {
    fontWeight: "500",
  },

  chevron: {
    marginLeft: 6,
  },

  pressed: {
    opacity: 0.6,
  },
});
