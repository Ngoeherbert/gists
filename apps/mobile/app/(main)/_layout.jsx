import React from "react";
import { Tabs } from "expo-router";
import BottomTabBar from "../../components/navigation/BottomTabBar";

// Bottom navigation is rendered ONLY on these exact
// tab root routes:
//   feeds
//   reels
//   chats
//   profile
//
// Every nested/child route gets NO bottom navigation.
const BOTTOM_NAV_ROUTES = new Set([
  "feeds",
  "reels",
  "chats",
  "profile",
]);

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        const { state, navigation } = props;

        const activeRoute = state.routes[state.index];

        const routeName = activeRoute?.name || "";
        const firstSegment = routeName.split("/")[0];
        const activeTab = firstSegment;

        // Only show bottom nav on exact tab root routes.
        // Tab roots with a layout (feeds, profile) appear as just the tab name.
        // Tab roots without a layout (reels/index, chats/index) include "/index".
        // Every other nested route gets NO bottom navigation.
        const isRootTabRoute = BOTTOM_NAV_ROUTES.has(firstSegment);
        const isRootIndexScreen = routeName === `${firstSegment}/index`;
        const shouldShowBottomNav =
          isRootTabRoute &&
          (routeName === firstSegment || isRootIndexScreen);

        if (!shouldShowBottomNav) {
          return null;
        }

        const handleTabPress = (tabKey) => {
          const route = state.routes.find((item) => {
            const routeName = item.name?.split("/")[0];

            return routeName === tabKey;
          });

          if (!route) {
            console.warn(`Tab route not found: ${tabKey}`);
            return;
          }

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (event.defaultPrevented) {
            return;
          }

          navigation.navigate(route.name);
        };

        return (
          <BottomTabBar
            {...props}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        );
      }}
    >
      <Tabs.Screen
        name="feeds"
        options={{
          title: "Feeds",
        }}
      />

      <Tabs.Screen
        name="reels"
        options={{
          title: "Reel",
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
