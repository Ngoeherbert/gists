// apps/mobile/features/reels/reelHelpers.js

export function getReelId(reel) {
  return reel?.id || reel?.reelId || null;
}

export function getReelAuthor(reel) {
  return reel?.author || reel?.user || null;
}

export function getReelAuthorId(reel) {
  const author = getReelAuthor(reel);

  return author?.id || author?.userId || reel?.userId || null;
}

export function getReelVideoUrl(reel) {
  return reel?.videoUrl || reel?.video?.url || reel?.url || null;
}

export function getReelThumbnail(reel) {
  return (
    reel?.thumbnail ||
    reel?.thumbnailUrl ||
    reel?.cover ||
    reel?.video?.thumbnail ||
    null
  );
}

export function getReelCaption(reel) {
  return reel?.caption || "";
}

export function getReelDuration(reel) {
  return Number(reel?.duration || 0);
}

export function getReelStats(reel = {}) {
  return {
    likes: Number(reel.likesCount || reel.likes || 0),
    comments: Number(reel.commentsCount || reel.comments || 0),
    shares: Number(reel.sharesCount || reel.shares || 0),
    views: Number(reel.viewsCount || reel.views || 0),
    reposts: Number(reel.repostsCount || reel.reposts || 0),
    saves: Number(reel.savesCount || reel.saves || 0),
  };
}

export function isReelLiked(reel) {
  return Boolean(reel?.isLiked || reel?.liked);
}

export function isReelSaved(reel) {
  return Boolean(reel?.isSaved || reel?.saved);
}

export function isReelReposted(reel) {
  return Boolean(reel?.isReposted || reel?.reposted);
}

export function isReelOwnedBy(reel, userId) {
  return Boolean(userId && getReelAuthorId(reel) === userId);
}

export function isReelDraft(reel) {
  return reel?.status === "draft";
}

export function isReelPublished(reel) {
  return reel?.status === "published";
}

export function isReelProcessing(reel) {
  return reel?.status === "processing";
}

export function isReelDeleted(reel) {
  return reel?.status === "deleted";
}

export function canPlayReel(reel) {
  return Boolean(getReelVideoUrl(reel) && !isReelDeleted(reel));
}

export function getReelHashtags(reel) {
  if (Array.isArray(reel?.hashtags)) return reel.hashtags;

  const caption = getReelCaption(reel);

  return caption.match(/#[\w]+/g) || [];
}

export function getReelMentions(reel) {
  if (Array.isArray(reel?.mentions)) return reel.mentions;

  const caption = getReelCaption(reel);

  return caption.match(/@[\w.]+/g) || [];
}

export function sortReels(reels = [], key = "createdAt") {
  return [...reels].sort((a, b) => {
    const first = new Date(a?.[key] || 0).getTime();
    const second = new Date(b?.[key] || 0).getTime();

    return second - first;
  });
}

export function filterReelsByAuthor(reels = [], userId) {
  if (!userId) return reels;

  return reels.filter((reel) => getReelAuthorId(reel) === userId);
}

export function filterReelsByQuery(reels = [], query = "") {
  const normalizedQuery = String(query).trim().toLowerCase();

  if (!normalizedQuery) return reels;

  return reels.filter((reel) => {
    const caption = getReelCaption(reel).toLowerCase();
    const author = getReelAuthor(reel);
    const username = String(author?.username || "").toLowerCase();
    const displayName = String(
      author?.displayName || author?.name || "",
    ).toLowerCase();

    return (
      caption.includes(normalizedQuery) ||
      username.includes(normalizedQuery) ||
      displayName.includes(normalizedQuery)
    );
  });
}

export default {
  getReelId,
  getReelAuthor,
  getReelAuthorId,
  getReelVideoUrl,
  getReelThumbnail,
  getReelCaption,
  getReelDuration,
  getReelStats,
  isReelLiked,
  isReelSaved,
  isReelReposted,
  isReelOwnedBy,
  isReelDraft,
  isReelPublished,
  isReelProcessing,
  isReelDeleted,
  canPlayReel,
  getReelHashtags,
  getReelMentions,
  sortReels,
  filterReelsByAuthor,
  filterReelsByQuery,
};
