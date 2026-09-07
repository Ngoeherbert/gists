// apps/mobile/features/stories/storyValidation.js

import { STORY_AUDIENCE, STORY_LIMITS, STORY_TYPES } from "./storyConstants";

export function validateStoryId(id) {
  return Boolean(id && typeof id === "string" && id.trim().length > 0);
}

export function validateStoryType(type) {
  return Object.values(STORY_TYPES).includes(type);
}

export function validateStoryAudience(audience) {
  return Object.values(STORY_AUDIENCE).includes(audience);
}

export function validateStoryMedia(media) {
  if (!media) return false;

  const uri = media.uri || media.url;

  if (!uri) return false;

  if (media.size && Number(media.size) > STORY_LIMITS.MAX_MEDIA_SIZE) {
    return false;
  }

  return true;
}

export function validateStoryText(text) {
  if (text === undefined || text === null) return true;

  return String(text).trim().length <= STORY_LIMITS.MAX_TEXT_LENGTH;
}

export function validateStoryCaption(caption) {
  if (caption === undefined || caption === null) return true;

  return String(caption).length <= STORY_LIMITS.MAX_CAPTION_LENGTH;
}

export function validateStoryDuration(type, duration) {
  if (type === "image" || type === "text") {
    return true;
  }

  const value = Number(duration);

  return (
    Number.isFinite(value) && value >= 1 && value <= STORY_LIMITS.MAX_DURATION
  );
}

export function validateStoryHashtags(hashtags) {
  if (hashtags === undefined || hashtags === null) return true;

  if (!Array.isArray(hashtags)) return false;

  if (hashtags.length > STORY_LIMITS.MAX_HASHTAGS) {
    return false;
  }

  return hashtags.every((tag) => {
    const value = String(tag).replace(/^#/, "").trim();

    return value.length > 0 && /^[\p{L}\p{N}_]+$/u.test(value);
  });
}

export function validateStoryMentions(mentions) {
  if (mentions === undefined || mentions === null) return true;

  if (!Array.isArray(mentions)) return false;

  if (mentions.length > STORY_LIMITS.MAX_MENTIONS) {
    return false;
  }

  return mentions.every((mention) => {
    const value = String(mention).replace(/^@/, "").trim();

    return value.length > 0 && /^[a-zA-Z0-9._]+$/.test(value);
  });
}

export function validateCustomAudience(audience) {
  if (audience === undefined || audience === null) {
    return true;
  }

  if (!Array.isArray(audience)) return false;

  return (
    audience.length <= STORY_LIMITS.MAX_CUSTOM_AUDIENCE &&
    audience.every((id) => Boolean(id))
  );
}

export function validateCreateStory(data = {}) {
  const errors = {};
  const type = data.type || "image";

  if (!validateStoryType(type)) {
    errors.type = "Invalid story type.";
  }

  if (data.audience !== undefined && !validateStoryAudience(data.audience)) {
    errors.audience = "Invalid story audience.";
  }

  if (type === "image" || type === "video") {
    if (
      !validateStoryMedia(
        data.media || data.mediaUrl || data.imageUrl || data.videoUrl,
      )
    ) {
      errors.media = "Valid story media is required.";
    }
  }

  if (type === "text" && !String(data.text || "").trim()) {
    errors.text = "Text story content is required.";
  }

  if (!validateStoryText(data.text)) {
    errors.text = "Story text is too long.";
  }

  if (!validateStoryCaption(data.caption)) {
    errors.caption = "Story caption is too long.";
  }

  if (!validateStoryDuration(type, data.duration)) {
    errors.duration = "Invalid story duration.";
  }

  if (!validateStoryHashtags(data.hashtags)) {
    errors.hashtags = "Invalid hashtags.";
  }

  if (!validateStoryMentions(data.mentions)) {
    errors.mentions = "Invalid mentions.";
  }

  if (!validateCustomAudience(data.customAudience)) {
    errors.customAudience = "Invalid custom audience.";
  }

  if (
    data.audience === STORY_AUDIENCE.CUSTOM &&
    (!Array.isArray(data.customAudience) || data.customAudience.length === 0)
  ) {
    errors.customAudience = "Select at least one person for a custom audience.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateStory(data = {}) {
  const errors = {};

  if (data.type !== undefined && !validateStoryType(data.type)) {
    errors.type = "Invalid story type.";
  }

  if (data.audience !== undefined && !validateStoryAudience(data.audience)) {
    errors.audience = "Invalid story audience.";
  }

  if (!validateStoryText(data.text)) {
    errors.text = "Story text is too long.";
  }

  if (!validateStoryCaption(data.caption)) {
    errors.caption = "Story caption is too long.";
  }

  if (data.type === "video" && !validateStoryDuration("video", data.duration)) {
    errors.duration = "Invalid video story duration.";
  }

  if (!validateStoryHashtags(data.hashtags)) {
    errors.hashtags = "Invalid hashtags.";
  }

  if (!validateStoryMentions(data.mentions)) {
    errors.mentions = "Invalid mentions.";
  }

  if (
    data.customAudience !== undefined &&
    !validateCustomAudience(data.customAudience)
  ) {
    errors.customAudience = "Invalid custom audience.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function hasStoryValidationErrors(result) {
  return Boolean(result && !result.valid);
}

export default {
  validateStoryId,
  validateStoryType,
  validateStoryAudience,
  validateStoryMedia,
  validateStoryText,
  validateStoryCaption,
  validateStoryDuration,
  validateStoryHashtags,
  validateStoryMentions,
  validateCustomAudience,
  validateCreateStory,
  validateUpdateStory,
  hasStoryValidationErrors,
};
