// apps/mobile/features/reels/reelValidation.js

import { REEL_AUDIENCE, REEL_LIMITS, REEL_TYPES } from "./reelConstants";

export function validateReelId(id) {
  return Boolean(id && typeof id === "string" && id.trim());
}

export function validateVideo(video) {
  if (!video) return false;

  const uri = video.uri || video.url;

  if (!uri) return false;

  if (video.size && Number(video.size) > REEL_LIMITS.MAX_VIDEO_SIZE) {
    return false;
  }

  return true;
}

export function validateReelDuration(duration) {
  const value = Number(duration);

  return (
    Number.isFinite(value) && value >= 1 && value <= REEL_LIMITS.MAX_DURATION
  );
}

export function validateCaption(caption) {
  if (caption === undefined || caption === null) return true;

  return String(caption).length <= REEL_LIMITS.MAX_CAPTION_LENGTH;
}

export function validateReelType(type) {
  return Object.values(REEL_TYPES).includes(type);
}

export function validateAudience(audience) {
  return Object.values(REEL_AUDIENCE).includes(audience);
}

export function validateHashtags(hashtags) {
  if (hashtags === undefined || hashtags === null) return true;

  if (!Array.isArray(hashtags)) return false;

  if (hashtags.length > REEL_LIMITS.MAX_HASHTAGS) return false;

  return hashtags.every((tag) => {
    const value = String(tag).replace(/^#/, "").trim();

    return value.length > 0 && /^[\p{L}\p{N}_]+$/u.test(value);
  });
}

export function validateMentions(mentions) {
  if (mentions === undefined || mentions === null) return true;

  if (!Array.isArray(mentions)) return false;

  if (mentions.length > REEL_LIMITS.MAX_MENTIONS) return false;

  return mentions.every((mention) => {
    const value = String(mention).replace(/^@/, "").trim();

    return value.length > 0 && /^[a-zA-Z0-9._]+$/.test(value);
  });
}

export function validateCreateReel(data = {}) {
  const errors = {};

  if (!validateVideo(data.video || data.videoUrl || data.url)) {
    errors.video = "A valid video is required.";
  }

  if (data.duration !== undefined && !validateReelDuration(data.duration)) {
    errors.duration = `Reel duration must be between 1 and ${REEL_LIMITS.MAX_DURATION} seconds.`;
  }

  if (data.caption !== undefined && !validateCaption(data.caption)) {
    errors.caption = "Caption is too long.";
  }

  if (data.type !== undefined && !validateReelType(data.type)) {
    errors.type = "Invalid reel type.";
  }

  if (data.audience !== undefined && !validateAudience(data.audience)) {
    errors.audience = "Invalid audience.";
  }

  if (!validateHashtags(data.hashtags)) {
    errors.hashtags = "Invalid hashtags.";
  }

  if (!validateMentions(data.mentions)) {
    errors.mentions = "Invalid mentions.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateReel(data = {}) {
  const errors = {};

  if (data.caption !== undefined && !validateCaption(data.caption)) {
    errors.caption = "Caption is too long.";
  }

  if (data.duration !== undefined && !validateReelDuration(data.duration)) {
    errors.duration = "Invalid reel duration.";
  }

  if (data.audience !== undefined && !validateAudience(data.audience)) {
    errors.audience = "Invalid audience.";
  }

  if (!validateHashtags(data.hashtags)) {
    errors.hashtags = "Invalid hashtags.";
  }

  if (!validateMentions(data.mentions)) {
    errors.mentions = "Invalid mentions.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function hasReelValidationErrors(result) {
  return Boolean(result && !result.valid);
}

export default {
  validateReelId,
  validateVideo,
  validateReelDuration,
  validateCaption,
  validateReelType,
  validateAudience,
  validateHashtags,
  validateMentions,
  validateCreateReel,
  validateUpdateReel,
  hasReelValidationErrors,
};
