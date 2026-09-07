// apps/mobile/features/stories/storyFormatter.js

import { formatNumber } from "../../utils/formatNumber";
import { formatTime } from "../../utils/formatTime";
import { formatDate } from "../../utils/formatDate";

export function formatStory(story = {}) {
  return {
    ...story,
    id: story.id || story.storyId || null,
    type: story.type || "image",
    mediaUrl:
      story.mediaUrl ||
      story.media?.url ||
      story.imageUrl ||
      story.videoUrl ||
      null,
    thumbnail:
      story.thumbnail || story.thumbnailUrl || story.media?.thumbnail || null,
    text: story.text || "",
    caption: story.caption || "",
    duration: Number(story.duration || 0),
    author: story.author || story.user || null,
    viewsCount: Number(story.viewsCount || story.views || 0),
    repliesCount: Number(story.repliesCount || story.replies || 0),
    reactionsCount: Number(story.reactionsCount || story.reactions || 0),
    isViewed: Boolean(story.isViewed || story.viewed),
    isReacted: Boolean(story.isReacted || story.reacted),
  };
}

export function formatStories(stories = []) {
  return stories.map(formatStory);
}

export function formatStoryId(story) {
  return story?.id || story?.storyId || null;
}

export function formatStoryAuthor(story) {
  return story?.author || story?.user || null;
}

export function formatStoryDuration(story) {
  return formatTime(Number(story?.duration || 0));
}

export function formatStoryStats(story = {}) {
  return {
    views: Number(story.viewsCount || story.views || 0),
    replies: Number(story.repliesCount || story.replies || 0),
    reactions: Number(story.reactionsCount || story.reactions || 0),
  };
}

export function formatStoryStatCount(value) {
  return formatNumber(Number(value || 0));
}

export function formatStoryDate(date) {
  return date ? formatDate(date) : "";
}

export function formatStoryPreview(story, maxLength = 100) {
  const text = String(story?.text || story?.caption || "").trim();

  if (!text) return "";

  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 3).trim()}...`;
}

export default {
  formatStory,
  formatStories,
  formatStoryId,
  formatStoryAuthor,
  formatStoryDuration,
  formatStoryStats,
  formatStoryStatCount,
  formatStoryDate,
  formatStoryPreview,
};
