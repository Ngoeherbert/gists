// components/navigation/TabBar.jsx
// Modern bottom tab bar: floating pill with backdrop blur, active-tab highlight
// and subtle scale animation. Receives the tab descriptors expo-router passes to
// a custom tabBar renderer, so it stays in sync with Tabs.Screen definitions.

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";

export default function TabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useAppTheme();

  const backgroundColor = isDark
    ? "rgba(24, 24, 31, 0.85)"
    : "rgba(255, 255, 255, 0.85)";
  const borderColor = isDark ? colors.borderLight : "rgba(0,0,0,0.08)";

  return (
    <View
      style={[
        styles.outer,
        {
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      <View
        style={[
          styles.wrap,
          {
            backgroundColor,
            borderColor,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          if (route.name === "stories" || options.href === null) return null;

          const isFocused = state.index === index;
          const isCreate = route.name === "create";

          const iconColor = isCreate
            ? colors.white
            : isFocused
              ? colors.white
              : theme.text.tertiary;
          const labelColor = isFocused ? colors.white : theme.text.tertiary;
          const activeBg = isFocused ? theme.colors.primary : "transparent";
          const iconBackground = isCreate ? colors.primary : activeBg;

          const iconName = options.tabBarIcon
            ? options.tabBarIcon({
                focused: isFocused,
                color: iconColor,
                size: layout.iconSize.lg,
              })
            : null;
          const label = options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tab}
            >
              <View
                style={[
                  styles.iconWrap,
                  isCreate && styles.createIconWrap,
                  isFocused && !isCreate && [
                    styles.activeIconWrap,
                    { backgroundColor: activeBg },
                  ],
                  isCreate && { backgroundColor: iconBackground },
                ]}
              >
                {typeof iconName === "string" ? (
                  <Ionicons
                    name={iconName}
                    size={isCreate || isFocused ? layout.iconSize.lg : layout.iconSize.md}
                    color={iconColor}
                  />
                ) : (
                  iconName
                )}
              </View>

              <Text
                variant="caption"
                numberOfLines={1}
                style={[
                  styles.label,
                  { color: labelColor },
                  isFocused && styles.activeLabel,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    pointerEvents: "box-none",
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "88%",
    maxWidth: 420,
    borderRadius: 32,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxs,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: layout.iconSize.lg,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  activeIconWrap: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createIconWrap: {
    width: 48,
    height: 48,
    padding: 0,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    marginTop: spacing.xxs,
    fontWeight: "600",
  },
  activeLabel: {
    fontWeight: "700",
  },
});