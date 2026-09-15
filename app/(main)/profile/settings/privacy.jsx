// app/(main)/profile/settings/privacy.jsx
// Privacy controls: account visibility, activity status, tagging and DMs.

import React from "react";
import useAppStore from "../../../../stores/appStore";
import SettingsScreen from "../../../../components/profile/SettingsScreen";

export default function PrivacySettingsScreen() {
  const showToast = useAppStore((s) => s.showToast);

  return (
    <SettingsScreen
      title="Privacy"
      sections={[
        {
          rows: [
            {
              key: "private",
              icon: "lock-closed-outline",
              label: "Private account",
              description: "Approve followers before they can see your posts",
              switch: true,
              onChange: () => showToast("Privacy preference updated", "success"),
            },
            {
              key: "activity",
              icon: "radio-outline",
              label: "Show activity status",
              description: "Let others see when you're online",
              switch: true,
              defaultValue: true,
            },
            {
              key: "story",
              icon: "aperture-outline",
              label: "Hide story from some people",
              onPress: () => showToast("Story audience controls coming soon", "info"),
            },
          ],
        },
        {
          rows: [
            {
              key: "mentions",
              icon: "at-outline",
              label: "Who can mention you",
              value: "Everyone",
              onPress: () => showToast("Mentions controls coming soon", "info"),
            },
            {
              key: "messages",
              icon: "chatbubble-outline",
              label: "Who can message you",
              value: "People you follow",
              onPress: () => showToast("Message controls coming soon", "info"),
            },
            {
              key: "tagging",
              icon: "pricetag-outline",
              label: "Who can tag you",
              value: "Everyone",
              onPress: () => showToast("Tagging controls coming soon", "info"),
            },
          ],
        },
      ]}
    />
  );
}
