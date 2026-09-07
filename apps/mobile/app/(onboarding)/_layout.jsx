import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="screen-1" />
      <Stack.Screen name="screen-2" />
      <Stack.Screen name="screen-3" />
      <Stack.Screen name="get-started" />
    </Stack>
  );
}
