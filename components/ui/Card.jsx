// components/ui/Card.jsx
// Surface container used for posts, settings groups, modals and list rows.

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";

const PADDING = {
  none: 0,
  small: spacing.sm,
  medium: spacing.cardPadding,
  large: spacing.xxl,
};

export default function Card({
  children,
  padding = "medium",
  elevated = false,
  bordered = true,
  pressable = false,
  onPress,
  radius = "lg",
  style,
  ...rest
}) {
  const { theme, isDark } = useAppTheme();

  const content = (
    <View
      style={[
        styles.base,
        {
          backgroundColor: isDark ? colors.card : theme.colors.card,
          borderRadius: layout.borderRadius[radius] ?? layout.borderRadius.lg,
          borderColor: isDark ? colors.border : theme.colors.border,
          borderWidth: bordered ? layout.borderWidth.thin : 0,
          padding: PADDING[padding] ?? PADDING.medium,
        },
        elevated && styles.elevated,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (!pressable && !onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
  elevated: {
    // RN elevation on Android, shadow* on iOS.
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  pressed: {
    opacity: 0.85,
  },
});
