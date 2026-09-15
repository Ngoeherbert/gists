// app/(main)/profile/settings/account.jsx
// Account settings: email, phone, username, password and deactivation.

import React from "react";
import { useRouter } from "expo-router";
import useAuthStore from "../../../../stores/authStore";
import useAppStore from "../../../../stores/appStore";
import SettingsScreen from "../../../../components/profile/SettingsScreen";

export default function AccountSettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const showToast = useAppStore((s) => s.showToast);

  return (
    <SettingsScreen
      title="Account"
      sections={[
        {
          rows: [
            {
              key: "email",
              icon: "mail-outline",
              label: "Email",
              value: user?.email || "Add email",
              onPress: () => router.push("/(auth)/email"),
            },
            {
              key: "phone",
              icon: "call-outline",
              label: "Phone",
              value: user?.phone || "Add number",
              onPress: () => router.push("/(auth)/phone"),
            },
            {
              key: "username",
              icon: "at-outline",
              label: "Username",
              value: user?.username ? `@${user.username}` : "Not set",
              onPress: () => router.push("/(main)/profile/edit"),
            },
          ],
        },
        {
          rows: [
            {
              key: "password",
              icon: "key-outline",
              label: "Change password",
              onPress: () => router.push("/(auth)/new-password"),
            },
            {
              key: "devices",
              icon: "phone-portrait-outline",
              label: "Active sessions",
              description: "Devices currently signed in",
              onPress: () => showToast("Session management coming soon", "info"),
            },
          ],
        },
        {
          rows: [
            {
              key: "deactivate",
              icon: "trash-outline",
              label: "Deactivate account",
              description: "Temporarily hide your profile",
              tone: "error",
              showChevron: false,
              onPress: () => showToast("Account deactivation coming soon", "warning"),
            },
          ],
        },
      ]}
    />
  );
}
