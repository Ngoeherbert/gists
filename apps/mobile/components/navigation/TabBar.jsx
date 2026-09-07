import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabBar({
  tabs = [],
  activeTab,
  onChange,
  scrollable = false,
}) {
  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.container, scrollable && styles.scrollableContainer]}
      >
        {tabs.map((tab) => {
          const key = typeof tab === "string" ? tab : tab.key;
          const label = typeof tab === "string" ? tab : tab.label;
          const icon = typeof tab === "string" ? null : tab.icon;
          const activeIcon =
            typeof tab === "string" ? null : tab.activeIcon || tab.icon;

          const active = key === activeTab;

          return (
            <Pressable
              key={key}
              onPress={() => onChange?.(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={label}
              style={({ pressed }) => [
                styles.tab,
                scrollable && styles.scrollableTab,
                pressed && styles.pressed,
              ]}
            >
              {icon ? (
                <Ionicons
                  name={active ? activeIcon : icon}
                  size={19}
                  color={active ? "#000" : "#888"}
                  style={styles.icon}
                />
              ) : null}

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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  container: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 8,
  },

  scrollableContainer: {
    alignSelf: "flex-start",
  },

  tab: {
    flex: 1,
    minWidth: 80,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 10,
  },

  scrollableTab: {
    flex: 0,
  },

  icon: {
    marginBottom: 3,
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
    bottom: 0,
    height: 2,
    width: 28,
    borderRadius: 1,
    backgroundColor: "#000",
  },

  pressed: {
    opacity: 0.65,
  },
});
