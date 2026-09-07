import React from "react";
import { Tabs } from "expo-router";
import BottomTabBar from "../../components/navigation/BottomTabBar";

function isStoryRoute(route) {
  if (!route) {
    return false;
  }

  if (route.name?.includes("story")) {
    return true;
  }

  if (route.state?.routes) {
    return route.state.routes.some((nestedRoute) => isStoryRoute(nestedRoute));
  }

  return false;
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        const { state, navigation } = props;

        const activeRoute = state.routes[state.index];

        // Hide BottomTabBar anywhere inside the Story flow.
        if (isStoryRoute(activeRoute)) {
          return null;
        }

        const activeTab = activeRoute?.name?.split("/")[0] || "feeds";

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
