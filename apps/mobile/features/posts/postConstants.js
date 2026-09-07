export const POST_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  MIXED: "mixed",
};

export const POST_AUDIENCE = {
  EVERYONE: "everyone",
  FOLLOWERS: "followers",
  CLOSE_FRIENDS: "close_friends",
  ONLY_ME: "only_me",
};

export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  DELETED: "deleted",
};

export const POST_ACTIONS = {
  LIKE: "like",
  COMMENT: "comment",
  REPOST: "repost",
  SHARE: "share",
  SAVE: "save",
  REPORT: "report",
};

export const REACTION_TYPES = {
  LIKE: "like",
  LOVE: "love",
  LAUGH: "laugh",
  WOW: "wow",
  SAD: "sad",
  ANGRY: "angry",
};

export const POST_ERRORS = {
  POST_NOT_FOUND: "POST_NOT_FOUND",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  INVALID_POST: "INVALID_POST",
  CREATE_FAILED: "CREATE_FAILED",
  UPDATE_FAILED: "UPDATE_FAILED",
  DELETE_FAILED: "DELETE_FAILED",
  MEDIA_UPLOAD_FAILED: "MEDIA_UPLOAD_FAILED",
};

export const POST_LIMITS = {
  MAX_CAPTION_LENGTH: 2200,
  MAX_IMAGES: 10,
  MAX_VIDEOS: 1,
  MAX_HASHTAGS: 30,
  MAX_MENTIONS: 50,
  MAX_LOCATION_LENGTH: 200,
};

export default {
  POST_TYPES,
  POST_AUDIENCE,
  POST_STATUS,
  POST_ACTIONS,
  REACTION_TYPES,
  POST_ERRORS,
  POST_LIMITS,
};
