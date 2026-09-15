// components/ui/Input.jsx
// Themed text field with label, helper/error text, leading & trailing icons,
// optional password visibility toggle and a multiline mode.

import React, { forwardRef, useCallback, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import typography from "../../constants/typography";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "./Text";

const Input = forwardRef(function Input(
  {
    label,
    value,
    onChangeText,
    placeholder,
    helperText,
    error,
    disabled = false,
    secureTextEntry = false,
    leftIcon,
    rightIcon,
    onRightIconPress,
    multiline = false,
    numberOfLines = 1,
    maxLength,
    containerStyle,
    inputStyle,
    ...rest
  },
  ref,
) {
  const { theme, isDark } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isPassword = secureTextEntry;
  const hasError = Boolean(error);

  const borderColor = hasError
    ? theme.status.error
    : focused
      ? theme.colors.primary
      : isDark
        ? colors.border
        : theme.colors.border;

  const backgroundColor = isDark ? colors.chatInput : theme.app.input;
  const placeholderColor = theme.text.tertiary;
  const textColor = disabled ? theme.text.muted : theme.text.primary;

  const handleFocus = useCallback(
    (e) => {
      setFocused(true);
      rest.onFocus?.(e);
    },
    [rest],
  );

  const handleBlur = useCallback(
    (e) => {
      setFocused(false);
      rest.onBlur?.(e);
    },
    [rest],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="bodySmall" color="secondary_text" style={styles.label}>
          {label}
        </Text>
      ) : null}

      <Pressable
        onPress={() => ref?.current?.focus?.()}
        style={[
          styles.field,
          {
            backgroundColor,
            borderColor,
            borderRadius: layout.borderRadius.md,
            minHeight: multiline
              ? layout.inputHeight.large * numberOfLines * 0.7
              : layout.inputHeight.medium,
            paddingVertical: multiline ? spacing.md : 0,
            alignItems: multiline ? "flex-start" : "center",
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={layout.iconSize.md}
            color={theme.text.tertiary}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          editable={!disabled}
          secureTextEntry={isPassword && !revealed}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              color: textColor,
              fontSize: typography.size.md,
              lineHeight: typography.lineHeight.md,
            },
            multiline && styles.multiline,
            inputStyle,
          ]}
          {...rest}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setRevealed((r) => !r)}
            hitSlop={spacing.sm}
          >
            <Ionicons
              name={revealed ? "eye-off-outline" : "eye-outline"}
              size={layout.iconSize.md}
              color={theme.text.tertiary}
            />
          </Pressable>
        ) : rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            hitSlop={spacing.sm}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={layout.iconSize.md}
              color={theme.text.tertiary}
            />
          </Pressable>
        ) : null}
      </Pressable>

      {hasError || helperText ? (
        <Text
          variant="caption"
          color={hasError ? "error" : "tertiary"}
          style={styles.helper}
        >
          {error || helperText}
        </Text>
      ) : null}
    </View>
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginBottom: spacing.xs,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    borderWidth: layout.borderWidth.thin,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  multiline: {
    textAlignVertical: "top",
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  helper: {
    marginTop: spacing.xs,
  },
});
