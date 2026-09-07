// apps/mobile/features/stories/storyHelpers.js

export function getStoryId(story) {
  return story?.id || story?.storyId || null;
}

export function getStoryAuthor(story) {
  return story?.author || story?.user || null;
}

export function getStoryAuthorId(story) {
  const author = getStoryAuthor(story);

  return author?.id || author?.userId || story?.userId || null;
}

export function getStoryAuthorName(story) {
  const author = getStoryAuthor(story);

  return (
    author?.displayName || author?.name || author?.username || "Gists User"
  );
}

export function getStoryAuthorAvatar(story) {
  const author = getStoryAuthor(story);

  return author?.avatar || author?.avatarUrl || null;
}

export function getStoryMediaUrl(story) {
  return (
    story?.mediaUrl ||
    story?.media?.url ||
    story?.imageUrl ||
    story?.videoUrl ||
    null
  );
}

export function getStoryThumbnail(story) {
  return (
    story?.thumbnail || story?.thumbnailUrl || story?.media?.thumbnail || null
  );
}

export function getStoryType(story) {
  return story?.type || "image";
}

export function getStoryText(story) {
  return story?.text || "";
}

export function getStoryCaption(story) {
  return story?.caption || "";
}

export function getStoryDuration(story) {
  return Number(story?.duration || 0);
}

export function getStoryAudience(story) {
  return story?.audience || "everyone";
}

export function getStoryStatus(story) {
  return story?.status || "active";
}

export function isStoryViewed(story) {
  return Boolean(story?.isViewed || story?.viewed);
}

export function isStoryReacted(story) {
  return Boolean(story?.isReacted || story?.reacted);
}

export function isStoryActive(story) {
  return getStoryStatus(story) === "active";
}

export function isStoryExpired(story) {
  if (getStoryStatus(story) === "expired") return true;

  if (!story?.expiresAt) return false;

  return new Date(story.expiresAt).getTime() <= Date.now();
}

export function isStoryOwnedBy(story, userId) {
  return Boolean(userId && getStoryAuthorId(story) === userId);
}

export function isVideoStory(story) {
  return getStoryType(story) === "video";
}

export function isImageStory(story) {
  return getStoryType(story) === "image";
}

export function isTextStory(story) {
  return getStoryType(story) === "text";
}

export function getStoryViewers(story) {
  return Array.isArray(story?.viewers) ? story.viewers : [];
}

export function getStoryReactions(story) {
  return Array.isArray(story?.reactions) ? story.reactions : [];
}

export function getStoryReplies(story) {
  return Array.isArray(story?.replies) ? story.replies : [];
}

export function sortStories(stories = [], key = "createdAt") {
  return [...stories].sort((a, b) => {
    const first = new Date(a?.[key] || 0).getTime();
    const second = new Date(b?.[key] || 0).getTime();

    return second - first;
  });
}

export function filterStoriesByAuthor(stories = [], userId) {
  if (!userId) return stories;

  return stories.filter((story) => getStoryAuthorId(story) === userId);
}

export function getActiveStories(stories = []) {
  return stories.filter(
    (story) => isStoryActive(story) && !isStoryExpired(story),
  );
}

export function getUnviewedStories(stories = []) {
  return stories.filter((story) => !isStoryViewed(story));
}

export default {
  getStoryId,
  getStoryAuthor,
  getStoryAuthorId,
  getStoryAuthorName,
  getStoryAuthorAvatar,
  getStoryMediaUrl,
  getStoryThumbnail,
  getStoryType,
  getStoryText,
  getStoryCaption,
  getStoryDuration,
  getStoryAudience,
  getStoryStatus,
  isStoryViewed,
  isStoryReacted,
  isStoryActive,
  isStoryExpired,
  isStoryOwnedBy,
  isVideoStory,
  isImageStory,
  isTextStory,
  getStoryViewers,
  getStoryReactions,
  getStoryReplies,
  sortStories,
  filterStoriesByAuthor,
  getActiveStories,
  getUnviewedStories,
};
