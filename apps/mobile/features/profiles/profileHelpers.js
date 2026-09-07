// apps/mobile/features/profiles/profileHelpers.js

export function getProfileId(profile) {
  return profile?.id || profile?.userId || null;
}

export function getProfileUsername(profile) {
  return profile?.username || "";
}

export function getProfileDisplayName(profile) {
  return (
    profile?.displayName || profile?.name || profile?.username || "Gists User"
  );
}

export function getProfileAvatar(profile) {
  return profile?.avatar || profile?.avatarUrl || null;
}

export function getProfileBio(profile) {
  return profile?.bio || "";
}

export function getProfileWebsite(profile) {
  return profile?.website || "";
}

export function getProfileLocation(profile) {
  return profile?.location || "";
}

export function getProfileFollowers(profile) {
  return Number(profile?.followersCount || profile?.followers || 0);
}

export function getProfileFollowing(profile) {
  return Number(profile?.followingCount || profile?.following || 0);
}

export function getProfilePosts(profile) {
  return Number(profile?.postsCount || profile?.posts || 0);
}

export function getProfileReels(profile) {
  return Number(profile?.reelsCount || profile?.reels || 0);
}

export function isVerified(profile) {
  return Boolean(profile?.verified || profile?.isVerified);
}

export function isPrivateProfile(profile) {
  return profile?.visibility === "private" || profile?.isPrivate === true;
}

export function isActiveProfile(profile) {
  return !profile?.status || profile.status === "active";
}

export function isOwnProfile(profile, currentUserId) {
  const profileId = getProfileId(profile);
  return Boolean(profileId && currentUserId && profileId === currentUserId);
}

export function isFollowing(profile) {
  return Boolean(profile?.isFollowing || profile?.following);
}

export function isFollower(profile) {
  return Boolean(profile?.isFollower || profile?.follower);
}

export function isMutual(profile) {
  return isFollowing(profile) && isFollower(profile);
}

export function isBlocked(profile) {
  return Boolean(profile?.isBlocked || profile?.blocked);
}

export function isBlockedBy(profile) {
  return Boolean(profile?.isBlockedBy || profile?.blockedBy);
}

export function getProfileRelationship(profile, currentUserId) {
  if (isOwnProfile(profile, currentUserId)) return "self";
  if (isBlocked(profile)) return "blocked";
  if (isBlockedBy(profile)) return "blocked_by";
  if (isMutual(profile)) return "mutual";
  if (isFollowing(profile)) return "following";
  if (isFollower(profile)) return "follower";
  return "none";
}

export function getProfileStats(profile = {}) {
  return {
    posts: getProfilePosts(profile),
    reels: getProfileReels(profile),
    followers: getProfileFollowers(profile),
    following: getProfileFollowing(profile),
  };
}

export function getProfileInitials(profile) {
  const name = getProfileDisplayName(profile).trim();

  if (!name) return "?";

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function sortProfiles(profiles = [], key = "displayName") {
  return [...profiles].sort((a, b) =>
    String(a?.[key] || "").localeCompare(String(b?.[key] || "")),
  );
}

export function filterProfiles(profiles = [], query = "") {
  const normalizedQuery = String(query).trim().toLowerCase();

  if (!normalizedQuery) return profiles;

  return profiles.filter((profile) => {
    const username = String(profile?.username || "").toLowerCase();
    const displayName = String(
      profile?.displayName || profile?.name || "",
    ).toLowerCase();

    return (
      username.includes(normalizedQuery) ||
      displayName.includes(normalizedQuery)
    );
  });
}

export default {
  getProfileId,
  getProfileUsername,
  getProfileDisplayName,
  getProfileAvatar,
  getProfileBio,
  getProfileWebsite,
  getProfileLocation,
  getProfileFollowers,
  getProfileFollowing,
  getProfilePosts,
  getProfileReels,
  isVerified,
  isPrivateProfile,
  isActiveProfile,
  isOwnProfile,
  isFollowing,
  isFollower,
  isMutual,
  isBlocked,
  isBlockedBy,
  getProfileRelationship,
  getProfileStats,
  getProfileInitials,
  sortProfiles,
  filterProfiles,
};
