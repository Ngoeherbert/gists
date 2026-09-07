export const REEL_TYPES = {
  VIDEO: "video",
};

export const REEL_AUDIENCE = {
  EVERYONE: "everyone",
  FOLLOWERS: "followers",
  ONLY_ME: "only_me",
};

export const REEL_LIMITS = {
  MAX_DURATION: 90,
  MAX_CAPTION_LENGTH: 2200,
  MAX_HASHTAGS: 30,
  MAX_MENTIONS: 50,
};

export const REEL_ACTIONS = {
  LIKE: "like",
  COMMENT: "comment",
  REPOST: "repost",
  SHARE: "share",
  SAVE: "save",
};

export const VIDEO_FILTERS = {
  NONE: "none",
  VIVID: "vivid",
  WARM: "warm",
  COOL: "cool",
  VINTAGE: "vintage",
  BLACK_WHITE: "black_white",
};

export const REEL_PLAYBACK = {
  AUTOPLAY: true,
  LOOP: true,
  DEFAULT_MUTED: false,
};

export default {
  REEL_TYPES,
  REEL_AUDIENCE,
  REEL_LIMITS,
  REEL_ACTIONS,
  VIDEO_FILTERS,
  REEL_PLAYBACK,
};
