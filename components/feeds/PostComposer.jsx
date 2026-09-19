// components/feeds/PostComposer.jsx
// Shared post composer used by both create/post and feeds/edit/[id]. Handles
// text, media attach (via expo-image-picker), length limits and publishing.

import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import colors from "../../constants/colors";
import config from "../../constants/config";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import { Avatar, Button, IconButton, Text } from "../ui";
import { VerifiedBadge } from "../ui/VerifiedBadge";
import useProfileStore from "../../stores/profileStore";

export default function PostComposer({
  initialText = "",
  initialMedia = [],
  avatarUri,
  displayName,
  submitLabel = "Post",
  isSaving = false,
  onSubmit,
  onPickMedia,
  headerRight,
}) {
  const { theme, isDark } = useAppTheme();
  const [text, setText] = useState(initialText);
  const [media, setMedia] = useState(initialMedia);

  const remaining = config.limits.maxPostTextLength - text.length;
  const canSubmit = (text.trim().length > 0 || media.length > 0) && !isSaving;

  const pickMedia = useCallback(async () => {
    if (onPickMedia) {
      onPickMedia();
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: layout.post.maxImages,
      quality: 0.9,
    });
    if (!result.canceled) setMedia(result.assets ?? []);
  }, [onPickMedia]);

  const submit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit?.({ text: text.trim(), media, mediaUrl: media[0]?.uri ?? null });
  }, [canSubmit, onSubmit, text, media]);

  return (
    <View style={styles.container}>
      <View style={styles.authorRow}>
        <Avatar uri={avatarUri} name={displayName} size="md" />
        <View style={styles.authorContent}>
          <View style={styles.authorNameRow}>
            <Text
              variant="bodySmall"
              color="secondary_text"
              style={styles.authorName}
            >
              {displayName || "You"}
            </Text>
            {/* Could show verified badge for current user if needed */}
          </View>
        </View>
        <View style={styles.spacer} />
        {headerRight}
      </View>

      <Pressable style={styles.inputArea}>
        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: isDark ? colors.chatInput : theme.app.input,
              borderColor: isDark ? colors.border : theme.colors.border,
            },
          ]}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="What's on your mind?"
            multiline
            maxLength={config.limits.maxPostTextLength}
            style={[styles.input, { color: theme.text.primary }]}
            placeholderTextColor={theme.text.tertiary}
          />
        </View>
      </Pressable>

      {media.length > 0 ? (
        <View style={styles.mediaRow}>
          {media.slice(0, layout.post.maxImages).map((asset, index) => (
            <View
              key={asset.uri || index}
              style={[
                styles.mediaTile,
                {
                  backgroundColor: isDark
                    ? colors.surfaceLight
                    : theme.app.surface,
                },
              ]}
            >
              <Ionicons
                name="image-outline"
                size={layout.iconSize.lg}
                color={theme.text.muted}
              />
              <Pressable
                style={styles.removeMedia}
                onPress={() => setMedia((m) => m.filter((_, i) => i !== index))}
                hitSlop={spacing.sm}
              >
                <Ionicons name="close" size={14} color={colors.white} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      <View
        style={[
          styles.toolbar,
          { borderTopColor: isDark ? colors.border : theme.colors.border },
        ]}
      >
        <IconButton name="image-outline" onPress={pickMedia} />
        <IconButton name="camera-outline" onPress={pickMedia} />
        <IconButton name="location-outline" onPress={() => {}} />
        <IconButton name="pricetag-outline" onPress={() => {}} />

        <View style={styles.spacer} />

        <Text
          variant="caption"
          color={remaining < 100 ? "warning" : "tertiary"}
          style={styles.counter}
        >
          {remaining}
        </Text>

        <Button
          title={submitLabel}
          size="small"
          disabled={!canSubmit}
          loading={isSaving}
          onPress={submit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  authorName: {
    marginLeft: spacing.sm,
  },
  spacer: {
    flex: 1,
  },
  inputArea: {
    flex: 1,
  },
  inputWrap: {
    flex: 1,
    borderRadius: layout.borderRadius.md,
    borderWidth: layout.borderWidth.thin,
    padding: spacing.md,
    minHeight: 140,
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
  },
  mediaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
  },
  mediaTile: {
    width: 72,
    height: 72,
    borderRadius: layout.borderRadius.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  removeMedia: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: layout.borderWidth.thin,
  },
  counter: {
    marginRight: spacing.md,
  },
});
