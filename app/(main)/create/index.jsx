// app/(main)/create/index.jsx
// Create hub. Offers the four composer entry points; each navigates to its
// dedicated route in this group.

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import config from "../../../constants/config";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import { Card, Text } from "../../../components/ui";
import { Header, Screen } from "../../../components/common";

const OPTIONS = [
  {
    key: "post",
    icon: "create-outline",
    title: "Post",
    description: "Share text and photos with your followers.",
    accent: colors.primary,
    route: "/(main)/create/post",
    enabled: true,
  },
  {
    key: "reel",
    icon: "videocam-outline",
    title: "Reel",
    description: "Record or upload a short vertical video.",
    accent: colors.secondary,
    route: "/(main)/create/reel",
    enabled: config.features.reels,
  },
  {
    key: "story",
    icon: "aperture-outline",
    title: "Story",
    description: "Post something that disappears in 24 hours.",
    accent: colors.story,
    route: "/(main)/create/story",
    enabled: config.features.stories,
  },
  {
    key: "room",
    icon: "game-controller-outline",
    title: "Gist Room",
    description: "Start a watch or game session with friends.",
    accent: colors.accent,
    route: "/(main)/chats/room/create",
    enabled: config.features.gistRooms,
  },
];

export default function CreateHubScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  return (
    <Screen
      scroll
      padded={false}
      edges={["top"]}
      style={styles.body}
      header={<Header title="Create" showBack centerTitle />}
    >
      <View style={styles.list}>
        {OPTIONS.map((option) => {
          const disabled = !option.enabled;
          return (
            <Card
              key={option.key}
              pressable={!disabled}
              onPress={disabled ? undefined : () => router.navigate(option.route)}
              padding="large"
              style={[styles.card, disabled && styles.disabled]}
            >
              <View style={styles.row}>
                <View
                  style={[styles.iconWrap, { backgroundColor: `${option.accent}1A` }]}
                >
                  <Ionicons name={option.icon} size={layout.iconSize.lg} color={option.accent} />
                </View>

                <View style={styles.text}>
                  <Text variant="bodyMedium">{option.title}</Text>
                  <Text variant="bodySmall" color="secondary_text">
                    {option.description}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={layout.iconSize.md}
                  color={theme.text.tertiary}
                />
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 0,
  },
  list: {
    padding: spacing.sm,
  },
  card: {
    marginBottom: spacing.md,
  },
  disabled: {
    opacity: 0.45,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: layout.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  text: {
    flex: 1,
  },
});
