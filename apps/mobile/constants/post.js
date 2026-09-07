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

export const POST_ACTIONS = {
  LIKE: "like",
  COMMENT: "comment",
  REPOST: "repost",
  SHARE: "share",
  SAVE: "save",
};

export const POST_LIMITS = {
  MAX_CAPTION_LENGTH: 2200,
  MAX_IMAGES: 10,
  MAX_HASHTAGS: 30,
  MAX_MENTIONS: 50,
};

export const REACTION_TYPES = {
  LIKE: "like",
  LOVE: "love",
  LAUGH: "laugh",
  WOW: "wow",
  SAD: "sad",
  ANGRY: "angry",
};

export default {
  POST_TYPES,
  POST_AUDIENCE,
  POST_ACTIONS,
  POST_LIMITS,
  REACTION_TYPES,
};
