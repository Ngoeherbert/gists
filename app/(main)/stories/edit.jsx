// app/(main)/stories/edit.jsx
// Edit an existing (own) story: change caption, add stickers, replace media.

import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import config from "../../../constants/config";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useStoryStore from "../../../stores/storyStore";
import useAppStore from "../../../stores/appStore";
import { Header, Screen } from "../../../components/common";
import { Button, Input, Text } from "../../../components/ui";

const TOOLS = [
  { key: "text", icon: "text-outline", label: "Text" },
  { key: "sticker", icon: "happy-outline", label: "Sticker" },
  { key: "draw", icon: "brush-outline", label: "Draw" },
  { key: "crop", icon: "crop-outline", label: "Crop" },
];

export default function EditStoryScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const addEditorText = useStoryStore((s) => s.addEditorText);
  const updateDraft = useStoryStore((s) => s.updateDraft);
  const draft = useStoryStore((s) => s.draft);
  const showToast = useAppStore((s) => s.showToast);

  const [caption, setCaption] = useState(draft?.caption ?? "");

return (
    <Screen
      padded={false}
      header={
        <Header
          title="Edit story"
          showBack
          right={
            <Button
              title="Done"
              size="small"
              onPress={() => {
                updateDraft({ caption: caption.trim() });
                showToast("Story updated", "success");
                router.back();
              }}
            />
          }
        />
      }
    >
      <View style={styles.stage}>
        <View
          style={[
            styles.preview,
            { backgroundColor: isDark ? colors.surface : theme.app.surface },
          ]}
        >
          <Ionicons name="image-outline" size={64} color={theme.text.muted} />
        </View>
      </View>

      <View style={styles.toolbar}>
        {TOOLS.map((tool) => (
          <Pressable
            key={tool.key}
            style={styles.tool}
            onPress={() => {
              if (tool.key === "text") {
                addEditorText({ id: `t-${Date.now()}`, value: "" });
              }
              showToast(`${tool.label} tool coming soon`, "info");
            }}
          >
            <Ionicons name={tool.icon} size={layout.iconSize.lg} color={theme.text.secondary} />
            <Text variant="caption" color="tertiary" style={styles.toolLabel}>
              {tool.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Input
          placeholder="Caption"
          value={caption}
          onChangeText={setCaption}
          maxLength={config.limits.maxStoryTextLength}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    padding: spacing.screenHorizontal,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: "100%",
    maxWidth: 280,
    aspectRatio: 9 / 16,
    borderRadius: layout.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.md,
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
