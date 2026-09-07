import { POST_TYPES, POST_AUDIENCE, POST_LIMITS } from "./postConstants";

export function validatePostId(postId) {
  if (!postId) {
    return "Post ID is required.";
  }

  return null;
}

export function validateCaption(caption = "") {
  const value = String(caption || "").trim();

  if (value.length > POST_LIMITS.MAX_CAPTION_LENGTH) {
    return `Caption cannot exceed ${POST_LIMITS.MAX_CAPTION_LENGTH} characters.`;
  }

  return null;
}

export function validatePostType(type) {
  if (!Object.values(POST_TYPES).includes(type)) {
    return "Invalid post type.";
  }

  return null;
}

export function validateAudience(audience) {
  if (!Object.values(POST_AUDIENCE).includes(audience)) {
    return "Invalid audience.";
  }

  return null;
}

export function validateMedia(media = []) {
  const items = Array.isArray(media) ? media : media ? [media] : [];

  if (items.length > POST_LIMITS.MAX_IMAGES) {
    return `A post cannot contain more than ${POST_LIMITS.MAX_IMAGES} media items.`;
  }

  const videoCount = items.filter((item) =>
    String(item?.type || item?.mimeType || "")
      .toLowerCase()
      .includes("video"),
  ).length;

  if (videoCount > POST_LIMITS.MAX_VIDEOS) {
    return "A post can contain only one video.";
  }

  return null;
}

export function validateHashtags(hashtags = []) {
  if (!Array.isArray(hashtags)) {
    return "Hashtags must be an array.";
  }

  if (hashtags.length > POST_LIMITS.MAX_HASHTAGS) {
    return `You can use up to ${POST_LIMITS.MAX_HASHTAGS} hashtags.`;
  }

  return null;
}

export function validateMentions(mentions = []) {
  if (!Array.isArray(mentions)) {
    return "Mentions must be an array.";
  }

  if (mentions.length > POST_LIMITS.MAX_MENTIONS) {
    return `You can mention up to ${POST_LIMITS.MAX_MENTIONS} users.`;
  }

  return null;
}

export function validateLocation(location) {
  if (!location) return null;

  const value = typeof location === "string" ? location : location?.name || "";

  if (value.length > POST_LIMITS.MAX_LOCATION_LENGTH) {
    return `Location cannot exceed ${POST_LIMITS.MAX_LOCATION_LENGTH} characters.`;
  }

  return null;
}

export function validateCreatePost(data = {}) {
  const errors = {};

  const captionError = validateCaption(data.caption);

  if (captionError) {
    errors.caption = captionError;
  }

  const audienceError = validateAudience(
    data.audience || POST_AUDIENCE.EVERYONE,
  );

  if (audienceError) {
    errors.audience = audienceError;
  }

  const mediaError = validateMedia(data.media);

  if (mediaError) {
    errors.media = mediaError;
  }

  if (data.type) {
    const typeError = validatePostType(data.type);

    if (typeError) {
      errors.type = typeError;
    }
  }

  if (data.hashtags) {
    const hashtagError = validateHashtags(data.hashtags);

    if (hashtagError) {
      errors.hashtags = hashtagError;
    }
  }

  if (data.mentions) {
    const mentionError = validateMentions(data.mentions);

    if (mentionError) {
      errors.mentions = mentionError;
    }
  }

  if (data.location) {
    const locationError = validateLocation(data.location);

    if (locationError) {
      errors.location = locationError;
    }
  }

  if (
    !String(data.caption || "").trim() &&
    (!data.media || data.media.length === 0)
  ) {
    errors.content = "Add text or media to create a post.";
  }

  return errors;
}

export function validateUpdatePost(data = {}) {
  const errors = {};

  if (data.postId) {
    const postIdError = validatePostId(data.postId);

    if (postIdError) {
      errors.postId = postIdError;
    }
  }

  if (data.caption !== undefined) {
    const captionError = validateCaption(data.caption);

    if (captionError) {
      errors.caption = captionError;
    }
  }

  if (data.audience !== undefined) {
    const audienceError = validateAudience(data.audience);

    if (audienceError) {
      errors.audience = audienceError;
    }
  }

  if (data.media !== undefined) {
    const mediaError = validateMedia(data.media);

    if (mediaError) {
      errors.media = mediaError;
    }
  }

  return errors;
}

export function hasValidationErrors(errors = {}) {
  return Object.keys(errors).length > 0;
}

export function isCreatePostValid(data = {}) {
  return !hasValidationErrors(validateCreatePost(data));
}

export function isUpdatePostValid(data = {}) {
  return !hasValidationErrors(validateUpdatePost(data));
}

export default {
  validatePostId,
  validateCaption,
  validatePostType,
  validateAudience,
  validateMedia,
  validateHashtags,
  validateMentions,
  validateLocation,
  validateCreatePost,
  validateUpdatePost,
  hasValidationErrors,
  isCreatePostValid,
  isUpdatePostValid,
};
