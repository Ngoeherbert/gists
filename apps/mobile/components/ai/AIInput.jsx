// apps/mobile/components/ai/AIInput.jsx

import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AIInput({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Ask Gist AI...",
  loading = false,
  disabled = false,
  maxLength = 4000,
  onFocus,
  onBlur,
}) {
  const [internalValue, setInternalValue] = useState("");

  const isControlled = value !== undefined;
  const text = isControlled ? value : internalValue;

  const handleChangeText = (nextValue) => {
    if (isControlled) {
      onChangeText?.(nextValue);
    } else {
      setInternalValue(nextValue);
      onChangeText?.(nextValue);
    }
  };

  const handleSubmit = () => {
    const trimmed = text.trim();

    if (!trimmed || loading || disabled) return;

    onSubmit?.(trimmed);

    if (!isControlled) {
      setInternalValue("");
    }
  };

  const canSubmit = Boolean(text.trim()) && !loading && !disabled;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={maxLength}
          editable={!disabled && !loading}
          style={styles.input}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={[styles.sendButton, !canSubmit && styles.sendButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Send message to Gist AI"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons
              name="arrow-up"
              size={19}
              color={canSubmit ? "#fff" : "#999"}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },
  inputWrapper: {
    minHeight: 52,
    maxHeight: 140,
    borderRadius: 26,
    backgroundColor: "#f2f2f2",
    paddingLeft: 17,
    paddingRight: 5,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 125,
    paddingHorizontal: 0,
    paddingVertical: 9,
    color: "#111",
    fontSize: 15,
    lineHeight: 21,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ddd",
  },
});
