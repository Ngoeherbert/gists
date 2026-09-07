// apps/mobile/features/profiles/profileValidation.js

import { PROFILE_LIMITS, PROFILE_VISIBILITY } from "./profileConstants";

export function validateProfileId(id) {
  return Boolean(id && typeof id === "string" && id.trim().length > 0);
}

export function validateUsername(username) {
  if (!username || typeof username !== "string") return false;

  const value = username.replace(/^@/, "").trim();

  if (
    value.length < PROFILE_LIMITS.MIN_USERNAME_LENGTH ||
    value.length > PROFILE_LIMITS.MAX_USERNAME_LENGTH
  ) {
    return false;
  }

  return /^[a-zA-Z0-9._]+$/.test(value);
}

export function validateDisplayName(displayName) {
  if (displayName === undefined || displayName === null) return false;

  const value = String(displayName).trim();

  return (
    value.length > 0 && value.length <= PROFILE_LIMITS.MAX_DISPLAY_NAME_LENGTH
  );
}

export function validateBio(bio) {
  if (bio === undefined || bio === null) return true;

  return String(bio).length <= PROFILE_LIMITS.MAX_BIO_LENGTH;
}

export function validateWebsite(website) {
  if (!website) return true;

  const value = String(website).trim();

  if (value.length > PROFILE_LIMITS.MAX_WEBSITE_LENGTH) return false;

  return /^(https?:\/\/)?([\w-]+\.)+[\w-]+([/?#].*)?$/i.test(value);
}

export function validateLocation(location) {
  if (!location) return true;

  return String(location).length <= PROFILE_LIMITS.MAX_LOCATION_LENGTH;
}

export function validateVisibility(visibility) {
  return Object.values(PROFILE_VISIBILITY).includes(visibility);
}

export function validateInterests(interests) {
  if (!Array.isArray(interests)) return false;

  return interests.length <= PROFILE_LIMITS.MAX_INTERESTS;
}

export function validateProfileUpdate(data = {}) {
  const errors = {};

  if (data.username !== undefined && !validateUsername(data.username)) {
    errors.username = "Invalid username.";
  }

  if (
    data.displayName !== undefined &&
    !validateDisplayName(data.displayName)
  ) {
    errors.displayName = "Invalid display name.";
  }

  if (data.bio !== undefined && !validateBio(data.bio)) {
    errors.bio = "Bio is too long.";
  }

  if (data.website !== undefined && !validateWebsite(data.website)) {
    errors.website = "Invalid website.";
  }

  if (data.location !== undefined && !validateLocation(data.location)) {
    errors.location = "Location is too long.";
  }

  if (data.visibility !== undefined && !validateVisibility(data.visibility)) {
    errors.visibility = "Invalid profile visibility.";
  }

  if (data.interests !== undefined && !validateInterests(data.interests)) {
    errors.interests = "Too many interests.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateFollowUser(userId) {
  return validateProfileId(userId);
}

export function validateProfileSearch(query) {
  if (query === undefined || query === null) return false;

  return String(query).trim().length > 0;
}

export function hasProfileValidationErrors(result) {
  return Boolean(result && !result.valid);
}

export default {
  validateProfileId,
  validateUsername,
  validateDisplayName,
  validateBio,
  validateWebsite,
  validateLocation,
  validateVisibility,
  validateInterests,
  validateProfileUpdate,
  validateFollowUser,
  validateProfileSearch,
  hasProfileValidationErrors,
};
