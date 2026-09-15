// app/(main)/profile/settings/chat.jsx
// Chat preferences: read receipts, typing indicators, media auto-download.

import React from "react";
import SettingsScreen from "../../../../components/profile/SettingsScreen";

export default function ChatSettingsScreen() {
  return (
    <SettingsScreen
      title="Chats"
      sections={[
        {
          rows: [
            {
              key: "receipts",
              icon: "checkmark-done-outline",
              label: "Read receipts",
              description: "Let people know when you've read their messages",
              switch: true,
              defaultValue: true,
            },
            {
              key: "typing",
              icon: "create-outline",
              label: "Typing indicator",
              description: "Show when you're typing",
              switch: true,
              defaultValue: true,
            },
            {
              key: "previews",
              icon: "eye-outline",
              label: "Message previews",
              description: "Show message text in notifications",
              switch: true,
              defaultValue: true,
            },
          ],
        },
        {
          rows: [
            {
              key: "autodownload",
              icon: "cloud-download-outline",
              label: "Auto-download media",
              value: "Wi-Fi only",
              onPress: () => {},
            },
            {
              key: "wallpaper",
              icon: "color-palette-outline",
              label: "Chat wallpaper",
              onPress: () => {},
            },
          ],
        },
      ]}
    />
  );
}
