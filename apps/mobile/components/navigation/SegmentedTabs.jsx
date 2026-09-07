import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SegmentedTabs({
  tabs = [],
  activeTab,
  onChange,
  fullWidth = true,
}) {
  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {tabs.map((tab) => {
        const key = typeof tab === "string" ? tab : tab.key;
        const label = typeof tab === "string" ? tab : tab.label;
        const active = key === activeTab;

        return (
          <Pressable
            key={key}
            onPress={() => onChange?.(key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.tab,
              fullWidth && styles.flexTab,
              active && styles.activeTab,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[styles.label, active && styles.activeLabel]}
              numberOfLines={1}
            >
              {label}
            </Text>

            {active ? <View style={styles.indicator} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    backgroundColor: "#f3f3f3",
    borderRadius: 24,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  fullWidth: {
    width: "100%",
  },

  tab: {
    minHeight: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "relative",
  },

  flexTab: {
    flex: 1,
  },

  activeTab: {
    backgroundColor: "#fff",
  },

  label: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },

  activeLabel: {
    color: "#000",
    fontWeight: "800",
  },

  indicator: {
    position: "absolute",
    bottom: 3,
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#000",
  },

  pressed: {
    opacity: 0.7,
  },
});
