// app/profile/share.jsx
// Shareable profile card: copy-link and native share.

import React from "react";
import { Share, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import spacing from "../../constants/spacing";
import useProfileStore from "../../stores/profileStore";
import useAuthStore from "../../stores/authStore";
import useAppStore from "../../stores/appStore";
import { Header, Screen } from "../../components/common";
import { Avatar, Button, Card, Text } from "../../components/ui";

export default function ShareProfileScreen() {
  const { id } = useLocalSearchParams();
  const me = useProfileStore((s) => s.me);
  const profiles = useProfileStore((s) => s.profiles);
  const user = useAuthStore((s) => s.user);
  const sharePayload = useProfileStore((s) => s.sharePayload);
  const showToast = useAppStore((s) => s.showToast);

  // Share the profile being displayed; fall back to the signed-in user.
  const profile = (id && profiles[id]) || me || user;
  const payload = sharePayload() || {};
  const url = payload.url || `gists://profile/${profile?.username || profile?.id || "you"}`;

  const nativeShare = async () => {
    try {
      await Share.share({
        title: payload.title,
        message: `${payload.message}\n${url}`,
        url,
      });
    } catch {
      showToast("Couldn't open the share sheet", "error");
    }
  };

  const copyLink = async () => {
    try {
      await Clipboard.setStringAsync(url);
      showToast("Link copied", "success");
    } catch {
      showToast("Couldn't copy the link", "error");
    }
  };

  return (
    <Screen header={<Header title="Share profile" showBack />} scroll padded={false}>
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
          </Card>

          <Card padding="none" style={styles.linkCard}>
            <Text variant="bodySmall" color="secondary_text" style={styles.linkLabel}>
              Profile link
            </Text>
            <Text variant="bodyMedium">{url}</Text>
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
            onPress={copyLink}
          />
        </View>
      </Screen>
  );
}

const styles = StyleSheet.create({
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
