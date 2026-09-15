// app/(main)/create/reel.jsx
// Reel composer: pick a video, add a caption, publish via reelStore.publishReel.

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
import useReelStore from "../../../stores/reelStore";
import useAppStore from "../../../stores/appStore";
import useAuthStore from "../../../stores/authStore";
import { Header, Screen } from "../../../components/common";
import { Button, Input, Text } from "../../../components/ui";

export default function CreateReelScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const publishReel = useReelStore((s) => s.publishReel);
  const showToast = useAppStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);

  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectVideo = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast("Allow video access to upload a reel", "warning");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: true,
        quality: 0.9,
        videoMaxDuration: 90,
      });
      if (!result.canceled && result.assets?.length) setVideo(result.assets[0]);
    } catch {
      showToast("Couldn't open your videos", "error");
    }
  }, [showToast]);

  const handlePublish = useCallback(async () => {
    if (!video) {
      showToast("Pick a video first", "warning");
      return;
    }
    setIsSaving(true);
    const reel = await publishReel({
      payload: {
        videoUri: video.uri,
        caption: caption.trim(),
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
  }, [video, caption, publishReel, user, showToast, router]);

  return (
    <Screen padded={false} header={<Header title="New reel" showBack />}>

      <View style={styles.body}>
        <Pressable
          onPress={selectVideo}
          style={[
            styles.dropzone,
            {
              backgroundColor: isDark ? colors.surface : theme.app.surface,
              borderColor: isDark ? colors.border : theme.colors.border,
            },
          ]}
        >
          <Ionicons
            name={video ? "checkmark-circle" : "cloud-upload-outline"}
            size={layout.iconSize.xxl}
            color={video ? theme.status.success : theme.text.tertiary}
          />
          <Text variant="bodyMedium" style={styles.dropTitle}>
            {video ? "Video selected" : "Select a video"}
          </Text>
          <Text variant="bodySmall" color="secondary_text" align="center">
            {video ? (video.fileName ?? "Tap to choose a different clip") : "Up to 90 seconds, MP4 or MOV"}
          </Text>
        </Pressable>

        <Input
          label="Caption"
          placeholder="Say something about your reel…"
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={3}
          maxLength={config.limits.maxReelCaptionLength}
          helperText={`${caption.length}/${config.limits.maxReelCaptionLength}`}
          containerStyle={styles.field}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Publish reel"
          size="large"
          fullWidth
          disabled={!video}
          loading={isSaving}
          onPress={handlePublish}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: spacing.screenHorizontal,
  },
  dropzone: {
    height: 200,
    borderRadius: layout.borderRadius.lg,
    borderWidth: layout.borderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  dropTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  field: {
    marginTop: spacing.xl,
  },
  footer: {
    padding: spacing.screenHorizontal,
  },
});
