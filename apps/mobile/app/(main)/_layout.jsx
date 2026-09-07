import { Tabs } from "expo-router";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
          title: "+",
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
