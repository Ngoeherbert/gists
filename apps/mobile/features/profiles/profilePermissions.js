// apps/mobile/features/profiles/profilePermissions.js

export function canViewProfile(profile, currentUserId) {
  if (!profile) return false;

  if (profile.id === currentUserId || profile.userId === currentUserId) {
    return true;
  }

  if (profile.isBlocked || profile.blockedBy) {
    return false;
  }

  if (profile.visibility === "private" || profile.isPrivate) {
    return Boolean(profile.isFollowing || profile.following);
  }

  return true;
}

export function canEditProfile(profile, currentUserId) {
  if (!profile || !currentUserId) return false;

  return profile.id === currentUserId || profile.userId === currentUserId;
}

export function canFollowProfile(profile, currentUserId) {
  if (!profile || !currentUserId) return false;

  const profileId = profile.id || profile.userId;

  if (!profileId || profileId === currentUserId) return false;
  if (profile.isBlocked || profile.blockedBy) return false;
  if (profile.isFollowing || profile.following) return false;

  return true;
}

export function canUnfollowProfile(profile, currentUserId) {
  if (!profile || !currentUserId) return false;

  const profileId = profile.id || profile.userId;

  if (!profileId || profileId === currentUserId) return false;
  if (profile.isBlocked || profile.blockedBy) return false;

  return Boolean(profile.isFollowing || profile.following);
}

export function canMessageProfile(profile, currentUserId) {
  if (!profile || !currentUserId) return false;

  const profileId = profile.id || profile.userId;

  if (!profileId || profileId === currentUserId) return false;
  if (profile.isBlocked || profile.blockedBy) return false;

  return true;
}

export function canCallProfile(profile, currentUserId) {
  return canMessageProfile(profile, currentUserId);
}

export function canBlockProfile(profile, currentUserId) {
  if (!profile || !currentUserId) return false;

  const profileId = profile.id || profile.userId;

  return Boolean(
    profileId &&
    profileId !== currentUserId &&
    !profile.isBlockedBy &&
    !profile.isBlocked,
  );
}

export function canUnblockProfile(profile) {
  return Boolean(profile?.isBlocked);
}

export function canReportProfile(profile, currentUserId) {
  if (!profile) return false;

  const profileId = profile.id || profile.userId;

  return Boolean(profileId && profileId !== currentUserId);
}

export function canShareProfile(profile) {
  return Boolean(profile?.id || profile?.userId || profile?.username);
}

export function canManageProfile(profile, currentUserId) {
  return canEditProfile(profile, currentUserId);
}

export default {
  canViewProfile,
  canEditProfile,
  canFollowProfile,
  canUnfollowProfile,
  canMessageProfile,
  canCallProfile,
  canBlockProfile,
  canUnblockProfile,
  canReportProfile,
  canShareProfile,
  canManageProfile,
};
