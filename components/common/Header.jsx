// components/common/Header.jsx
// Top app bar: optional back button, centered or left-aligned title, and a
// right-hand actions slot. Used by every (main) section screen.

import React, { isValidElement } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import IconButton from "../ui/IconButton";
import Text from "../ui/Text";

export default function Header({
  title,
  subtitle,
  showBack = false,
  showSearch = false,
  onSearchPress,
  right = null,
  centerTitle = false,
  compactTitle = false,
  border = true,
  titleVariant = "subtitle",
  titleStyle,
  style,
}) {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        compactTitle && styles.compactWrap,
        {
          borderBottomColor: isDark ? colors.border : theme.colors.border,
          borderBottomWidth: border ? layout.borderWidth.thin : 0,
        },
        style,
      ]}
    >
      <View style={[styles.side, compactTitle && styles.compactSide]}>
        {showBack ? (
          <IconButton
            name="arrow-back"
            onPress={() =>
              router.canGoBack?.()
                ? router.back()
                : router.replace("/(main)/feeds")
            }
          />
        ) : null}
      </View>

      <View style={[styles.center, centerTitle && styles.centerAlign]}>
        {title ? (
          isValidElement(title) ? (
            title
          ) : (
            <Text
              variant={titleVariant}
              numberOfLines={1}
              align={centerTitle ? "center" : "left"}
              style={[compactTitle && styles.compactTitleText, titleStyle]}
            >
              {title}
            </Text>
          )
        ) : null}
        {subtitle ? (
          <Text variant="caption" color="tertiary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.right]}>
        {showSearch ? (
          <IconButton name="search-outline" onPress={onSearchPress} />
        ) : null}
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: layout.headerHeight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  side: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: layout.headerHeight,
  },
  right: {
    justifyContent: "flex-end",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  centerAlign: {
    alignItems: "center",
  },
  compactSide: {
    minWidth: spacing.xs,
  },
  compactWrap: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  compactTitleText: {
    marginLeft: -spacing.s,
  },
});
