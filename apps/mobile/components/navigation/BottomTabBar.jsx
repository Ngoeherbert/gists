import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DEFAULT_TABS = [
  {
    key: "feeds",
    label: "Feeds",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    key: "reels",
    label: "Reel",
    icon: "play-circle-outline",
    activeIcon: "play-circle",
  },
  {
    key: "create",
    label: "Create",
    icon: "add",
    activeIcon: "add",
    isCreate: true,
  },
  {
    key: "chats",
    label: "Chats",
    icon: "chatbubble-outline",
    activeIcon: "chatbubble",
  },
  {
    key: "profile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

export default function BottomTabBar({
  activeTab = "feeds",
  onTabPress,
  tabs = DEFAULT_TABS,
  unreadCount = 0,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress?.(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  tab.isCreate && styles.createButton,
                ]}
              >
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={tab.isCreate ? 28 : 23}
                  color={tab.isCreate ? "#fff" : active ? "#000" : "#888"}
                />

                {tab.key === "chats" && unreadCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                ) : null}
              </View>

              {!tab.isCreate ? (
                <Text style={[styles.label, active && styles.activeLabel]}>
                  {tab.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },

  bar: {
    height: 68,
    backgroundColor: "#fff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 5,
  },

  tab: {
    flex: 1,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },

  iconWrapper: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  createButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#000",
  },

  label: {
    color: "#888",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  activeLabel: {
    color: "#000",
    fontWeight: "800",
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  badgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.65,
  },
});
