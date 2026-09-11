import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTabBar from "../../components/navigation/BottomTabBar";

// Bottom navigation is rendered ONLY on these exact
// tab root routes:
//   feeds
//   reels
//   chats
//   profile
//
// Every nested/child route gets NO bottom navigation.
const BOTTOM_NAV_ROUTES = new Set(["feeds", "reels", "chats", "profile"]);

export default function MainLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        const { state, navigation } = props;

        // Get the active tab route.
        const activeTabRoute = state.routes[state.index];
        const activeTabName = activeTabRoute?.name || "";
        const activeTabFirstSegment = activeTabName.split("/")[0];

        // If the active tab is not in the bottom nav set, hide the bottom nav.
        if (!BOTTOM_NAV_ROUTES.has(activeTabFirstSegment)) {
          return null;
        }

        // Dig into the tab's nested stack state to find the actual screen.
        const nestedState = activeTabRoute?.state;
        const nestedRoutes = nestedState?.routes || [];
        const nestedIndex = nestedState?.index ?? 0;
        const activeNestedRoute = nestedRoutes[nestedIndex];

        // Determine the actual screen name.
        // If there's a nested state, use the nested route name.
        // Otherwise, use the tab route name directly.
        const actualRouteName =
          nestedRoutes.length > 0
            ? activeNestedRoute?.name || ""
            : activeTabName;

        // Only show bottom nav on exact tab root routes.
        // Root screens are: tab name, tab/index, or index alone.
        const isRootScreen =
          actualRouteName === activeTabFirstSegment ||
          actualRouteName === `${activeTabFirstSegment}/index` ||
          actualRouteName === "index";

        if (!isRootScreen) {
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
            activeTab={activeTabFirstSegment}
            onTabPress={handleTabPress}
            style={{
              position: "absolute",
              bottom: insets.bottom,
              left: 0,
              right: 0,
            }}
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
