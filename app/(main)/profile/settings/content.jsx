// app/(main)/profile/settings/content.jsx
// Content preferences: feed language, interest topics, autoplay behaviour.

import React from "react";
import { useRouter } from "expo-router";
import useAppStore from "../../../../stores/appStore";
import SettingsScreen from "../../../../components/profile/SettingsScreen";

export default function ContentSettingsScreen() {
  const router = useRouter();
  const interests = useAppStore((s) => s.interests);

  return (
    <SettingsScreen
      title="Content preferences"
      sections={[
        {
          rows: [
            {
              key: "interests",
              icon: "heart-outline",
              label: "Interests",
              description: "Pick topics to personalise your feed",
              value: interests.length ? `${interests.length} selected` : "None",
              onPress: () => router.navigate("/(auth)/interests"),
            },
            {
              key: "language",
              icon: "language-outline",
              label: "App language",
              value: "English",
              onPress: () => {},
            },
            {
              key: "region",
              icon: "globe-outline",
              label: "Content region",
              value: "Worldwide",
              onPress: () => {},
            },
          ],
        },
        {
          rows: [
            {
              key: "autoplay",
              icon: "play-circle-outline",
              label: "Autoplay videos",
              description: "Play reels as you scroll",
              switch: true,
              defaultValue: true,
            },
            {
              key: "dataSaver",
              icon: "cellular-outline",
              label: "Data saver",
              description: "Load lower resolution media on mobile data",
              switch: true,
              defaultValue: false,
            },
          ],
        },
      ]}
    />
  );
}
