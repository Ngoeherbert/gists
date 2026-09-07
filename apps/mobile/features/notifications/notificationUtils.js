import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
} from "./notificationConstants";

export function isValidNotificationType(type) {
  return Object.values(NOTIFICATION_TYPES).includes(type);
}

export function isValidNotificationCategory(category) {
  return Object.values(NOTIFICATION_CATEGORIES).includes(category);
}

export function getNotificationTypeLabel(type) {
  const labels = {
    [NOTIFICATION_TYPES.LIKE]: "Reaction",
    [NOTIFICATION_TYPES.COMMENT]: "Comment",
    [NOTIFICATION_TYPES.REPOST]: "Repost",
    [NOTIFICATION_TYPES.FOLLOW]: "Follow",
    [NOTIFICATION_TYPES.FOLLOW_REQUEST]: "Follow request",
    [NOTIFICATION_TYPES.MENTION]: "Mention",
    [NOTIFICATION_TYPES.REPLY]: "Reply",
    [NOTIFICATION_TYPES.MESSAGE]: "Message",
    [NOTIFICATION_TYPES.CALL]: "Call",
    [NOTIFICATION_TYPES.ROOM_INVITE]: "Room invite",
    [NOTIFICATION_TYPES.GIFT]: "Gift",
    [NOTIFICATION_TYPES.SUBSCRIPTION]: "Subscription",
    [NOTIFICATION_TYPES.SYSTEM]: "System",
  };

  return labels[type] || "Notification";
}

export function getNotificationCategoryLabel(category) {
  const labels = {
    [NOTIFICATION_CATEGORIES.SOCIAL]: "Social",
    [NOTIFICATION_CATEGORIES.MESSAGES]: "Messages",
    [NOTIFICATION_CATEGORIES.CALLS]: "Calls",
    [NOTIFICATION_CATEGORIES.ROOMS]: "Gist Rooms",
    [NOTIFICATION_CATEGORIES.MONETIZATION]: "Monetization",
    [NOTIFICATION_CATEGORIES.SYSTEM]: "System",
  };

  return labels[category] || "Notifications";
}

export function getNotificationPriority(notification) {
  if (
    notification?.type === NOTIFICATION_TYPES.CALL ||
    notification?.type === NOTIFICATION_TYPES.MESSAGE
  ) {
    return "high";
  }

  if (
    notification?.type === NOTIFICATION_TYPES.MENTION ||
    notification?.type === NOTIFICATION_TYPES.FOLLOW_REQUEST
  ) {
    return "medium";
  }

  return "normal";
}

export function shouldShowNotification(notification, preferences = {}) {
  if (!notification) return false;

  if (preferences.inApp === false) {
    return false;
  }

  const preferenceMap = {
    [NOTIFICATION_TYPES.LIKE]: "likes",
    [NOTIFICATION_TYPES.COMMENT]: "comments",
    [NOTIFICATION_TYPES.REPOST]: "reposts",
    [NOTIFICATION_TYPES.FOLLOW]: "follows",
    [NOTIFICATION_TYPES.FOLLOW_REQUEST]: "follows",
    [NOTIFICATION_TYPES.MENTION]: "mentions",
    [NOTIFICATION_TYPES.REPLY]: "replies",
    [NOTIFICATION_TYPES.MESSAGE]: "messages",
    [NOTIFICATION_TYPES.CALL]: "calls",
    [NOTIFICATION_TYPES.ROOM_INVITE]: "roomInvites",
    [NOTIFICATION_TYPES.GIFT]: "gifts",
    [NOTIFICATION_TYPES.SUBSCRIPTION]: "subscriptions",
  };

  const preferenceKey = preferenceMap[notification.type];

  if (!preferenceKey) {
    return true;
  }

  return preferences[preferenceKey] !== false;
}

export function deduplicateNotifications(notifications = []) {
  const seen = new Set();

  return notifications.filter((notification) => {
    const id = notification?.id || notification?._id;

    if (!id) return true;

    if (seen.has(String(id))) {
      return false;
    }

    seen.add(String(id));

    return true;
  });
}

export function mergeNotifications(existing = [], incoming = []) {
  const merged = [...existing, ...incoming];

  return deduplicateNotifications(merged).sort((a, b) => {
    const first = new Date(a?.createdAt || 0).getTime();

    const second = new Date(b?.createdAt || 0).getTime();

    return second - first;
  });
}

export function getNotificationCount(notifications = []) {
  return notifications.filter(
    (notification) => !notification?.read && !notification?.isRead,
  ).length;
}

export function createNotificationPayload({
  type,
  title,
  body,
  targetId,
  actorId,
  metadata = {},
} = {}) {
  return {
    type,
    title,
    body,
    targetId,
    actorId,
    metadata,
  };
}

export default {
  isValidNotificationType,
  isValidNotificationCategory,
  getNotificationTypeLabel,
  getNotificationCategoryLabel,
  getNotificationPriority,
  shouldShowNotification,
  deduplicateNotifications,
  mergeNotifications,
  getNotificationCount,
  createNotificationPayload,
};
