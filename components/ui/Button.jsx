// components/ui/Button.jsx
// Primary action component. Supports solid/outline/ghost/link variants, four
// sizes, leading/trailing icons, loading and disabled states, and optional
// full-width layout. Press feedback uses Animated (no reanimated dependency).

import React, { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import typography from "../../constants/typography";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "./Text";

const SIZES = {
  small: {
    height: layout.buttonHeight.small,
    px: spacing.md,
    font: typography.size.sm,
    icon: layout.iconSize.sm,
    gap: spacing.xs,
  },
  medium: {
    height: layout.buttonHeight.medium,
    px: spacing.lg,
    font: typography.size.md,
    icon: layout.iconSize.md,
    gap: spacing.sm,
  },
  large: {
    height: layout.buttonHeight.large,
    px: spacing.xl,
    font: typography.size.lg,
    icon: layout.iconSize.md,
    gap: spacing.sm,
  },
  xlarge: {
    height: layout.buttonHeight.xlarge,
    px: spacing.xxl,
    font: typography.size.xl,
    icon: layout.iconSize.lg,
    gap: spacing.md,
  },
};

const VARIANTS = ["solid", "outline", "ghost", "link", "danger"];
const TONES = ["primary", "secondary", "accent", "success", "warning", "error"];

// Resolves a tone + variant pair into concrete background/border/text props.
function useVariantStyles(tone, variant, disabled) {
  const { theme, isDark } = useAppTheme();

  return useMemo(() => {
    const toneColor =
      {
        primary: theme.colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        success: theme.status.success,
        warning: theme.status.warning,
        error: theme.status.error,
      }[tone] || theme.colors.primary;

    const base = {
      bg: "transparent",
      border: "transparent",
      text: toneColor,
      borderWidth: 0,
    };

    switch (variant) {
      case "solid":
        base.bg = toneColor;
        base.text = isDark && tone === "warning" ? colors.black : colors.white;
        break;
      case "outline":
        base.border = toneColor;
        base.borderWidth = layout.borderWidth.thin;
        break;
      case "ghost":
        base.bg = isDark ? colors.surfaceLight : "rgba(0,0,0,0.05)";
        base.text = toneColor;
        break;
      case "link":
        base.text = toneColor;
        break;
      case "danger":
        base.bg = theme.status.error;
        base.text = colors.white;
        break;
      default:
        break;
    }

    if (disabled) {
      base.bg =
        variant === "solid" || variant === "danger"
          ? colors.borderLight
          : "transparent";
      base.border = variant === "outline" ? colors.border : base.border;
      base.text = theme.text.muted;
    }

    return { ...base, toneColor };
  }, [tone, variant, disabled, theme, isDark]);
}

export default function Button({
  children,
  title,
  variant = "solid",
  size = "medium",
  tone = "primary",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = false,
  haptic = true,
  style,
  textStyle,
  onPress,
  ...rest
}) {
  const { theme } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const v = useVariantStyles(tone, variant, disabled);
  const sizeConf = SIZES[size] || SIZES.medium;

  const label = children ?? title;
  const isDisabled = disabled || loading;

  const animateTo = useCallback(
    (value) =>
      Animated.spring(scale, {
        toValue: value,
        useNativeDriver: true,
        speed: 40,
        bounciness: 0,
      }).start(),
    [scale],
  );

  const handlePressIn = useCallback(() => animateTo(0.97), [animateTo]);
  const handlePressOut = useCallback(() => animateTo(1), [animateTo]);

  const handlePress = useCallback(
    (event) => {
      if (isDisabled) return;
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onPress?.(event);
    },
    [isDisabled, haptic, onPress],
  );

  const iconNode = icon ? (
    <Ionicons
      name={icon}
      size={sizeConf.icon}
      color={v.text}
      style={
        iconPosition === "left"
          ? { marginRight: sizeConf.gap }
          : { marginLeft: sizeConf.gap }
      }
    />
  ) : null;

  return (
    <Animated.View
      style={[{ transform: [{ scale }] }, fullWidth && styles.fullWidth]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          {
            height: sizeConf.height,
            paddingHorizontal: variant === "link" ? 0 : sizeConf.px,
            backgroundColor: v.bg,
            borderColor: v.border,
            borderWidth: v.borderWidth,
            borderRadius: rounded
              ? layout.borderRadius.round
              : layout.borderRadius.md,
            opacity: isDisabled && !loading ? 0.6 : 1,
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={v.text} size="small" />
        ) : (
          <View style={styles.content}>
            {iconPosition === "left" ? iconNode : null}
            {typeof label === "string" ? (
              <Text
                variant={size === "small" ? "bodySmall" : "bodyMedium"}
                color={v.text}
                style={textStyle}
              >
                {label}
              </Text>
            ) : (
              label
            )}
            {iconPosition === "right" ? iconNode : null}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
});

Button.VARIANTS = VARIANTS;
Button.TONES = TONES;
