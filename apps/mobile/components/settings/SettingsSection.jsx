import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsSection({
  title,
  description,
  children,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },

  title: {
    color: "#777",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  description: {
    color: "#888",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 9,
    paddingHorizontal: 4,
  },

  content: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
});
