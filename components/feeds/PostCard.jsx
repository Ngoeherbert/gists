// components/feeds/PostCard.jsx
// A single feed post: author row, body text, media, engagement bar and the
// tappable surface that opens the post detail. Engagement is driven straight
// from feedStore's optimistic actions.

import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useFeedStore from "../../stores/feedStore";
import useAppStore from "../../stores/appStore";
import Avatar from "../ui/Avatar";
import Text from "../ui/Text";

function formatCount(n = 0) {
  if (n < 1000) return String(n);
  if (n < 1000000) return `${(n / 1000).toFixed(n < 10000 ? 1 : 0)}K`;
  return `${(n / 1000000).toFixed(1)}M`;
}

function timeAgo(ts) {
  if (!ts) return "";
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (seconds < 60) return "now";
  const units = [
    ["m", 60],
    ["h", 3600],
    ["d", 86400],
    ["w", 604800],
  ];
  let out = "now";
  for (const [suffix, secs] of units) {
    if (seconds >= secs) out = `${Math.floor(seconds / secs)}${suffix}`;
  }
  return out;
}

// Pull hashtags (#word) and mentions (@user) out of a caption so they can be
// rendered as tappable chips below the body text.
function extractTags(text = "") {
  const tags = [];
  const seen = new Set();
  const re = /[#@][\w]+/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    const tag = match[0];
    if (seen.has(tag)) continue;
    seen.add(tag);
    tags.push(tag);
  }
  return tags;
}

const TEXT_POST_COLORS = [
  colors.accent,
  colors.secondary,
  colors.primary,
  colors.primaryDark,
  colors.like,
];

function textPostColor(postId) {
  const hash = Array.from(postId ?? "").reduce(
    (n, c) => n + c.charCodeAt(0),
    0,
  );
  return TEXT_POST_COLORS[Math.abs(hash) % TEXT_POST_COLORS.length];
}

function PostCard({ post }) {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const toggleSave = useFeedStore((s) => s.toggleSave);
  const toggleRepost = useFeedStore((s) => s.toggleRepost);
  const incrementShare = useFeedStore((s) => s.incrementShare);
  const showToast = useAppStore((s) => s.showToast);

  if (!post) return null;

  const openPost = useCallback(
    () => router.navigate(`/(main)/feeds/post/${post.id}`),
    [router, post.id],
  );

  const author = post.author || {};
  const likeCount = post.likesCount ?? post.likeCount ?? 0;
  const isTextOnly = !post.mediaUrl;
  const tags = extractTags(post.text);

  return (
    <View
      style={[
        styles.wrap,
        isTextOnly
          ? styles.card
          : {
              borderBottomColor: isDark ? colors.border : theme.colors.border,
            },
      ]}
    >
      {/* Author row */}
      <View style={styles.authorRow}>
        <Pressable
          style={styles.authorLeft}
          onPress={() => router.navigate(`/profile/${author.id ?? "me"}`)}
        >
          <Avatar
            uri={author.avatarUrl}
            name={author.name || author.username}
            size="md"
          />
          <View style={styles.authorMeta}>
            <Text variant="bodyMedium" numberOfLines={1}>
              {author.name || author.username || "Someone"}
            </Text>
            <Text variant="caption" color="tertiary">
              @{author.username || "user"} · {timeAgo(post.createdAt)}
            </Text>
          </View>
        </Pressable>

        <Pressable
          hitSlop={spacing.sm}
          onPress={() => showToast("Post options", "info")}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
      </View>

      {/* Body */}
      {post.text ? (
        <Pressable
          onPress={openPost}
          style={[
            styles.text,
            isTextOnly && [
              styles.textCard,
              {
                backgroundColor: textPostColor(post.id),
              },
            ],
          ]}
        >
          <Text
            variant="body"
            style={[
              styles.textInner,
              isTextOnly && [styles.textInnerCard, { color: colors.white }],
            ]}
            numberOfLines={8}
          >
            {post.text}
          </Text>
        </Pressable>
      ) : null}

      {/* Hashtags & mentions */}
      {tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <Pressable
              key={tag}
              style={styles.tagChip}
              onPress={() => showToast(`Open ${tag}`, "info")}
            >
              <Text variant="caption" color="primary" style={styles.tagText}>
                {tag}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Media placeholder — real media rendering lands with the post detail work. */}
      {post.mediaUrl ? (
        <Pressable onPress={openPost} style={styles.media}>
          <View
            style={[
              styles.mediaInner,
              {
                backgroundColor: isDark
                  ? colors.surfaceLight
                  : theme.app.surface,
              },
            ]}
          >
            <Ionicons
              name="image-outline"
              size={layout.iconSize.xxl}
              color={theme.text.muted}
            />
          </View>
        </Pressable>
      ) : null}

      {/* Engagement bar */}
      <View style={styles.actions}>
        <Pressable
          style={styles.action}
          onPress={() => toggleLike({ postId: post.id })}
          hitSlop={spacing.sm}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={layout.iconSize.md}
            color={post.isLiked ? colors.like : theme.text.tertiary}
          />
          <Text
            variant="caption"
            color={post.isLiked ? "default" : "tertiary"}
            style={styles.actionLabel}
          >
            {formatCount(likeCount)}
          </Text>
        </Pressable>

        <Pressable
          style={styles.action}
          onPress={openPost}
          hitSlop={spacing.sm}
        >
          <Ionicons
            name="chatbubble-outline"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
          <Text variant="caption" color="tertiary" style={styles.actionLabel}>
            {formatCount(post.commentsCount ?? 0)}
          </Text>
        </Pressable>

        <Pressable
          style={styles.action}
          onPress={() => toggleRepost({ postId: post.id })}
          hitSlop={spacing.sm}
        >
          <Feather
            name="repeat"
            size={layout.iconSize.md}
            color={post.isReposted ? colors.repost : theme.text.tertiary}
          />
          <Text variant="caption" color="tertiary" style={styles.actionLabel}>
            {formatCount(post.repostsCount ?? 0)}
          </Text>
        </Pressable>

        <Pressable
          style={styles.action}
          onPress={() => {
            incrementShare(post.id);
            showToast("Share sheet coming soon", "info");
          }}
          hitSlop={spacing.sm}
        >
          <MaterialCommunityIcons
            name="share-outline"
            size={layout.iconSize.lg}
            color={theme.text.tertiary}
          />
        </Pressable>

        <View style={styles.spacer} />

        <Pressable
          style={styles.action}
          onPress={() => toggleSave({ postId: post.id })}
          hitSlop={spacing.sm}
        >
          <Ionicons
            name={post.isSaved ? "bookmark" : "bookmark-outline"}
            size={layout.iconSize.md}
            color={post.isSaved ? colors.save : theme.text.tertiary}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default memo(PostCard);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: layout.borderWidth.thin,
  },
  card: {
    borderBottomWidth: 0,
    borderRadius: layout.borderRadius.lg,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  authorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  authorMeta: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  text: {
    marginBottom: spacing.md,
  },
  textCard: {
    width: "100%",
    aspectRatio: layout.post.imageAspectRatio,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: layout.borderRadius.lg,
  },
  textInner: {
    textAlign: "left",
    paddingHorizontal: spacing.md,
  },
  textInnerCard: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 30,
    paddingHorizontal: spacing.xl,
  },
  media: {
    marginBottom: spacing.md,
  },
  mediaInner: {
    width: "100%",
    aspectRatio: layout.post.imageAspectRatio,
    borderRadius: layout.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  tagChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: layout.borderRadius.round,
    backgroundColor: "rgba(108, 92, 231, 0.12)",
  },
  tagText: {
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.xl,
  },
  actionLabel: {
    marginLeft: spacing.xs,
  },
  spacer: {
    flex: 1,
  },
});
