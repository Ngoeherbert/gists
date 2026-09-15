// components/ui/SegmentedControl.jsx
// Underlined tab strip used by the feed ("For you" / "Following") and the
// profile content tabs. Keeps a consistent selected-state across screens.

import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "./Text";

export default function SegmentedControl({
  segments = [],
  value,
  onChange,
  scrollable = false,
  style,
}) {
  const { theme, isDark } = useAppTheme();

  const body = segments.map((segment) => {
    const key = segment.value ?? segment;
    const label = segment.label ?? segment;
    const isActive = key === value;

    return (
      <Pressable
        key={key}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        onPress={() => onChange?.(key)}
        style={[styles.segment, scrollable && styles.scrollableSegment]}
      >
        <Text
          variant={isActive ? "bodyMedium" : "body"}
          color={isActive ? "default" : "tertiary"}
        >
          {label}
        </Text>
        <View
          style={[
            styles.indicator,
            {
              backgroundColor: isActive
                ? theme.colors.primary
                : colors.transparent,
            },
          ]}
        />
      </Pressable>
    );
  });

  const content = (
    <View
      style={[
        styles.wrap,
        {
          borderBottomColor: isDark ? colors.border : theme.colors.border,
          borderBottomWidth: layout.borderWidth.thin,
        },
        style,
      ]}
    >
      {body}
    </View>
  );

  if (!scrollable) return content;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={{
        borderBottomColor: isDark ? colors.border : theme.colors.border,
        borderBottomWidth: layout.borderWidth.thin,
      }}
    >
      {body}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    paddingTop: spacing.md,
  },
  scrollableSegment: {
    flex: 0,
    paddingHorizontal: spacing.lg,
  },
  indicator: {
    height: 2,
    borderRadius: 1,
    width: "60%",
    marginTop: spacing.sm,
  },
});
