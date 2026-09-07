// apps/mobile/features/reels/reelPermissions.js

export function canViewReel(reel, currentUserId) {
  if (!reel || reel.status === "deleted") return false;

  const ownerId = reel.userId || reel.author?.id || reel.author?.userId;

  if (ownerId && ownerId === currentUserId) return true;

  if (reel.audience === "only_me") return false;

  if (reel.audience === "followers") {
    return Boolean(reel.isFollowingAuthor || reel.isFollowing);
  }

  return true;
}

export function canCreateReel(user) {
  return Boolean(user && !user.isBlocked && !user.isSuspended);
}

export function canEditReel(reel, currentUserId) {
  if (!reel || !currentUserId) return false;

  const ownerId = reel.userId || reel.author?.id || reel.author?.userId;

  return ownerId === currentUserId && reel.status !== "deleted";
}

export function canDeleteReel(reel, currentUserId) {
  return canEditReel(reel, currentUserId);
}

export function canLikeReel(reel, currentUserId) {
  if (!canViewReel(reel, currentUserId)) return false;

  return !reel?.isLiked && !reel?.liked;
}

export function canUnlikeReel(reel, currentUserId) {
  if (!canViewReel(reel, currentUserId)) return false;

  return Boolean(reel?.isLiked || reel?.liked);
}

export function canSaveReel(reel, currentUserId) {
  return canViewReel(reel, currentUserId);
}

export function canUnsaveReel(reel, currentUserId) {
  return canViewReel(reel, currentUserId);
}

export function canCommentOnReel(reel, currentUserId) {
  return canViewReel(reel, currentUserId);
}

export function canShareReel(reel, currentUserId) {
  return canViewReel(reel, currentUserId);
}

export function canRepostReel(reel, currentUserId) {
  return canViewReel(reel, currentUserId);
}

export function canReportReel(reel, currentUserId) {
  if (!reel || !currentUserId) return false;

  const ownerId = reel.userId || reel.author?.id || reel.author?.userId;

  return ownerId !== currentUserId;
}

export default {
  canViewReel,
  canCreateReel,
  canEditReel,
  canDeleteReel,
  canLikeReel,
  canUnlikeReel,
  canSaveReel,
  canUnsaveReel,
  canCommentOnReel,
  canShareReel,
  canRepostReel,
  canReportReel,
};
