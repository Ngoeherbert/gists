// app/(main)/_layout.jsx
// Authenticated app shell: a bottom tab bar over the five primary sections
// declared in config.navigation.tabs (feeds, reels, create, chats, profile).
//
// The custom TabBar is absolutely positioned so scrollable content renders
// *underneath* it (no reserved bottom space, no safe-area padding). Each tab
// declares its own icon provider via `tabBarIconProvider`, so the same icon
// name can render through Ionicons, Feather, MaterialCommunityIcons, etc.

import React from "react";
import { Tabs } from "expo-router";
import colors from "../../constants/colors";
import config from "../../constants/config";
import TabBar from "../../components/navigation/TabBar";

const { tabs } = config.navigation;

export default function MainLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="feeds"
        options={{
          tabBarIcon: () => "home",
          tabBarIconProvider: "feather",
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          tabBarIcon: () => "youtube",
          tabBarIconProvider: "feather",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: () => "plus",
          tabBarIconProvider: "feather",
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarIcon: () => "chatbox-outline",
          tabBarIconProvider: "Ionicons",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => "person-outline",
          tabBarIconProvider: "MaterialIcons",
        }}
      />
      <Tabs.Screen name="stories" options={{ href: null }} />
    </Tabs>
  );
}