// components/feeds/StoryCard.jsx
// Reusable story tray card: avatar with optional unseen ring, optional add
// badge, and label below. Used by feeds and any other screen with stories.

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import { Avatar, Text } from "../../components/ui";

export default function StoryCard({
  uri,
  name,
  hasStory = false,
  hasUnseen = false,
  label,
  onPress,
  showAddBadge = false,
  badgeStyle,
  accessibilityLabel,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={styles.storyCard}
    >
      <View style={styles.avatarStack}>
        <Avatar
          uri={uri}
          name={name || "Story"}
          size="story"
          ring={hasStory ? (hasUnseen ? "unseen" : "seen") : null}
        />
        {showAddBadge ? (
          <View
            style={[styles.addBadge, badgeStyle]}
          >
            <Ionicons name="add" size={12} color={colors.white} />
          </View>
        ) : null}
      </View>
      <Text variant="caption" numberOfLines={1} style={styles.storyLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  storyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxs,
  },
  avatarStack: {
    position: "relative",
    marginBottom: spacing.xs,
  },
  addBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: layout.borderWidth.thin,
  },
  storyLabel: {
    maxWidth: 66,
    textAlign: "center",
  },
});
