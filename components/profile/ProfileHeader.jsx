// components/profile/ProfileHeader.jsx
// The top of a profile screen: avatar, name/handle, bio, stats row (posts /
// followers / following) and the primary action button.

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Text from "../ui/Text";
import { VerifiedBadge } from "../ui/VerifiedBadge";
import useProfileStore from "../../stores/profileStore";

function formatCount(n = 0) {
  if (n < 1000) return String(n);
  if (n < 1000000) return `${(n / 1000).toFixed(1)}K`;
  return `${(n / 1000000).toFixed(1)}M`;
}

export default function ProfileHeader({
  profile,
  isMe = false,
  isFollowing = false,
  onPressFollowers,
  onPressFollowing,
  onPressEdit,
  onPressFollow,
  onPressShare,
}) {
  const { theme } = useAppTheme();
  if (!profile) return null;

  const stats = [
    { key: "posts", value: profile.postsCount ?? 0, label: "Posts" },
    { key: "followers", value: profile.followersCount ?? 0, label: "Followers", onPress: onPressFollowers },
    { key: "following", value: profile.followingCount ?? 0, label: "Following", onPress: onPressFollowing },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Avatar
          uri={profile.avatarUrl}
          name={profile.name || profile.username}
          size="xxl"
          ring={profile.hasStory ? "unseen" : null}
        />

        <View style={styles.topActions}>
          <Button
            title={isMe ? "Edit profile" : isFollowing ? "Following" : "Follow"}
            variant={isMe ? "outline" : isFollowing ? "ghost" : "solid"}
            size="small"
            onPress={isMe ? onPressEdit : onPressFollow}
          />
          <Button
            title="Share"
            variant="ghost"
            size="small"
            style={styles.shareButton}
            onPress={onPressShare}
          />
        </View>
      </View>

      <View style={styles.nameRow}>
        <Text variant="title" style={styles.name}>
          {profile.name || profile.username}
        </Text>
        {profile.id && useProfileStore.getState().verifiedUsers[profile.id] && (
          <VerifiedBadge
            size={24}
            color={useProfileStore.getState().getVerifiedBadge(profile.id).color}
            iconName="verified"
          />
        )}
      </View>
      {profile.username ? (
        <Text variant="bodySmall" color="secondary_text" style={styles.handle}>
          @{profile.username}
        </Text>
      ) : null}

      {profile.bio ? (
        <Text variant="body" style={styles.bio}>
          {profile.bio}
        </Text>
      ) : (
        <Text variant="bodySmall" color="tertiary" style={styles.bio}>
          No bio yet.
        </Text>
      )}

      <View style={styles.stats}>
        {stats.map((stat) => (
          <Pressable
            key={stat.key}
            style={styles.stat}
            onPress={stat.onPress}
            disabled={!stat.onPress}
          >
            <Text variant="bodyBold">{formatCount(stat.value)}</Text>
            <Text variant="caption" color="tertiary">
              {stat.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareButton: {
    marginLeft: spacing.sm,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    marginBottom: spacing.xxs,
  },
  handle: {
    marginBottom: spacing.md,
  },
  bio: {
    marginBottom: spacing.lg,
  },
  stats: {
    flexDirection: "row",
  },
  stat: {
    marginRight: spacing.xxxl,
  },
});
