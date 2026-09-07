import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DEFAULT_TABS = [
  {
    key: "posts",
    label: "Posts",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  {
    key: "reposts",
    label: "Reposts",
    icon: "repeat-outline",
    activeIcon: "repeat",
  },
  {
    key: "saved",
    label: "Saved",
    icon: "bookmark-outline",
    activeIcon: "bookmark",
  },
];

export default function ProfileTabs({
  tabs = DEFAULT_TABS,
  activeTab = "posts",
  onChange,
  showLabels = false,
}) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange?.(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              active && styles.activeTab,
              pressed && styles.pressed,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            <Ionicons
              name={active ? tab.activeIcon || tab.icon : tab.icon}
              size={22}
              color={active ? "#000" : "#888"}
            />

            {showLabels && (
              <Text style={[styles.label, active && styles.activeLabel]}>
                {tab.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#EAEAEA",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },

  label: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
  },

  activeLabel: {
    color: "#000",
  },

  pressed: {
    opacity: 0.6,
  },
});
