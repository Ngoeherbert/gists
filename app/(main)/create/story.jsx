// app/(main)/create/story.jsx
// Story composer: capture or pick media, add optional text, publish.

import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import colors from "../../../constants/colors";
import config from "../../../constants/config";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useStoryStore from "../../../stores/storyStore";
import useAppStore from "../../../stores/appStore";
import { Header } from "../../../components/common";
import { Button, Input, Text } from "../../../components/ui";

export default function CreateStoryScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const publishStory = useStoryStore((s) => s.publishStory);
  const showToast = useAppStore((s) => s.showToast);

  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const pick = useCallback(
    async (fromCamera) => {
      try {
        const permission = fromCamera
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          showToast("Permission needed to add a story", "warning");
          return;
        }

        const result = fromCamera
          ? await ImagePicker.launchCameraAsync({ quality: 0.9 })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images", "videos"],
              quality: 0.9,
              videoMaxDuration: 60,
            });

        if (!result.canceled && result.assets?.length) setMedia(result.assets[0]);
      } catch {
        showToast("Couldn't open the camera roll", "error");
      }
    },
    [showToast]
  );

  const handlePublish = useCallback(async () => {
    if (!media) {
      showToast("Add a photo or video first", "warning");
      return;
    }
    setIsSaving(true);
    const story = await publishStory({
      payload: {
        mediaUri: media.uri,
        mediaType: media.type === "video" ? "video" : "image",
        caption: caption.trim(),
        createdAt: new Date().toISOString(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      },
    });
    setIsSaving(false);

    if (story) {
      showToast("Story published", "success");
      router.replace("/(main)/feeds");
    } else {
      showToast("Couldn't publish your story", "error");
    }
  }, [media, caption, publishStory, showToast, router]);

  return (
    <View style={styles.container}>
      <Header title="New story" showBack />

      <View style={styles.body}>
        <View style={styles.sourceRow}>
          <Pressable
            onPress={() => pick(true)}
            style={[
              styles.source,
              {
                backgroundColor: isDark ? colors.surface : theme.app.surface,
                borderColor: isDark ? colors.border : theme.colors.border,
              },
            ]}
          >
            <Ionicons name="camera-outline" size={layout.iconSize.xl} color={theme.colors.primary} />
            <Text variant="caption" color="secondary_text" style={styles.sourceLabel}>
              Camera
            </Text>
          </Pressable>

          <Pressable
            onPress={() => pick(false)}
            style={[
              styles.source,
              {
                backgroundColor: isDark ? colors.surface : theme.app.surface,
                borderColor: isDark ? colors.border : theme.colors.border,
              },
            ]}
          >
            <Ionicons name="images-outline" size={layout.iconSize.xl} color={colors.accent} />
            <Text variant="caption" color="secondary_text" style={styles.sourceLabel}>
              Gallery
            </Text>
          </Pressable>
        </View>

        {media ? (
          <View
            style={[
              styles.preview,
              { backgroundColor: isDark ? colors.surfaceLight : theme.app.surface },
            ]}
          >
            <Ionicons name="checkmark-circle" size={layout.iconSize.xl} color={theme.status.success} />
            <Text variant="bodySmall" color="secondary_text" style={styles.previewLabel}>
              {media.type === "video" ? "Video" : "Photo"} selected
            </Text>
            <Button
              title="Remove"
              variant="link"
              size="small"
              onPress={() => setMedia(null)}
            />
          </View>
        ) : null}

        <Input
          label="Add a caption"
          placeholder="Optional text on your story…"
          value={caption}
          onChangeText={setCaption}
          maxLength={config.limits.maxStoryTextLength}
          containerStyle={styles.field}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Share to story"
          size="large"
          fullWidth
          disabled={!media}
          loading={isSaving}
          onPress={handlePublish}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: spacing.screenHorizontal,
  },
  sourceRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  source: {
    flex: 1,
    height: 110,
    borderRadius: layout.borderRadius.lg,
    borderWidth: layout.borderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  sourceLabel: {
    marginTop: spacing.sm,
  },
  preview: {
    borderRadius: layout.borderRadius.md,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  previewLabel: {
    marginTop: spacing.sm,
  },
  field: {
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.screenHorizontal,
  },
});
