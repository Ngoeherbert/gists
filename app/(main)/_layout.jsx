// app/(main)/_layout.jsx
// Authenticated app shell: a bottom tab bar over the five primary sections
// declared in config.navigation.tabs (feeds, reels, create, chats, profile).

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
        options={{ title: tabs.feeds, tabBarIcon: () => "home-outline" }}
      />
      <Tabs.Screen
        name="reels"
        options={{ title: tabs.reels, tabBarIcon: () => "play-circle-outline" }}
      />
      <Tabs.Screen
        name="create"
        options={{ title: tabs.create, tabBarIcon: () => "add" }}
      />
      <Tabs.Screen
        name="chats"
        options={{ title: tabs.chats, tabBarIcon: () => "chatbubbles-outline" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: tabs.profile, tabBarIcon: () => "person-circle-outline" }}
      />
      <Tabs.Screen name="stories" options={{ href: null }} />
    </Tabs>
  );
}
