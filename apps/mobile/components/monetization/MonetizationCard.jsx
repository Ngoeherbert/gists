import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MonetizationCard({
  enabled = false,
  title = "Monetize your content",
  description = "Earn from your audience with creator tools, subscriptions and more.",
  onPress,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={enabled ? "cash-outline" : "sparkles-outline"}
          size={25}
          color="#000"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>

          <View style={[styles.statusBadge, enabled && styles.enabledBadge]}>
            <Text style={[styles.statusText, enabled && styles.enabledText]}>
              {enabled ? "Active" : "Get started"}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{description}</Text>

        {onPress ? (
          <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>
              {enabled ? "Manage monetization" : "Start earning"}
            </Text>
            <Ionicons name="arrow-forward" size={17} color="#fff" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#eee",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  title: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },

  statusBadge: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  enabledBadge: {
    backgroundColor: "#000",
  },

  statusText: {
    color: "#666",
    fontSize: 10,
    fontWeight: "700",
  },

  enabledText: {
    color: "#fff",
  },

  description: {
    color: "#777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  button: {
    height: 42,
    borderRadius: 21,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginTop: 14,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginRight: 7,
  },

  pressed: {
    opacity: 0.75,
  },
});
