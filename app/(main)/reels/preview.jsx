// app/(main)/reels/preview.jsx
// Final review before publishing a reel: caption, audience and publish action.

import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import config from "../../../constants/config";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useReelStore from "../../../stores/reelStore";
import useAppStore from "../../../stores/appStore";
import useAuthStore from "../../../stores/authStore";
import { Header, Screen } from "../../../components/common";
import { Button, Chip, Input, Text } from "../../../components/ui";

const AUDIENCES = [
  { value: "public", label: "Everyone" },
  { value: "followers", label: "Followers" },
  { value: "private", label: "Only me" },
];

export default function ReelPreviewScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const draft = useReelStore((s) => s.draft);
  const publishReel = useReelStore((s) => s.publishReel);
  const showToast = useAppStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);

  const [caption, setCaption] = useState(draft?.caption ?? "");
  const [audience, setAudience] = useState("public");
  const [isSaving, setIsSaving] = useState(false);

  const publish = useCallback(async () => {
    setIsSaving(true);
    const reel = await publishReel({
      payload: {
        ...(draft || {}),
        caption: caption.trim(),
        audience,
        author: {
          id: user?.id,
          name: user?.name,
          username: user?.username,
          avatarUrl: user?.avatarUrl,
        },
        createdAt: new Date().toISOString(),
      },
    });
    setIsSaving(false);

    if (reel) {
      showToast("Reel published", "success");
      router.replace("/(main)/reels");
    } else {
      showToast("Couldn't publish your reel", "error");
    }
  }, [draft, caption, audience, publishReel, user, showToast, router]);

  return (
    <View style={styles.container}>
      <Header title="Preview" showBack />

      <Screen scroll padded={false}>
        <View style={styles.body}>
          <View
            style={[
              styles.preview,
              { backgroundColor: isDark ? colors.surface : theme.app.surface },
            ]}
          >
            <Ionicons name="play-circle-outline" size={64} color={theme.text.muted} />
          </View>

          <Input
            label="Caption"
            placeholder="Add a caption…"
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={3}
            maxLength={config.limits.maxReelCaptionLength}
            helperText={`${caption.length}/${config.limits.maxReelCaptionLength}`}
            containerStyle={styles.field}
          />

          <Text variant="bodySmall" color="secondary_text" style={styles.audienceLabel}>
            Who can see this?
          </Text>
          <View style={styles.audienceRow}>
            {AUDIENCES.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={audience === option.value}
                onPress={() => setAudience(option.value)}
                style={styles.chip}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Publish"
            size="large"
            fullWidth
            loading={isSaving}
            onPress={publish}
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
  preview: {
    width: "100%",
    aspectRatio: layout.reel.aspectRatio,
    maxHeight: 360,
    borderRadius: layout.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  audienceLabel: {
    marginBottom: spacing.sm,
  },
  audienceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  footer: {
    padding: spacing.screenHorizontal,
  },
});
