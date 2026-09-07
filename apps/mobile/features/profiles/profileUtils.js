// apps/mobile/features/profiles/profileUtils.js

export function isValidProfile(profile) {
  return Boolean(profile && (profile.id || profile.userId || profile.username));
}

export function getProfileId(profile) {
  return profile?.id || profile?.userId || null;
}

export function getUsername(profile) {
  return String(profile?.username || "").replace(/^@/, "");
}

export function getProfileUrl(profile) {
  const username = getUsername(profile);

  return username ? `/profile/${username}` : null;
}

export function getProfileVisibility(profile) {
  return profile?.visibility || (profile?.isPrivate ? "private" : "public");
}

export function getRelationshipLabel(profile) {
  if (profile?.isBlocked) return "Blocked";
  if (profile?.isBlockedBy) return "Blocked you";
  if (profile?.isFollowing && profile?.isFollower) return "Mutual";
  if (profile?.isFollowing) return "Following";
  if (profile?.isFollower) return "Follows you";

  return "Not following";
}

export function getFollowAction(profile) {
  return profile?.isFollowing || profile?.following ? "unfollow" : "follow";
}

export function normalizeProfile(profile = {}) {
  return {
    ...profile,
    id: profile.id || profile.userId || null,
    username: String(profile.username || "").replace(/^@/, ""),
    displayName: profile.displayName || profile.name || profile.username || "",
    bio: profile.bio || "",
    avatar: profile.avatar || profile.avatarUrl || null,
    website: profile.website || "",
    location: profile.location || "",
    followersCount: Number(profile.followersCount || profile.followers || 0),
    followingCount: Number(profile.followingCount || profile.following || 0),
    postsCount: Number(profile.postsCount || profile.posts || 0),
    reelsCount: Number(profile.reelsCount || profile.reels || 0),
    verified: Boolean(profile.verified || profile.isVerified),
    isFollowing: Boolean(profile.isFollowing || profile.following),
    isFollower: Boolean(profile.isFollower || profile.follower),
    isBlocked: Boolean(profile.isBlocked || profile.blocked),
    isBlockedBy: Boolean(profile.isBlockedBy || profile.blockedBy),
  };
}

export function normalizeProfiles(profiles = []) {
  return profiles.map(normalizeProfile);
}

export function buildProfileUpdatePayload(data = {}) {
  const payload = {};

  const allowedFields = [
    "displayName",
    "username",
    "bio",
    "website",
    "location",
    "visibility",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      payload[field] = data[field];
    }
  });

  return payload;
}

export function buildFollowPayload(userId) {
  return {
    userId,
  };
}

export function buildProfileSearchParams(query, page = 1, limit = 20) {
  return {
    query: String(query || "").trim(),
    page,
    limit,
  };
}

export function mergeProfile(profile, updates = {}) {
  return {
    ...normalizeProfile(profile),
    ...updates,
  };
}

export function getProfileStats(profile = {}) {
  return {
    posts: Number(profile.postsCount || profile.posts || 0),
    reels: Number(profile.reelsCount || profile.reels || 0),
    followers: Number(profile.followersCount || profile.followers || 0),
    following: Number(profile.followingCount || profile.following || 0),
  };
}

export function updateFollowerCount(profile, increment = true) {
  const current = Number(profile?.followersCount || profile?.followers || 0);

  return {
    ...profile,
    followersCount: Math.max(0, current + (increment ? 1 : -1)),
  };
}

export default {
  isValidProfile,
  getProfileId,
  getUsername,
  getProfileUrl,
  getProfileVisibility,
  getRelationshipLabel,
  getFollowAction,
  normalizeProfile,
  normalizeProfiles,
  buildProfileUpdatePayload,
  buildFollowPayload,
  buildProfileSearchParams,
  mergeProfile,
  getProfileStats,
  updateFollowerCount,
};
