export const DEFAULT_NOTIFICATION_PREFERENCES = {
  push: true,
  email: true,
  inApp: true,

  likes: true,
  comments: true,
  reposts: true,
  follows: true,
  mentions: true,
  replies: true,

  messages: true,
  calls: true,
  roomInvites: true,

  gifts: true,
  subscriptions: true,

  sound: true,
  vibration: true,
};

export function normalizeNotificationPreferences(preferences = {}) {
  return {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...preferences,
  };
}

export function isPreferenceEnabled(preferences, key) {
  const normalized = normalizeNotificationPreferences(preferences);

  return Boolean(normalized[key]);
}

export function setPreference(preferences, key, value) {
  return {
    ...normalizeNotificationPreferences(preferences),
    [key]: Boolean(value),
  };
}

export function togglePreference(preferences, key) {
  return setPreference(
    preferences,
    key,
    !isPreferenceEnabled(preferences, key),
  );
}

export function getEnabledPreferences(preferences) {
  const normalized = normalizeNotificationPreferences(preferences);

  return Object.keys(normalized).filter((key) => normalized[key] === true);
}

export function getDisabledPreferences(preferences) {
  const normalized = normalizeNotificationPreferences(preferences);

  return Object.keys(normalized).filter((key) => normalized[key] === false);
}

export function resetNotificationPreferences() {
  return {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
  };
}

export function mergeNotificationPreferences(current = {}, updates = {}) {
  return {
    ...normalizeNotificationPreferences(current),
    ...updates,
  };
}

export function isNotificationTypeEnabled(preferences, type) {
  const mapping = {
    like: "likes",
    comment: "comments",
    repost: "reposts",
    follow: "follows",
    follow_request: "follows",
    mention: "mentions",
    reply: "replies",
    message: "messages",
    call: "calls",
    room_invite: "roomInvites",
    gift: "gifts",
    subscription: "subscriptions",
  };

  const key = mapping[type];

  if (!key) return true;

  return isPreferenceEnabled(preferences, key);
}

export default {
  DEFAULT_NOTIFICATION_PREFERENCES,
  normalizeNotificationPreferences,
  isPreferenceEnabled,
  setPreference,
  togglePreference,
  getEnabledPreferences,
  getDisabledPreferences,
  resetNotificationPreferences,
  mergeNotificationPreferences,
  isNotificationTypeEnabled,
};
