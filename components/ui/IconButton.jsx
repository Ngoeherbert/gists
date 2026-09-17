// components/ui/IconButton.jsx
// Square/circular tappable icon affordance used in headers, toolbars and cards.
// Provider-aware: `name` renders via `provider` (any @expo/vector-icons
// family, defaults to Ionicons); `icon` accepts a full { name, provider }
// descriptor or a React element for custom artwork.

import React, { useCallback, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import useAppTheme from "../../hooks/useAppTheme";
import AppIcon from "./AppIcon";

const SIZES = {
  small: { box: 32, icon: layout.iconSize.sm },
  medium: { box: 40, icon: layout.iconSize.md },
  large: { box: 48, icon: layout.iconSize.lg },
};

export default function IconButton({
  name,
  icon,
  provider = "ionicons",
  iconProvider,
  size = "medium",
  color,
  background = "transparent",
  rounded = true,
  disabled = false,
  haptic = true,
  badge,
  style,
  onPress,
  ...rest
}) {
  const { theme, isDark } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const conf = SIZES[size] || SIZES.medium;
  const iconColor = color || theme.text.primary;

  const resolvedBg = useMemo(() => {
    if (background !== "transparent") return background;
    return "transparent";
  }, [background]);

  const press = useCallback(() => {
    if (disabled) return;
    if (haptic)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  }, [disabled, haptic, onPress]);

  const animateTo = (toValue) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={press}
        onPressIn={() => animateTo(0.9)}
        onPressOut={() => animateTo(1)}
        hitSlop={layout.iconSize.sm}
        style={[
          styles.base,
          {
            width: conf.box,
            height: conf.box,
            borderRadius: rounded
              ? layout.borderRadius.round
              : layout.borderRadius.sm,
            backgroundColor: resolvedBg,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
        {...rest}
      >
        <AppIcon
          icon={icon ?? name}
          provider={iconProvider ?? provider}
          size={conf.icon}
          color={iconColor}
        />
        {badge ? (
          <Animated.View
            style={[
              styles.badge,
              {
                backgroundColor: theme.status.error,
                borderColor: isDark ? colors.background : colors.white,
              },
            ]}
          />
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
});
