// components/feeds/StoryCard.jsx
// Story tray card, modelled after Facebook/WhatsApp stories: a tall rounded
// rectangle with the story's cover image as the background, a small avatar
// (with an unseen ring) and the username overlaid at the bottom. Used by the
// feeds story tray and any other screen with stories.

import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../components/ui";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import Avatar from "../ui/Avatar";

export default function StoryCard({
  uri,
  coverUri,
  name,
  hasStory = false,
  hasUnseen = false,
  label,
  onPress,
  showAddBadge = false,
  badgeStyle,
  accessibilityLabel,
}) {
  // Fall back to the user's avatar as the cover when no story media exists.
  const coverSource = coverUri || uri;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={styles.storyCard}
    >
      <View style={styles.body}>
        {coverSource ? (
          <Image
            source={{ uri: coverSource }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverFallback} />
        )}

        <View style={styles.overlay} />

        <View style={styles.avatarRow}>
          <Avatar
            uri={uri}
            name={name || "Story"}
            size="sm"
            ring={hasStory ? (hasUnseen ? "unseen" : "seen") : null}
          />
          <Text variant="caption" numberOfLines={1} style={styles.nameText}>
            {label || name || "Story"}
          </Text>
        </View>

        {showAddBadge ? (
          <View style={[styles.addBadge, badgeStyle]}>
            <Ionicons name="add" size={18} color={colors.white} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const CARD_WIDTH = 112;
const CARD_HEIGHT = 156;

const styles = StyleSheet.create({
  storyCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: layout.borderRadius.lg,
    overflow: "hidden",
  },
  body: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  coverFallback: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.surfaceLight,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  avatarRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
  },
  nameText: {
    flex: 1,
    color: colors.white,
    marginLeft: spacing.xs,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  addBadge: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 26,
    height: 26,
    marginLeft: -13,
    marginTop: -13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: colors.primary,
    borderWidth: layout.borderWidth.thin,
    borderColor: colors.white,
  },
});