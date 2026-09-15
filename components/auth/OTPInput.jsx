// components/auth/OTPInput.jsx
// Boxed one-time-code input. A single hidden TextInput drives N visual boxes so
// paste and OS autofill work naturally. Parent controls `value`/`onChangeText`.

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";

export default function OTPInput({
  length = 6,
  value = "",
  onChangeText,
  autoFocus = true,
  error = false,
  disabled = false,
  onComplete,
}) {
  const { theme, isDark } = useAppTheme();
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const digits = useMemo(() => {
    const chars = value.split("");
    return Array.from({ length }, (_, i) => chars[i] || "");
  }, [value, length]);

  const activeIndex = Math.min(value.length, length - 1);

  const handleChange = useCallback(
    (text) => {
      const clean = text.replace(/[^0-9]/g, "").slice(0, length);
      onChangeText?.(clean);
      if (clean.length === length) {
        onComplete?.(clean);
      }
    },
    [length, onChangeText, onComplete],
  );

  return (
    <View>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={styles.row}
        accessibilityRole="none"
      >
        {digits.map((digit, index) => {
          const isActive = focused && index === activeIndex;
          const borderColor = error
            ? theme.status.error
            : isActive
              ? theme.colors.primary
              : isDark
                ? colors.border
                : theme.colors.border;

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  borderColor,
                  backgroundColor: isDark ? colors.chatInput : theme.app.input,
                  opacity: disabled ? 0.6 : 1,
                },
              ]}
            >
              <Text variant="title">{digit || ""}</Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        editable={!disabled}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.hidden}
        caretHidden
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: layout.borderRadius.md,
    borderWidth: layout.borderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xxs,
  },
  hidden: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },
});
