// app/(main)/profile/settings/notifications.jsx
// Notification preferences, backed by notificationStore.preferences so the
// choices survive navigation.

import React from "react";
import useNotificationStore from "../../../../stores/notificationStore";
import SettingsScreen from "../../../../components/profile/SettingsScreen";

const TOGGLES = [
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comments" },
  { key: "follows", label: "New followers" },
  { key: "mentions", label: "Mentions" },
  { key: "messages", label: "Messages" },
  { key: "reposts", label: "Reposts" },
  { key: "stories", label: "Stories" },
  { key: "reels", label: "Reels" },
];

const DEVICE_TOGGLES = [
  { key: "sound", label: "Sound" },
  { key: "vibration", label: "Vibration" },
];

export default function NotificationSettingsScreen() {
  const preferences = useNotificationStore((s) => s.preferences);
  const setPreference = useNotificationStore((s) => s.setPreference);

  return (
    <SettingsScreen
      title="Notifications"
      sections={[
        {
          rows: [
            {
              key: "push",
              icon: "notifications-outline",
              label: "Push notifications",
              description: "Master switch for all push alerts",
              switch: true,
              defaultValue: preferences.push,
              onChange: (v) => setPreference("push", v),
            },
          ],
        },
        {
          rows: TOGGLES.map((item) => ({
            key: item.key,
            label: item.label,
            switch: true,
            defaultValue: preferences[item.key],
            onChange: (v) => setPreference(item.key, v),
          })),
        },
        {
          rows: DEVICE_TOGGLES.map((item) => ({
            key: item.key,
            label: item.label,
            switch: true,
            defaultValue: preferences[item.key],
            onChange: (v) => setPreference(item.key, v),
          })),
        },
        {
          rows: [
            {
              key: "email",
              label: "Email notifications",
              description: "Occasional digests and security alerts",
              switch: true,
              defaultValue: preferences.email,
              onChange: (v) => setPreference("email", v),
            },
          ],
        },
      ]}
    />
  );
}
