// apps/mobile/components/ai/AIMessage.jsx

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../common/Avatar";

export default function AIMessage({ message = {}, onLongPress }) {
  const role =
    message?.role ||
    message?.senderType ||
    (message?.isUser ? "user" : "assistant");

  const isUser = role === "user" || role === "human";

  const text = message?.content || message?.text || message?.message || "";

  const timestamp = message?.timestamp || message?.createdAt || message?.time;

  const user = message?.user || {};
  const avatar =
    user?.avatar || user?.avatarUrl || message?.avatar || message?.avatarUrl;

  if (!text) return null;

  return (
    <View style={[styles.row, isUser ? styles.userRow : styles.assistantRow]}>
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={17} color="#fff" />
        </View>
      )}

      <Pressable
        onLongPress={onLongPress}
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[styles.text, isUser ? styles.userText : styles.assistantText]}
        >
          {text}
        </Text>

        {timestamp && (
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
            ]}
          >
            {timestamp}
          </Text>
        )}
      </Pressable>

      {isUser && avatar && (
        <Avatar
          uri={avatar}
          name={user?.name || user?.username || "You"}
          size={32}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#000",
    borderBottomRightRadius: 5,
    marginRight: 8,
  },
  assistantBubble: {
    backgroundColor: "#f1f1f1",
    borderBottomLeftRadius: 5,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: "#fff",
  },
  assistantText: {
    color: "#111",
  },
  timestamp: {
    marginTop: 5,
    fontSize: 10,
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.6)",
  },
  assistantTimestamp: {
    color: "#999",
  },
});
