// app/(main)/profile/settings/index.jsx
// Settings hub: grouped entries into every settings sub-page, plus sign out.

import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../../../constants/colors";
import spacing from "../../../../constants/spacing";
import useAuthStore from "../../../../stores/authStore";
import useAppStore from "../../../../stores/appStore";
import { Header, Screen } from "../../../../components/common";
import { Card, Divider } from "../../../../components/ui";
import SettingsRow from "../../../../components/profile/SettingsRow";

const GROUPS = [
  [
    { icon: "person-outline", label: "Account", route: "account" },
    { icon: "lock-closed-outline", label: "Privacy", route: "privacy" },
    { icon: "shield-checkmark-outline", label: "Security", route: "security" },
  ],
  [
    { icon: "notifications-outline", label: "Notifications", route: "notifications" },
    { icon: "chatbubble-outline", label: "Chats", route: "chat" },
    { icon: "eye-off-outline", label: "Content preferences", route: "content" },
  ],
  [
    { icon: "ban-outline", label: "Blocked accounts", route: "blocked" },
    { icon: "help-circle-outline", label: "Help & support", route: "support" },
    { icon: "information-circle-outline", label: "About", route: "about" },
  ],
];

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const showToast = useAppStore((s) => s.showToast);

  return (
    <Screen scroll padded={false} header={<Header title="Settings" showBack />}>
      <View style={styles.body}>
        {GROUPS.map((group, groupIndex) => (
          <Card key={groupIndex} padding="none" style={styles.group}>
            {group.map((item, index) => (
              <React.Fragment key={item.route}>
                {index > 0 ? <Divider inset={spacing.cardPadding} /> : null}
                <SettingsRow
                  icon={item.icon}
                  label={item.label}
                  onPress={() => router.navigate(`/(main)/profile/settings/${item.route}`)}
                />
              </React.Fragment>
            ))}
          </Card>
        ))}

        <Card padding="none" style={styles.group}>
          <SettingsRow
            icon="log-outline"
            iconColor={colors.error}
            label="Sign out"
            tone="error"
            showChevron={false}
            onPress={async () => {
              await logout();
              showToast("Signed out", "info");
              router.replace("/(auth)/welcome");
            }}
          />
        </Card>

        <View style={styles.spacer} />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  body: {
    padding: spacing.screenHorizontal,
  },
  group: {
    marginBottom: spacing.lg,
  },
  spacer: {
    height: spacing.xxl,
  },
});
