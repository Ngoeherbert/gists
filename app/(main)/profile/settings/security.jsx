// app/(main)/profile/settings/security.jsx
// Security: biometrics, two-factor, login alerts and saved login info.

import React from "react";
import config from "../../../../constants/config";
import useAppStore from "../../../../stores/appStore";
import SettingsScreen from "../../../../components/profile/SettingsScreen";

export default function SecuritySettingsScreen() {
  const showToast = useAppStore((s) => s.showToast);

  return (
    <SettingsScreen
      title="Security"
      sections={[
        {
          rows: [
            {
              key: "2fa",
              icon: "shield-checkmark-outline",
              label: "Two-factor authentication",
              description: "Add an extra layer of protection",
              value: "Off",
              onPress: () => showToast("2FA setup coming soon", "info"),
            },
            {
              key: "biometrics",
              icon: "finger-print-outline",
              label: "Biometric unlock",
              description: "Use Face ID / fingerprint to open the app",
              switch: true,
              defaultValue: Boolean(config.features.biometrics),
            },
            {
              key: "alerts",
              icon: "notifications-outline",
              label: "Login alerts",
              description: "Notify me about new sign-ins",
              switch: true,
              defaultValue: true,
            },
          ],
        },
        {
          rows: [
            {
              key: "password",
              icon: "key-outline",
              label: "Change password",
              onPress: () => showToast("Use Account → Change password", "info"),
            },
            {
              key: "sessions",
              icon: "desktop-outline",
              label: "Where you're logged in",
              onPress: () => showToast("Session list coming soon", "info"),
            },
          ],
        },
      ]}
    />
  );
}
