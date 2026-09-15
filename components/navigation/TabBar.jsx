// components/navigation/TabBar.jsx
// Custom bottom tab bar. Receives the tab descriptors expo-router passes to a
// custom tabBar renderer, so it stays in sync with Tabs.Screen definitions.

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

  const backgroundColor = isDark ? colors.surface : colors.white;
  const borderColor = isDark ? colors.border : theme.colors.border;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor,
          borderTopColor: borderColor,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const tintColor = isFocused ? theme.colors.primary : theme.text.tertiary;

        const iconName = options.tabBarIcon
          ? options.tabBarIcon({
              focused: isFocused,
              color: tintColor,
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
            <View style={styles.iconWrap}>
              {typeof iconName === "string" ? (
                <Ionicons name={iconName} size={layout.iconSize.lg} color={tintColor} />
              ) : (
                iconName
              )}
            </View>

            <Text
              variant="caption"
              numberOfLines={1}
              style={[styles.label, { color: tintColor }]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    borderTopWidth: layout.borderWidth.thin,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: layout.iconSize.lg,
  },
  label: {
    marginTop: spacing.xxs,
  },
});
