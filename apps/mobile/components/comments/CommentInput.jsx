// apps/mobile/components/comments/CommentInput.jsx

import React, { useRef, useState } from "react";
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
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef(null);

  const isControlled = value !== undefined;
  const text = isControlled ? value : internalValue;

  const setText = (nextValue) => {
    if (isControlled) {
      onChangeText?.(nextValue);
    } else {
      setInternalValue(nextValue);
      onChangeText?.(nextValue);
    }
  };

  const handleSubmit = () => {
    const trimmed = text.trim();

    if (!trimmed || loading) return;

    onSubmit?.(trimmed);

    if (!isControlled) {
      setInternalValue("");
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
            <Ionicons name="return-down-forward" size={16} color="#555" />
            <Text style={styles.replyingText} numberOfLines={1}>
              Replying to{" "}
              {replyingTo?.user?.name ||
                replyingTo?.user?.username ||
                "comment"}
            </Text>
          </View>

          <Pressable onPress={onCancelReply} style={styles.cancelReply}>
            <Ionicons name="close" size={18} color="#555" />
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
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
            style={styles.input}
            returnKeyType="default"
          />

          <Pressable
            onPress={handleSubmit}
            disabled={!text.trim() || loading}
            style={[
              styles.sendButton,
              (!text.trim() || loading) && styles.sendButtonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Post comment"
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={!text.trim() || loading ? "#999" : "#fff"}
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
    borderTopColor: "#ddd",
    backgroundColor: "#fafafa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  replyingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  replyingText: {
    color: "#555",
    fontSize: 12,
    flex: 1,
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
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    backgroundColor: "#f2f2f2",
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 108,
    paddingVertical: 8,
    paddingHorizontal: 0,
    color: "#111",
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ddd",
  },
});
