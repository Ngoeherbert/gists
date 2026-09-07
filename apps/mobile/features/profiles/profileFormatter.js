// apps/mobile/features/profiles/profileFormatter.js

import { formatDate } from "../../utils/formatDate";
import { formatNumber } from "../../utils/formatNumber";

export function formatProfile(profile = {}) {
  return {
    ...profile,
    id: profile.id || profile.userId || null,
    username: profile.username || "",
    displayName:
      profile.displayName || profile.name || profile.username || "Gists User",
    bio: profile.bio || "",
    avatar: profile.avatar || profile.avatarUrl || null,
    website: profile.website || "",
    location: profile.location || "",
    followersCount: Number(profile.followersCount || profile.followers || 0),
    followingCount: Number(profile.followingCount || profile.following || 0),
    postsCount: Number(profile.postsCount || profile.posts || 0),
    reelsCount: Number(profile.reelsCount || profile.reels || 0),
    verified: Boolean(profile.verified || profile.isVerified),
  };
}

export function formatProfiles(profiles = []) {
  return profiles.map(formatProfile);
}

export function formatProfileId(profile) {
  return profile?.id || profile?.userId || null;
}

export function formatUsername(profile) {
  return profile?.username ? `@${profile.username.replace(/^@/, "")}` : "";
}

export function formatDisplayName(profile) {
  return (
    profile?.displayName || profile?.name || profile?.username || "Gists User"
  );
}

export function formatFollowersCount(profile) {
  return formatNumber(
    Number(profile?.followersCount || profile?.followers || 0),
  );
}

export function formatFollowingCount(profile) {
  return formatNumber(
    Number(profile?.followingCount || profile?.following || 0),
  );
}

export function formatPostsCount(profile) {
  return formatNumber(Number(profile?.postsCount || profile?.posts || 0));
}

export function formatProfileDate(date) {
  return date ? formatDate(date) : "";
}

export function formatProfileStats(profile = {}) {
  return {
    posts: Number(profile.postsCount || profile.posts || 0),
    followers: Number(profile.followersCount || profile.followers || 0),
    following: Number(profile.followingCount || profile.following || 0),
    reels: Number(profile.reelsCount || profile.reels || 0),
  };
}

export default {
  formatProfile,
  formatProfiles,
  formatProfileId,
  formatUsername,
  formatDisplayName,
  formatFollowersCount,
  formatFollowingCount,
  formatPostsCount,
  formatProfileDate,
  formatProfileStats,
};
