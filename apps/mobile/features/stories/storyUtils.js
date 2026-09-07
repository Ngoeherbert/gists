// apps/mobile/features/stories/storyUtils.js

export function isValidStory(story) {
  return Boolean(
    story &&
    (story.id || story.storyId) &&
    (story.mediaUrl ||
      story.media?.url ||
      story.imageUrl ||
      story.videoUrl ||
      story.text),
  );
}

export function getStoryId(story) {
  return story?.id || story?.storyId || null;
}

export function getStoryType(story) {
  return story?.type || "image";
}

export function getStoryAudience(story) {
  return story?.audience || "everyone";
}

export function getStoryStatus(story) {
  return story?.status || "active";
}

export function getStoryTypeLabel(type) {
  const labels = {
    image: "Image",
    video: "Video",
    text: "Text",
  };

  return labels[type] || "Story";
}

export function getStoryAudienceLabel(audience) {
  const labels = {
    everyone: "Everyone",
    close_friends: "Close Friends",
    custom: "Custom",
  };

  return labels[audience] || "Everyone";
}

export function getStoryStatusLabel(status) {
  const labels = {
    active: "Active",
    expired: "Expired",
    archived: "Archived",
    deleted: "Deleted",
  };

  return labels[status] || "Active";
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

export function calculateStoryDuration(type, duration) {
  if (type === "image" || type === "text") return 5;

  const value = Number(duration || 0);

  return Math.max(1, Math.min(value, 60));
}

export function buildStoryPayload(data = {}) {
  const text = String(data.text || "").trim();
  const caption = String(data.caption || "").trim();

  return {
    type: data.type || "image",
    audience: data.audience || "everyone",
    mediaUrl:
      data.mediaUrl ||
      data.media?.url ||
      data.imageUrl ||
      data.videoUrl ||
      null,
    text,
    caption,
    duration: calculateStoryDuration(data.type || "image", data.duration),
    hashtags: data.hashtags || extractHashtags(`${text} ${caption}`),
    mentions: data.mentions || extractMentions(`${text} ${caption}`),
    customAudience: Array.isArray(data.customAudience)
      ? data.customAudience
      : [],
  };
}

export function normalizeStory(story = {}) {
  return {
    ...story,
    id: story.id || story.storyId || null,
    type: story.type || "image",
    audience: story.audience || "everyone",
    status: story.status || "active",
    mediaUrl:
      story.mediaUrl ||
      story.media?.url ||
      story.imageUrl ||
      story.videoUrl ||
      null,
    text: story.text || "",
    caption: story.caption || "",
    duration: Number(story.duration || 0),
    viewsCount: Number(story.viewsCount || story.views || 0),
    repliesCount: Number(story.repliesCount || story.replies || 0),
    reactionsCount: Number(story.reactionsCount || story.reactions || 0),
    isViewed: Boolean(story.isViewed || story.viewed),
    isReacted: Boolean(story.isReacted || story.reacted),
  };
}

export function normalizeStories(stories = []) {
  return stories.map(normalizeStory);
}

export function mergeStory(story, updates = {}) {
  return {
    ...normalizeStory(story),
    ...updates,
  };
}

export function updateStoryViewCount(story, increment = true) {
  const current = Number(story?.viewsCount || story?.views || 0);

  return {
    ...story,
    viewsCount: Math.max(0, current + (increment ? 1 : -1)),
    isViewed: true,
  };
}

export function updateStoryReactionCount(story, increment = true) {
  const current = Number(story?.reactionsCount || story?.reactions || 0);

  return {
    ...story,
    reactionsCount: Math.max(0, current + (increment ? 1 : -1)),
    isReacted: increment,
  };
}

export default {
  isValidStory,
  getStoryId,
  getStoryType,
  getStoryAudience,
  getStoryStatus,
  getStoryTypeLabel,
  getStoryAudienceLabel,
  getStoryStatusLabel,
  extractHashtags,
  extractMentions,
  calculateStoryDuration,
  buildStoryPayload,
  normalizeStory,
  normalizeStories,
  mergeStory,
  updateStoryViewCount,
  updateStoryReactionCount,
};
