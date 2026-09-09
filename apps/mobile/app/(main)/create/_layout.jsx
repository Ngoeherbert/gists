import { Stack } from "expo-router";

export default function CreateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="post" />
      <Stack.Screen name="reel" />
      <Stack.Screen name="story" />
    </Stack>
  );
}
