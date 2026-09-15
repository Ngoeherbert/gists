// app/(main)/profile/settings/support.jsx
// Help & support: FAQ entry, report a problem and contact links.

import React from "react";
import { Linking } from "react-native";
import useAppStore from "../../../../stores/appStore";
import SettingsScreen from "../../../../components/profile/SettingsScreen";

export default function SupportSettingsScreen() {
  const showToast = useAppStore((s) => s.showToast);

  const openLegalDocument = (url, openingMessage, failureMessage) => async () => {
    try {
      await Linking.openURL(url);
      showToast(openingMessage, "info");
    } catch {
      showToast(failureMessage, "error");
    }
  };

  return (
    <SettingsScreen
      title="Help & support"
      sections={[
        {
          rows: [
            {
              key: "help",
              icon: "help-circle-outline",
              label: "Help centre",
              onPress: () => showToast("Help centre coming soon", "info"),
            },
            {
              key: "report",
              icon: "flag-outline",
              label: "Report a problem",
              onPress: () => showToast("Thanks — we'll look into it", "success"),
            },
            {
              key: "safety",
              icon: "shield-outline",
              label: "Safety centre",
              onPress: () => showToast("Safety centre coming soon", "info"),
            },
          ],
        },
        {
          rows: [
            {
              key: "terms",
              icon: "document-text-outline",
              label: "Terms of service",
              onPress: openLegalDocument(
                "https://gists.app/terms",
                "Opening terms…",
                "Couldn't open the Terms of service"
              ),
            },
            {
              key: "privacy",
              icon: "lock-closed-outline",
              label: "Privacy policy",
              onPress: openLegalDocument(
                "https://gists.app/privacy",
                "Opening privacy policy…",
                "Couldn't open the Privacy policy"
              ),
            },
          ],
        },
      ]}
    />
  );
}
