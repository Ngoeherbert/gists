// app/(main)/stories/settings.jsx
// Story settings: who can reply / react, hide from list, and archive options.

import React from "react";
import useAppStore from "../../../stores/appStore";
import SettingsScreen from "../../../components/profile/SettingsScreen";

export default function StorySettingsScreen() {
  const showToast = useAppStore((s) => s.showToast);

  return (
    <SettingsScreen
      title="Story settings"
      sections={[
        {
          rows: [
            {
              key: "replies",
              icon: "chatbubble-outline",
              label: "Allow replies",
              description: "Let people reply to your stories",
              switch: true,
              defaultValue: true,
            },
            {
              key: "reactions",
              icon: "heart-outline",
              label: "Allow reactions",
              description: "Let people react with emoji",
              switch: true,
              defaultValue: true,
            },
            {
              key: "sharing",
              icon: "share-outline",
              label: "Allow sharing",
              description: "Let people share your story",
              switch: true,
              defaultValue: false,
            },
          ],
        },
        {
          rows: [
            {
              key: "hide",
              icon: "eye-off-outline",
              label: "Hide story from…",
              onPress: () => showToast("Audience picker coming soon", "info"),
            },
            {
              key: "archive",
              icon: "archive-outline",
              label: "Archive stories",
              description: "Keep a copy after 24 hours",
              switch: true,
              defaultValue: true,
            },
          ],
        },
        {
          rows: [
            {
              key: "delete",
              icon: "trash-outline",
              label: "Delete current story",
              tone: "error",
              showChevron: false,
              onPress: () => showToast("Story deleted", "success"),
            },
          ],
        },
      ]}
    />
  );
}
