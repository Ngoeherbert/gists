import {
  VERIFICATION_LEVELS,
  VERIFICATION_STATUS,
} from "./verificationConstants";

export function getBadgeLevel(profile = {}) {
  return (
    profile.verificationLevel ||
    profile.verification_level ||
    (profile.verified ? VERIFICATION_LEVELS.VERIFIED : VERIFICATION_LEVELS.NONE)
  );
}

export function isVerified(profile = {}) {
  return Boolean(
    profile.verified ||
    profile.isVerified ||
    profile.is_verified ||
    getBadgeLevel(profile) !== VERIFICATION_LEVELS.NONE,
  );
}

export function isPremiumVerified(profile = {}) {
  return getBadgeLevel(profile) === VERIFICATION_LEVELS.PREMIUM;
}

export function isBasicVerified(profile = {}) {
  return getBadgeLevel(profile) === VERIFICATION_LEVELS.BASIC;
}

export function isVerificationPending(profile = {}) {
  return (
    profile.verificationStatus === VERIFICATION_STATUS.PENDING ||
    profile.verificationStatus === VERIFICATION_STATUS.IN_REVIEW ||
    profile.verification_status === VERIFICATION_STATUS.PENDING ||
    profile.verification_status === VERIFICATION_STATUS.IN_REVIEW
  );
}

export function getBadgeLabel(profile = {}) {
  const level = getBadgeLevel(profile);

  switch (level) {
    case VERIFICATION_LEVELS.PREMIUM:
      return "Premium Verified";
    case VERIFICATION_LEVELS.VERIFIED:
      return "Verified";
    case VERIFICATION_LEVELS.BASIC:
      return "Basic Verified";
    default:
      return "";
  }
}

export function getBadgeIcon(profile = {}) {
  if (!isVerified(profile)) return null;

  return profile.badgeIcon || "✓";
}

export function shouldShowBadge(profile = {}) {
  return isVerified(profile) && !profile.hideVerificationBadge;
}

export function normalizeBadge(profile = {}) {
  return {
    verified: isVerified(profile),
    level: getBadgeLevel(profile),
    label: getBadgeLabel(profile),
    icon: getBadgeIcon(profile),
    pending: isVerificationPending(profile),
    visible: shouldShowBadge(profile),
  };
}

export default {
  getBadgeLevel,
  isVerified,
  isPremiumVerified,
  isBasicVerified,
  isVerificationPending,
  getBadgeLabel,
  getBadgeIcon,
  shouldShowBadge,
  normalizeBadge,
};
