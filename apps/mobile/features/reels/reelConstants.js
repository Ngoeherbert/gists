// apps/mobile/features/reels/reelConstants.js

export const REEL_TYPES = {
  VIDEO: "video",
};

export const REEL_AUDIENCE = {
  EVERYONE: "everyone",
  FOLLOWERS: "followers",
  ONLY_ME: "only_me",
};

export const REEL_STATUS = {
  DRAFT: "draft",
  PROCESSING: "processing",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  DELETED: "deleted",
  FAILED: "failed",
};

export const REEL_ACTIONS = {
  LIKE: "like",
  COMMENT: "comment",
  REPOST: "repost",
  SHARE: "share",
  SAVE: "save",
  REPORT: "report",
  DELETE: "delete",
  EDIT: "edit",
};

export const REEL_ERRORS = {
  INVALID_REEL: "INVALID_REEL",
  REEL_NOT_FOUND: "REEL_NOT_FOUND",
  INVALID_VIDEO: "INVALID_VIDEO",
  VIDEO_TOO_LARGE: "VIDEO_TOO_LARGE",
  VIDEO_TOO_LONG: "VIDEO_TOO_LONG",
  UPLOAD_FAILED: "UPLOAD_FAILED",
  PROCESSING_FAILED: "PROCESSING_FAILED",
  ALREADY_LIKED: "ALREADY_LIKED",
  NOT_LIKED: "NOT_LIKED",
  ALREADY_SAVED: "ALREADY_SAVED",
  NOT_SAVED: "NOT_SAVED",
};

export const REEL_LIMITS = {
  MAX_DURATION: 90,
  MAX_CAPTION_LENGTH: 2200,
  MAX_HASHTAGS: 30,
  MAX_MENTIONS: 50,
  MAX_VIDEO_SIZE: 100 * 1024 * 1024,
};

export const REEL_EDITOR = {
  MIN_DURATION: 1,
  MAX_DURATION: 90,
  MAX_TRIM_POINTS: 2,
  MAX_TEXT_OVERLAYS: 20,
};

export const REEL_PLAYBACK = {
  AUTOPLAY: true,
  LOOP: true,
  DEFAULT_MUTED: false,
};

export const VIDEO_FILTERS = {
  NONE: "none",
  VIVID: "vivid",
  WARM: "warm",
  COOL: "cool",
  VINTAGE: "vintage",
  BLACK_WHITE: "black_white",
};

export default {
  REEL_TYPES,
  REEL_AUDIENCE,
  REEL_STATUS,
  REEL_ACTIONS,
  REEL_ERRORS,
  REEL_LIMITS,
  REEL_EDITOR,
  REEL_PLAYBACK,
  VIDEO_FILTERS,
};
