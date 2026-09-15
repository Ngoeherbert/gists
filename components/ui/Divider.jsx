// components/ui/Divider.jsx
// Thin separator with optional centered label.

import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "./Text";

export default function Divider({ label, vertical = false, inset = 0, style }) {
  const { theme } = useAppTheme();
  const lineColor = theme.dark ? colors.border : theme.colors.border;

  if (vertical) {
    return (
      <View style={[styles.vertical, { backgroundColor: lineColor }, style]} />
    );
  }

  if (!label) {
    return (
      <View
        style={[
          { height: 1, backgroundColor: lineColor, marginLeft: inset },
          style,
        ]}
      />
    );
  }

  return (
    <View style={[styles.row, style]}>
      <View style={[styles.flex, { backgroundColor: lineColor }]} />
      <Text variant="caption" color="tertiary" style={styles.label}>
        {label}
      </Text>
      <View style={[styles.flex, { backgroundColor: lineColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  flex: {
    flex: 1,
    height: 1,
  },
  label: {
    marginHorizontal: spacing.sm,
  },
  vertical: {
    width: 1,
    alignSelf: "stretch",
  },
});
