// apps/mobile/features/reels/reelUtils.js

export function isValidReel(reel) {
  return Boolean(
    reel &&
    (reel.id || reel.reelId) &&
    (reel.videoUrl || reel.video?.url || reel.url),
  );
}

export function getReelId(reel) {
  return reel?.id || reel?.reelId || null;
}

export function getReelUrl(reel) {
  return reel?.videoUrl || reel?.video?.url || reel?.url || null;
}

export function getReelType(reel) {
  return reel?.type || "video";
}

export function getReelAudience(reel) {
  return reel?.audience || "everyone";
}

export function getReelStatus(reel) {
  return reel?.status || "published";
}

export function getReelTypeLabel(type) {
  const labels = {
    video: "Video",
  };

  return labels[type] || "Video";
}

export function getReelAudienceLabel(audience) {
  const labels = {
    everyone: "Everyone",
    followers: "Followers",
    only_me: "Only me",
  };

  return labels[audience] || "Everyone";
}

export function getReelStatusLabel(status) {
  const labels = {
    draft: "Draft",
    processing: "Processing",
    published: "Published",
    archived: "Archived",
    deleted: "Deleted",
    failed: "Failed",
  };

  return labels[status] || "Published";
}

export function extractHashtags(text = "") {
  return [
    ...new Set(
      String(text)
        .match(/#[\p{L}\p{N}_]+/gu)
        ?.map((tag) => tag.slice(1).toLowerCase()) || [],
    ),
  ];
}

export function extractMentions(text = "") {
  return [
    ...new Set(
      String(text)
        .match(/@[\p{L}\p{N}._]+/gu)
        ?.map((mention) => mention.slice(1)) || [],
    ),
  ];
}

export function buildReelPayload(data = {}) {
  return {
    caption: String(data.caption || "").trim(),
    audience: data.audience || "everyone",
    videoUrl: data.videoUrl || data.video?.url || data.url || null,
    thumbnail: data.thumbnail || data.thumbnailUrl || null,
    duration: Number(data.duration || 0),
    hashtags: data.hashtags || extractHashtags(data.caption || ""),
    mentions: data.mentions || extractMentions(data.caption || ""),
  };
}

export function calculateReelEngagement(reel = {}) {
  const views = Number(reel.viewsCount || reel.views || 0);

  if (views <= 0) return 0;

  const likes = Number(reel.likesCount || reel.likes || 0);
  const comments = Number(reel.commentsCount || reel.comments || 0);
  const shares = Number(reel.sharesCount || reel.shares || 0);
  const reposts = Number(reel.repostsCount || reel.reposts || 0);
  const saves = Number(reel.savesCount || reel.saves || 0);

  return ((likes + comments + shares + reposts + saves) / views) * 100;
}

export function mergeReel(reel, updates = {}) {
  return {
    ...reel,
    ...updates,
  };
}

export function updateReelEngagement(reel, type, increment = true) {
  const fields = {
    like: "likesCount",
    comment: "commentsCount",
    share: "sharesCount",
    repost: "repostsCount",
    save: "savesCount",
    view: "viewsCount",
  };

  const field = fields[type];

  if (!field) return reel;

  const current = Number(reel?.[field] || 0);

  return {
    ...reel,
    [field]: Math.max(0, current + (increment ? 1 : -1)),
  };
}

export default {
  isValidReel,
  getReelId,
  getReelUrl,
  getReelType,
  getReelAudience,
  getReelStatus,
  getReelTypeLabel,
  getReelAudienceLabel,
  getReelStatusLabel,
  extractHashtags,
  extractMentions,
  buildReelPayload,
  calculateReelEngagement,
  mergeReel,
  updateReelEngagement,
};
