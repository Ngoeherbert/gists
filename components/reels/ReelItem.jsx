// components/reels/ReelItem.jsx
// One full-screen reel: media surface, author info, caption and the vertical
// action rail (like, comment, share, save). Playback state is owned by the
// parent pager so only the visible reel is marked active.

import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useReelStore from "../../stores/reelStore";
import useAppStore from "../../stores/appStore";
import Avatar from "../ui/Avatar";
import Text from "../ui/Text";

function formatCount(n = 0) {
  if (n < 1000) return String(n);
  if (n < 1000000) return `${(n / 1000).toFixed(1)}K`;
  return `${(n / 1000000).toFixed(1)}M`;
}

function ReelItem({ reel, isActive, height }) {
  const router = useRouter();

  const toggleLike = useReelStore((s) => s.toggleLike);
  const toggleSave = useReelStore((s) => s.toggleSave);
  const incrementShare = useReelStore((s) => s.incrementShare);
  const showToast = useAppStore((s) => s.showToast);

  const togglePlay = useReelStore((s) => s.togglePlay);
  const isPlaying = useReelStore((s) => s.isPlaying);

  if (!reel) return null;

  const handleLike = useCallback(
    () => toggleLike({ reelId: reel.id }),
    [toggleLike, reel.id],
  );

  const author = reel.author || {};

  return (
    <View style={[styles.wrap, { height }]}>
      {/* Video surface placeholder — expo-video player mounts here. */}
      <Pressable style={styles.media} onPress={togglePlay}>
        <View style={styles.mediaInner}>
          <Ionicons
            name={
              isActive && isPlaying
                ? "pause-circle-outline"
                : "play-circle-outline"
            }
            size={72}
            color="rgba(255,255,255,0.85)"
          />
        </View>
      </Pressable>

      <View style={styles.overlay} pointerEvents="box-none">
        {/* Left: author + caption */}
        <View style={styles.bottomLeft}>
          <Pressable
            style={styles.authorRow}
            onPress={() => router.navigate(`/profile/${author.id ?? "me"}`)}
          >
            <Avatar
              uri={author.avatarUrl}
              name={author.name || author.username}
              size="sm"
            />
            <Text variant="bodyMedium" style={styles.authorName}>
              {author.username || author.name || "user"}
            </Text>
            <View style={styles.followPill}>
              <Text variant="caption" color="default">
                Follow
              </Text>
            </View>
          </Pressable>

          {reel.caption ? (
            <Text variant="bodySmall" numberOfLines={3} style={styles.caption}>
              {reel.caption}
            </Text>
          ) : null}

          <View style={styles.audioRow}>
            <Ionicons
              name="musical-notes"
              size={layout.iconSize.sm}
              color={colors.white}
            />
            <Text variant="caption" numberOfLines={1} style={styles.audioText}>
              {reel.audioName || "Original audio"}
            </Text>
          </View>
        </View>

        {/* Right: action rail */}
        <View style={styles.rail}>
          <RailAction
            icon={reel.isLiked ? "heart" : "heart-outline"}
            color={reel.isLiked ? colors.like : colors.white}
            label={formatCount(reel.likesCount ?? 0)}
            onPress={handleLike}
          />
          <RailAction
            icon="chatbubble-outline"
            label={formatCount(reel.commentsCount ?? 0)}
            onPress={() => router.navigate(`/(main)/reels/comments/${reel.id}`)}
          />
          <RailAction
            icon="paper-plane-outline"
            label={formatCount(reel.sharesCount ?? 0)}
            onPress={() => {
              incrementShare(reel.id);
              showToast("Share sheet coming soon", "info");
            }}
          />
          <RailAction
            icon={reel.isSaved ? "bookmark" : "bookmark-outline"}
            color={reel.isSaved ? colors.save : colors.white}
            onPress={() => toggleSave({ reelId: reel.id })}
          />
          <RailAction
            icon="ellipsis-horizontal"
            onPress={() => router.navigate("/(main)/reels/settings")}
          />
        </View>
      </View>
    </View>
  );
}

function RailAction({ icon, label, color = colors.white, onPress }) {
  return (
    <Pressable style={styles.railAction} onPress={onPress} hitSlop={spacing.sm}>
      <Ionicons name={icon} size={layout.iconSize.lg + 4} color={color} />
      {label ? (
        <Text variant="caption" style={styles.railLabel}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default memo(ReelItem);

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    backgroundColor: colors.black,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    flexDirection: "row",
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.xxxl,
  },
  bottomLeft: {
    flex: 1,
    justifyContent: "flex-end",
    marginRight: spacing.xl,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  authorName: {
    marginLeft: spacing.sm,
    color: colors.white,
  },
  followPill: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: layout.borderRadius.round,
    borderWidth: layout.borderWidth.thin,
    borderColor: colors.white,
  },
  caption: {
    color: colors.white,
    marginBottom: spacing.sm,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  audioText: {
    color: colors.white,
    marginLeft: spacing.xs,
    maxWidth: 200,
  },
  rail: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  railAction: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  railLabel: {
    color: colors.white,
    marginTop: spacing.xxs,
  },
});
