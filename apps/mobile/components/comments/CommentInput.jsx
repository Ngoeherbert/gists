import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../common/Avatar";

export default function CommentInput({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Add a comment...",
  user,
  replyingTo,
  onCancelReply,
  loading = false,
}) {
  /*
   * The text actually shown/used. Updated synchronously
   * on every keystroke so the send button never flickers
   * while the (potentially async) parent state catches up.
   */
  const [displayText, setDisplayText] = useState(() => String(value ?? ""));

  /*
   * Last text we reported to the parent. Used to tell
   * apart external value changes (e.g. the parent
   * clearing the input after submit) from the parent's
   * lagging echo of our own keystrokes.
   */
  const lastEmittedRef = useRef(String(value ?? ""));

  const isControlled = value !== undefined;

  const text = displayText;

  const hasText = text.trim().length > 0;

  /*
   * Sync only when the value changed externally.
   * Values that match what we last emitted are the
   * parent simply echoing our typing and must NOT
   * override the local text (this prevents the
   * disabled/enabled flicker).
   */
  useEffect(() => {
    if (!isControlled) {
      return;
    }

    const nextValue = String(value ?? "");

    if (nextValue !== lastEmittedRef.current) {
      lastEmittedRef.current = nextValue;

      setDisplayText(nextValue);
    }
  }, [isControlled, value]);

  const handleChangeText = (nextValue) => {
    lastEmittedRef.current = nextValue;

    setDisplayText(nextValue);

    onChangeText?.(nextValue);
  };

  const handleSubmit = () => {
    if (!hasText || loading) {
      return;
    }

    const trimmedText = text.trim();

    onSubmit?.(trimmedText);

    if (!isControlled) {
      lastEmittedRef.current = "";

      setDisplayText("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      {replyingTo && (
        <View style={styles.replyingBar}>
          <View style={styles.replyingInfo}>
            <Ionicons name="return-down-forward" size={16} color="#555555" />

            <Text style={styles.replyingText} numberOfLines={1}>
              Replying to{" "}
              {replyingTo?.user?.name ||
                replyingTo?.user?.username ||
                "comment"}
            </Text>
          </View>

          <Pressable
            onPress={onCancelReply}
            hitSlop={8}
            style={styles.cancelReply}
          >
            <Ionicons name="close" size={18} color="#555555" />
          </Pressable>
        </View>
      )}

      <View style={styles.container}>
        <Avatar
          uri={user?.avatar || user?.avatarUrl}
          name={user?.name || user?.username || "User"}
          size={38}
        />

        <View style={styles.inputWrapper}>
          <TextInput
            value={text}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999999"
            multiline
            maxLength={1000}
            style={styles.input}
            returnKeyType="default"
            blurOnSubmit={false}
          />

          <Pressable
            onPress={handleSubmit}
            disabled={!hasText || loading}
            style={[
              styles.sendButton,
              (!hasText || loading) && styles.sendButtonDisabled,
            ]}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={hasText && !loading ? "#FFFFFF" : "#999999"}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  replyingBar: {
    minHeight: 42,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDDDDD",
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  replyingInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  replyingText: {
    flex: 1,
    color: "#555555",
    fontSize: 12,
  },

  cancelReply: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },

  inputWrapper: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
    flexDirection: "row",
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 108,
    paddingHorizontal: 0,
    paddingVertical: 8,
    color: "#111111",
    fontSize: 14,
    lineHeight: 20,
    outlineStyle: "none",
  },

  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#DDDDDD",
  },
});
