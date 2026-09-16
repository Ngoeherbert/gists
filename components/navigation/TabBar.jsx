// components/navigation/TabBar.jsx
// Modern bottom tab bar: a floating pill with backdrop blur, active-tab highlight
// and subtle scale animation. Receives the tab descriptors expo-router passes to
// a custom tabBar renderer, so it stays in sync with Tabs.Screen definitions.
//
// The pill is absolutely positioned so scrollable content renders *underneath*
// it (no bottom safe-area padding, no reserved flex space). Icon provider is
// configurable per tab (or globally via config.navigation.tabs.iconProvider),
// so the same icon name can render through Ionicons, Feather,
// MaterialCommunityIcons, etc.

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";

// Map a provider key to the vector-icon component from @expo/vector-icons.
const ICON_PROVIDERS = {
  antdesign: AntDesign,
  entypo: Entypo,
  feather: Feather,
  fontawesome: FontAwesome,
  fontawesome5: FontAwesome5,
  foundation: Foundation,
  ionicons: Ionicons,
  material: MaterialIcons,
  materialcommunity: MaterialCommunityIcons,
  octicons: Octicons,
  simpleline: SimpleLineIcons,
  zocial: Zocial,
};

// Resolve the icon element for a tab. `icon` may be:
//  - a string            → rendered via the tab's (or global) provider
//  - { provider, name }  → rendered via the named provider
//  - a React element     → rendered as-is
function resolveIcon(icon, provider, { color, size }) {
  if (icon == null) return null;
  if (React.isValidElement(icon)) return icon;

  let name;
  let providerKey = provider;
  if (typeof icon === "string") {
    name = icon;
  } else if (typeof icon === "object" && icon !== null) {
    name = icon.name;
    providerKey = icon.provider ?? providerKey;
  } else {
    return null;
  }

  const IconComponent = ICON_PROVIDERS[providerKey] || Ionicons;
  return <IconComponent name={name} size={size} color={color} />;
}

export default function TabBar({ state, descriptors, navigation }) {
  const { theme, isDark } = useAppTheme();

  const backgroundColor = isDark
    ? "rgba(24, 24, 31, 0.85)"
    : "rgba(255, 255, 255, 0.85)";
  const borderColor = isDark ? colors.borderLight : "rgba(0,0,0,0.08)";

  return (
    <View style={styles.outer}>
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
          const activeBg = isFocused ? theme.colors.primary : "transparent";
          const iconBackground = isCreate ? colors.primary : activeBg;

          // Per-tab icon provider override, falling back to the global default.
          const provider =
            options.tabBarIconProvider ??
            options.iconProvider ??
            "ionicons";

          const icon = options.tabBarIcon
            ? options.tabBarIcon({
                focused: isFocused,
                color: iconColor,
                size: layout.iconSize.lg,
              })
            : null;

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
                {resolveIcon(icon, provider, {
                  color: iconColor,
                  size:
                    isCreate || isFocused
                      ? layout.iconSize.lg
                      : layout.iconSize.md,
                })}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
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
    borderRadius: 50,
    borderWidth: 1,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
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
});