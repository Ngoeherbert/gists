// components/ui/Avatar.jsx
// User avatar with image / initials fallback, optional online presence dot and
// an optional unviewed-story ring (used by the stories tray and chats list).

import React, { useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "./Text";

const SIZES = {
  xs: layout.avatarSize.xs,
  sm: layout.avatarSize.sm,
  md: layout.avatarSize.md,
  lg: layout.avatarSize.lg,
  xl: layout.avatarSize.xl,
  xxl: layout.avatarSize.xxl,
  huge: layout.avatarSize.huge,
  story: layout.story.size,
};

function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Avatar({
  source,
  uri,
  name,
  size = "md",
  ring = null, // null | "unseen" | "seen"
  online,
  style,
}) {
  const { theme, isDark } = useAppTheme();
  const [failed, setFailed] = useState(false);

  const dimension = SIZES[size] || SIZES.md;
  const imageUri = uri || (typeof source === "string" ? source : source?.uri);
  const showImage = Boolean(imageUri) && !failed;

  const ringColor = useMemo(() => {
    if (ring === "unseen") return colors.story;
    if (ring === "seen") return colors.storyViewed;
    return null;
  }, [ring]);

  const ringWidth = ring ? layout.story.ringWidth : 0;
  const outer = dimension + ringWidth * 2 + 4;

  return (
    <View style={[{ width: outer, height: outer }, styles.center, style]}>
      {ringColor ? (
        <View
          style={[
            styles.ring,
            {
              width: outer,
              height: outer,
              borderRadius: outer / 2,
              borderColor: ringColor,
              borderWidth: ringWidth,
            },
          ]}
        />
      ) : null}

      <View
        style={[
          styles.avatar,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            backgroundColor: isDark ? colors.surfaceLight : theme.app.surface,
            overflow: "hidden",
          },
        ]}
      >
        {showImage ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: dimension, height: dimension }}
            onError={() => setFailed(true)}
          />
        ) : (
          <Text
            variant="bodyMedium"
            color="secondary_text"
            style={{ fontSize: dimension * 0.36 }}
          >
            {initialsOf(name)}
          </Text>
        )}
      </View>

      {typeof online === "boolean" ? (
        <View
          style={[
            styles.presence,
            {
              width: dimension * 0.28,
              height: dimension * 0.28,
              borderRadius: (dimension * 0.28) / 2,
              backgroundColor: online ? colors.online : colors.offline,
              borderColor: isDark ? colors.background : colors.white,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  presence: {
    position: "absolute",
    right: 0,
    bottom: 0,
    borderWidth: 2,
  },
});
