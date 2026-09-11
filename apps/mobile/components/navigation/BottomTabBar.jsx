import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";

const ICON_LIBRARIES = {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Entypo,
  AntDesign,
};

const DEFAULT_TABS = [
  {
    key: "feeds",
    label: "Feeds",
    icon: "home",
    activeIcon: "home",
    iconLibrary: "Feather",
  },
  {
    key: "reels",
    label: "Reel",
    icon: "youtube",
    activeIcon: "youtube",
    iconLibrary: "Feather",
  },
  {
    key: "create",
    label: "Create",
    icon: "add",
    activeIcon: "add",
    iconLibrary: "Ionicons",
    isCreate: true,
  },
  {
    key: "chats",
    label: "Chats",
    icon: "chatbubble-outline",
    activeIcon: "chatbubble-outline",
    iconLibrary: "Ionicons",
  },
  {
    key: "profile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person-outline",
    iconLibrary: "Ionicons",
  },
];

function TabIcon({ tab, active }) {
  const libraryName = active
    ? tab.activeIconLibrary || tab.iconLibrary || "Ionicons"
    : tab.iconLibrary || "Ionicons";

  const IconComponent = ICON_LIBRARIES[libraryName] || Ionicons;

  const iconName = active ? tab.activeIcon || tab.icon : tab.icon;

  const iconSize = active
    ? tab.activeIconSize || tab.iconSize || (tab.isCreate ? 28 : 23)
    : tab.iconSize || (tab.isCreate ? 28 : 23);

  const iconColor = active
    ? tab.activeIconColor || tab.iconColor || (tab.isCreate ? "#fff" : "#000")
    : tab.iconColor || (tab.isCreate ? "#fff" : "#888");

  return <IconComponent name={iconName} size={iconSize} color={iconColor} />;
}

export default function BottomTabBar({
  activeTab = "feeds",
  onTabPress,
  tabs = DEFAULT_TABS,
  unreadCount = 0,
  style,
}) {
  const handleTabPress = (tab) => {
    if (typeof onTabPress === "function") {
      onTabPress(tab.key);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              onPress={() => handleTabPress(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              hitSlop={6}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  tab.isCreate && styles.createButton,
                  active && !tab.isCreate && styles.activeIconWrapper,
                ]}
              >
                <TabIcon tab={tab} active={active} />

                {tab.key === "chats" && unreadCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                ) : null}
              </View>

              {!tab.isCreate ? (
                <View style={styles.labelContainer}>
                  <Text
                    numberOfLines={1}
                    style={[styles.label, active && styles.activeLabel]}
                  >
                    {tab.label}
                  </Text>

                  {active ? <View style={styles.activeIndicator} /> : null}
                </View>
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
    backgroundColor: "#ffffff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#eeeeee80",
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

  activeIconWrapper: {
    transform: [{ scale: 1.03 }],
  },

  createButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#000",
  },

  labelContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 19,
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

  activeIndicator: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#000",
    marginTop: 3,
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
