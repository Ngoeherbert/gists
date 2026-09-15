// app/(main)/profile/share.jsx
// Shareable profile card: a QR placeholder plus copy-link and native share.

import React from "react";
import { Share, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useProfileStore from "../../../stores/profileStore";
import useAuthStore from "../../../stores/authStore";
import useAppStore from "../../../stores/appStore";
import { Header, Screen } from "../../../components/common";
import { Avatar, Button, Card, Text } from "../../../components/ui";

export default function ShareProfileScreen() {
  const { theme, isDark } = useAppTheme();
  const me = useProfileStore((s) => s.me);
  const user = useAuthStore((s) => s.user);
  const sharePayload = useProfileStore((s) => s.sharePayload);
  const showToast = useAppStore((s) => s.showToast);

  const profile = me || user;
  const payload = sharePayload() || {};

  const nativeShare = async () => {
    try {
      await Share.share({
        title: payload.title,
        message: `${payload.message}\n${payload.url}`,
        url: payload.url,
      });
    } catch {
      showToast("Couldn't open the share sheet", "error");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Share profile" showBack />

      <Screen scroll padded={false}>
        <View style={styles.body}>
          <Card padding="large" style={styles.card}>
            <Avatar
              uri={profile?.avatarUrl}
              name={profile?.name || profile?.username}
              size="xl"
            />
            <Text variant="title" style={styles.name}>
              {profile?.name || profile?.username || "You"}
            </Text>
            {profile?.username ? (
              <Text variant="bodySmall" color="secondary_text">
                @{profile.username}
              </Text>
            ) : null}

            {/* QR placeholder — a real one needs a QR library. */}
            <View
              style={[
                styles.qr,
                {
                  backgroundColor: isDark ? colors.surfaceLight : theme.app.surface,
                  borderColor: isDark ? colors.border : theme.colors.border,
                },
              ]}
            >
              <Ionicons name="qr-code-outline" size={96} color={theme.text.muted} />
            </View>

            <Text variant="caption" color="tertiary" align="center">
              Scan to open this profile
            </Text>
          </Card>

          <Card padding="none" style={styles.linkCard}>
            <Text variant="bodySmall" color="secondary_text" style={styles.linkLabel}>
              Profile link
            </Text>
            <Text variant="bodyMedium">{payload.url || "gists://profile/you"}</Text>
          </Card>

          <Button
            title="Share link"
            icon="share-outline"
            size="large"
            fullWidth
            onPress={nativeShare}
          />
          <Button
            title="Copy link"
            icon="link-outline"
            variant="outline"
            size="large"
            fullWidth
            style={styles.copy}
            onPress={() => showToast("Link copied", "success")}
          />
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: spacing.screenHorizontal,
  },
  card: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  name: {
    marginTop: spacing.md,
  },
  qr: {
    width: 200,
    height: 200,
    borderRadius: layout.borderRadius.lg,
    borderWidth: layout.borderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.xl,
  },
  linkCard: {
    padding: spacing.cardPadding,
    marginBottom: spacing.lg,
  },
  linkLabel: {
    marginBottom: spacing.xxs,
  },
  copy: {
    marginTop: spacing.sm,
  },
});
