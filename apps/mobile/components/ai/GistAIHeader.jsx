// apps/mobile/components/ai/GistAIHeader.jsx

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GistAIHeader({
  title = "Gist AI",
  subtitle = "Your AI assistant",
  onBack,
  onNewChat,
  onMore,
}) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={25} color="#111" />
      </Pressable>

      <View style={styles.aiIcon}>
        <Ionicons name="sparkles" size={19} color="#fff" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        {onNewChat && (
          <Pressable
            onPress={onNewChat}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Start new AI chat"
          >
            <Ionicons name="create-outline" size={22} color="#111" />
          </Pressable>
        )}

        {onMore && (
          <Pressable
            onPress={onMore}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="More Gist AI options"
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="#111" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  aiIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: "#111",
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 2,
    color: "#888",
    fontSize: 11,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
