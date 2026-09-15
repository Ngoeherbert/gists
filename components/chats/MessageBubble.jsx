 // components/chats/MessageBubble.jsx
// A single chat message. Own messages align right and use the brand bubble;
// incoming messages align left. Includes a timestamp and read receipt.

import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";

function timeLabel(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({ message, onLongPress }) {
  const { isDark } = useAppTheme();
  if (!message) return null;

  const mine = Boolean(message.isMine);
  const bubbleColor = mine
    ? colors.chatBubbleMine
    : isDark
      ? colors.chatBubbleOther
      : "#F1F1F5";
  const textColor = mine ? colors.white : isDark ? colors.white : "#111118";

  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowOther]}>
      <Pressable
        onLongPress={() => onLongPress?.(message)}
        style={[styles.bubble, { backgroundColor: bubbleColor }]}
      >
        {message.text ? (
          <Text variant="body" style={[styles.text, { color: textColor }]}>
            {message.text}
          </Text>
        ) : null}

        {message.mediaType ? (
          <View style={styles.media}>
            <Ionicons
              name={
                message.mediaType === "image"
                  ? "image-outline"
                  : "videocam-outline"
              }
              size={layout.iconSize.lg}
              color={textColor}
            />
          </View>
        ) : null}

        <View style={styles.meta}>
          <Text
            variant="caption"
            style={[styles.time, { color: textColor, opacity: 0.7 }]}
          >
            {timeLabel(message.createdAt)}
          </Text>
          {mine ? (
            <Ionicons
              name={message.status === "read" ? "checkmark-done" : "checkmark"}
              size={14}
              color={message.status === "read" ? colors.accent : textColor}
              style={styles.receipt}
            />
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

export default memo(MessageBubble);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.sm,
  },
  rowMine: {
    justifyContent: "flex-end",
  },
  rowOther: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: layout.borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    marginBottom: spacing.xxs,
  },
  media: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  time: {
    fontSize: 10,
  },
  receipt: {
    marginLeft: spacing.xxs,
  },
});
