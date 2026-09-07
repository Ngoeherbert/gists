import { POST_TYPES, POST_AUDIENCE, REACTION_TYPES } from "./postConstants";

export function isValidPostType(type) {
  return Object.values(POST_TYPES).includes(type);
}

export function isValidPostAudience(audience) {
  return Object.values(POST_AUDIENCE).includes(audience);
}

export function isValidReactionType(reaction) {
  return Object.values(REACTION_TYPES).includes(reaction);
}

export function getPostTypeLabel(type) {
  const labels = {
    [POST_TYPES.TEXT]: "Text",
    [POST_TYPES.IMAGE]: "Photo",
    [POST_TYPES.VIDEO]: "Video",
    [POST_TYPES.MIXED]: "Post",
  };

  return labels[type] || "Post";
}

export function getAudienceLabel(audience) {
  const labels = {
    [POST_AUDIENCE.EVERYONE]: "Everyone",
    [POST_AUDIENCE.FOLLOWERS]: "Followers",
    [POST_AUDIENCE.CLOSE_FRIENDS]: "Close Friends",
    [POST_AUDIENCE.ONLY_ME]: "Only Me",
  };

  return labels[audience] || "Everyone";
}

export function getReactionLabel(reaction) {
  const labels = {
    [REACTION_TYPES.LIKE]: "Like",
    [REACTION_TYPES.LOVE]: "Love",
    [REACTION_TYPES.LAUGH]: "Laugh",
    [REACTION_TYPES.WOW]: "Wow",
    [REACTION_TYPES.SAD]: "Sad",
    [REACTION_TYPES.ANGRY]: "Angry",
  };

  return labels[reaction] || "Like";
}

export function getPostId(post) {
  return post?.id || post?._id || null;
}

export function getPostUrl(post) {
  return post?.url || post?.permalink || null;
}

export function getMediaType(media) {
  if (!media) return null;

  const type = String(media.type || media.mimeType || "").toLowerCase();

  if (type.includes("video")) {
    return POST_TYPES.VIDEO;
  }

  if (type.includes("image") || type === "photo") {
    return POST_TYPES.IMAGE;
  }

  return null;
}

export function detectPostType(media = [], caption = "") {
  const items = Array.isArray(media) ? media : media ? [media] : [];

  if (items.length === 0) {
    return caption.trim() ? POST_TYPES.TEXT : null;
  }

  const types = items.map(getMediaType);

  const hasVideo = types.includes(POST_TYPES.VIDEO);

  const hasImage = types.includes(POST_TYPES.IMAGE);

  if (hasVideo) {
    return hasImage || items.length > 1 ? POST_TYPES.MIXED : POST_TYPES.VIDEO;
  }

  return POST_TYPES.IMAGE;
}

export function extractHashtags(text = "") {
  const matches = String(text).match(/#[\p{L}\p{N}_]+/gu);

  if (!matches) return [];

  return [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))];
}

export function extractMentions(text = "") {
  const matches = String(text).match(/@[\p{L}\p{N}_.]+/gu);

  if (!matches) return [];

  return [...new Set(matches.map((mention) => mention.slice(1)))];
}

export function createPostPayload({
  caption = "",
  media = [],
  audience = POST_AUDIENCE.EVERYONE,
  location = null,
  hashtags,
  mentions,
} = {}) {
  const normalizedMedia = Array.isArray(media) ? media : media ? [media] : [];

  return {
    caption: String(caption).trim(),
    media: normalizedMedia,
    audience,
    location,
    hashtags: hashtags || extractHashtags(caption),
    mentions: mentions || extractMentions(caption),
    type: detectPostType(normalizedMedia, String(caption)),
  };
}

export function calculateEngagementRate(post) {
  const stats = {
    likes: Number(post?.likesCount || post?.likeCount || 0),
    comments: Number(post?.commentsCount || post?.commentCount || 0),
    reposts: Number(post?.repostsCount || post?.repostCount || 0),
    shares: Number(post?.sharesCount || post?.shareCount || 0),
    views: Number(post?.viewsCount || post?.viewCount || 0),
  };

  if (stats.views <= 0) return 0;

  return (
    ((stats.likes + stats.comments + stats.reposts + stats.shares) /
      stats.views) *
    100
  );
}

export function mergePostUpdates(post, updates = {}) {
  return {
    ...post,
    ...updates,
    stats: {
      ...(post?.stats || {}),
      ...(updates?.stats || {}),
    },
  };
}

export default {
  isValidPostType,
  isValidPostAudience,
  isValidReactionType,
  getPostTypeLabel,
  getAudienceLabel,
  getReactionLabel,
  getPostId,
  getPostUrl,
  getMediaType,
  detectPostType,
  extractHashtags,
  extractMentions,
  createPostPayload,
  calculateEngagementRate,
  mergePostUpdates,
};
