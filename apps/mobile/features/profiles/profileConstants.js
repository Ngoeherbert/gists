// apps/mobile/features/profiles/profileConstants.js

export const PROFILE_TABS = {
  POSTS: "posts",
  REELS: "reels",
  MEDIA: "media",
  LIKES: "likes",
};

export const PROFILE_ACTIONS = {
  FOLLOW: "follow",
  UNFOLLOW: "unfollow",
  MESSAGE: "message",
  CALL: "call",
  VIDEO_CALL: "video_call",
  BLOCK: "block",
  UNBLOCK: "unblock",
  REPORT: "report",
  SHARE: "share",
  EDIT: "edit",
};

export const PROFILE_RELATIONSHIPS = {
  SELF: "self",
  FOLLOWING: "following",
  FOLLOWER: "follower",
  MUTUAL: "mutual",
  NONE: "none",
  BLOCKED: "blocked",
  BLOCKED_BY: "blocked_by",
};

export const PROFILE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  DELETED: "deleted",
};

export const PROFILE_ERRORS = {
  INVALID_USER: "INVALID_USER",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  ALREADY_FOLLOWING: "ALREADY_FOLLOWING",
  NOT_FOLLOWING: "NOT_FOLLOWING",
  CANNOT_FOLLOW_SELF: "CANNOT_FOLLOW_SELF",
  BLOCKED_USER: "BLOCKED_USER",
  PROFILE_UPDATE_FAILED: "PROFILE_UPDATE_FAILED",
};

export const PROFILE_LIMITS = {
  MAX_BIO_LENGTH: 500,
  MAX_DISPLAY_NAME_LENGTH: 80,
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MAX_WEBSITE_LENGTH: 255,
  MAX_LOCATION_LENGTH: 100,
  MAX_INTERESTS: 20,
};

export const PROFILE_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
};

export default {
  PROFILE_TABS,
  PROFILE_ACTIONS,
  PROFILE_RELATIONSHIPS,
  PROFILE_STATUS,
  PROFILE_ERRORS,
  PROFILE_LIMITS,
  PROFILE_VISIBILITY,
};
