// app/(main)/stories/create.jsx
// Story creation flow (reachable outside the create tab). Delegates to the
// story composer behaviour already used by /(main)/create/story.

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
import { Header, Screen } from "../../../components/common";
import { Button, Input, Text } from "../../../components/ui";

export default function CreateStoryScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const publishStory = useStoryStore((s) => s.publishStory);
  const showToast = useAppStore((s) => s.showToast);

  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const pick = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast("Allow photo access to add a story", "warning");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.9,
      videoMaxDuration: 60,
    });
    if (!result.canceled && result.assets?.length) setMedia(result.assets[0]);
  }, [showToast]);

  const publish = useCallback(async () => {
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
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
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
    <Screen padded={false} header={<Header title="New story" showBack />}>

      <View style={styles.body}>
        <Pressable
          onPress={pick}
          style={[
            styles.dropzone,
            {
              backgroundColor: isDark ? colors.surface : theme.app.surface,
              borderColor: isDark ? colors.border : theme.colors.border,
            },
          ]}
        >
          <Ionicons
            name={media ? "checkmark-circle" : "images-outline"}
            size={layout.iconSize.xxl}
            color={media ? theme.status.success : theme.text.tertiary}
          />
          <Text variant="bodyMedium" style={styles.dropTitle}>
            {media ? "Media selected" : "Choose a photo or video"}
          </Text>
          <Text variant="bodySmall" color="secondary_text" align="center">
            Stories disappear after 24 hours
          </Text>
        </Pressable>

        <Input
          label="Caption"
          placeholder="Add text to your story…"
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
          onPress={publish}
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
    height: 220,
    borderRadius: layout.borderRadius.lg,
    borderWidth: layout.borderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  dropTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  field: {
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.screenHorizontal,
  },
});
