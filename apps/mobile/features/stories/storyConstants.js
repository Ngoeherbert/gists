// apps/mobile/features/stories/storyConstants.js

export const STORY_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  TEXT: "text",
};

export const STORY_AUDIENCE = {
  EVERYONE: "everyone",
  CLOSE_FRIENDS: "close_friends",
  CUSTOM: "custom",
};

export const STORY_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  ARCHIVED: "archived",
  DELETED: "deleted",
};

export const STORY_ACTIONS = {
  VIEW: "view",
  REPLY: "reply",
  SHARE: "share",
  REACT: "react",
  REPORT: "report",
  DELETE: "delete",
};

export const STORY_REACTION_TYPES = {
  LIKE: "like",
  LOVE: "love",
  LAUGH: "laugh",
  WOW: "wow",
  SAD: "sad",
  ANGRY: "angry",
};

export const STORY_ERRORS = {
  INVALID_STORY: "INVALID_STORY",
  STORY_NOT_FOUND: "STORY_NOT_FOUND",
  EXPIRED_STORY: "EXPIRED_STORY",
  INVALID_MEDIA: "INVALID_MEDIA",
  MEDIA_TOO_LARGE: "MEDIA_TOO_LARGE",
  VIDEO_TOO_LONG: "VIDEO_TOO_LONG",
  CAPTION_TOO_LONG: "CAPTION_TOO_LONG",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
};

export const STORY_LIMITS = {
  MAX_DURATION: 60,
  IMAGE_DURATION: 5,
  MAX_TEXT_LENGTH: 500,
  MAX_CAPTION_LENGTH: 500,
  MAX_MENTIONS: 20,
  MAX_HASHTAGS: 20,
  MAX_CUSTOM_AUDIENCE: 500,
  MAX_MEDIA_SIZE: 50 * 1024 * 1024,
};

export const STORY_EXPIRY = 24 * 60 * 60 * 1000;

export default {
  STORY_TYPES,
  STORY_AUDIENCE,
  STORY_STATUS,
  STORY_ACTIONS,
  STORY_REACTION_TYPES,
  STORY_ERRORS,
  STORY_LIMITS,
  STORY_EXPIRY,
};
