// app/(main)/profile/settings/chat.jsx
// Chat preferences: read receipts, typing indicators, media auto-download.

import React from "react";
import useNotificationStore from "../../../../stores/notificationStore";
import SettingsScreen from "../../../../components/profile/SettingsScreen";

export default function ChatSettingsScreen() {
  const preferences = useNotificationStore((s) => s.preferences);
  const setPreference = useNotificationStore((s) => s.setPreference);

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
              defaultValue: preferences.receipts,
              onChange: (v) => setPreference("receipts", v),
            },
            {
              key: "typing",
              icon: "create-outline",
              label: "Typing indicator",
              description: "Show when you're typing",
              switch: true,
              defaultValue: preferences.typing,
              onChange: (v) => setPreference("typing", v),
            },
            {
              key: "previews",
              icon: "eye-outline",
              label: "Message previews",
              description: "Show message text in notifications",
              switch: true,
              defaultValue: preferences.previews,
              onChange: (v) => setPreference("previews", v),
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
              // No flow exists yet — rendered as information, not a button.
              showChevron: false,
            },
            {
              key: "wallpaper",
              icon: "color-palette-outline",
              label: "Chat wallpaper",
              // No flow exists yet — rendered as non-actionable.
              showChevron: false,
            },
          ],
        },
      ]}
    />
  );
}
