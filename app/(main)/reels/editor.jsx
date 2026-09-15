// app/(main)/reels/editor.jsx
// Reel editor: trim / cover / effects controls over the selected clip. The
// actual video processing is stubbed; the controls write into reelStore.editor.

import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useReelStore from "../../../stores/reelStore";
import useAppStore from "../../../stores/appStore";
import { Header } from "../../../components/common";
import { Button, Text } from "../../../components/ui";

const TOOLS = [
  { key: "trim", icon: "cut-outline", label: "Trim" },
  { key: "music", icon: "musical-notes-outline", label: "Audio" },
  { key: "effects", icon: "color-wand-outline", label: "Effects" },
  { key: "text", icon: "text-outline", label: "Text" },
  { key: "cover", icon: "image-outline", label: "Cover" },
];

export default function ReelEditorScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const editor = useReelStore((s) => s.editor);
  const setEditor = useReelStore((s) => s.setEditor);
  const showToast = useAppStore((s) => s.showToast);

  const chooseTool = useCallback(
    (tool) => {
      // Surface the concept without pretending to process video.
      setEditor({ activeTool: tool.key });
      showToast(`${tool.label} controls are not wired up yet`, "info");
    },
    [setEditor, showToast]
  );

  return (
    <View style={styles.container}>
      <Header title="Edit reel" showBack />

      <View style={styles.stage}>
        <View
          style={[
            styles.preview,
            { backgroundColor: isDark ? colors.surface : theme.app.surface },
          ]}
        >
          <Ionicons name="play-circle-outline" size={64} color={theme.text.muted} />
          <Text variant="caption" color="tertiary" style={styles.previewLabel}>
            Preview
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.toolbar,
          {
            backgroundColor: isDark ? colors.surface : colors.white,
            borderTopColor: isDark ? colors.border : theme.colors.border,
          },
        ]}
      >
        {TOOLS.map((tool) => {
          const active = editor.activeTool === tool.key;
          return (
            <Pressable
              key={tool.key}
              style={styles.tool}
              onPress={() => chooseTool(tool)}
            >
              <Ionicons
                name={tool.icon}
                size={layout.iconSize.lg}
                color={active ? theme.colors.primary : theme.text.secondary}
              />
              <Text
                variant="caption"
                color={active ? "primary" : "tertiary"}
                style={styles.toolLabel}
              >
                {tool.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          title="Next"
          icon="arrow-forward"
          iconPosition="right"
          size="large"
          fullWidth
          onPress={() => router.push("/(main)/reels/preview")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stage: {
    flex: 1,
    padding: spacing.screenHorizontal,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: "100%",
    aspectRatio: layout.reel.aspectRatio,
    maxHeight: 420,
    borderRadius: layout.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  previewLabel: {
    marginTop: spacing.sm,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.md,
    borderTopWidth: layout.borderWidth.thin,
  },
  tool: {
    alignItems: "center",
  },
  toolLabel: {
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.screenHorizontal,
  },
});
