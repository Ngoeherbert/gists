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

export const STORY_LIMITS = {
  MAX_DURATION: 60,
  IMAGE_DURATION: 5,
  MAX_TEXT_LENGTH: 500,
  MAX_MENTIONS: 20,
  MAX_HASHTAGS: 20,
};

export const STORY_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  ARCHIVED: "archived",
};

export const STORY_ACTIONS = {
  REPLY: "reply",
  SHARE: "share",
  REACT: "react",
  REPORT: "report",
};

export const STORY_EXPIRY = 24 * 60 * 60 * 1000;

export default {
  STORY_TYPES,
  STORY_AUDIENCE,
  STORY_LIMITS,
  STORY_STATUS,
  STORY_ACTIONS,
  STORY_EXPIRY,
};
