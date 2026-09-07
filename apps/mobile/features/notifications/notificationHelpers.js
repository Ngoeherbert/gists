import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
} from "./notificationConstants";

export function getNotificationId(notification) {
  return notification?.id || notification?._id || null;
}

export function getNotificationActor(notification) {
  return (
    notification?.actor || notification?.user || notification?.sender || null
  );
}

export function getNotificationTarget(notification) {
  return (
    notification?.target ||
    notification?.post ||
    notification?.comment ||
    notification?.chat ||
    notification?.room ||
    null
  );
}

export function isNotificationRead(notification) {
  return Boolean(
    notification?.read ||
    notification?.isRead ||
    notification?.status === "read",
  );
}

export function isNotificationUnread(notification) {
  return !isNotificationRead(notification);
}

export function markNotificationRead(notification) {
  return {
    ...notification,
    read: true,
    isRead: true,
    status: "read",
  };
}

export function markNotificationUnread(notification) {
  return {
    ...notification,
    read: false,
    isRead: false,
    status: "unread",
  };
}

export function getUnreadNotifications(notifications = []) {
  return notifications.filter(isNotificationUnread);
}

export function getUnreadNotificationCount(notifications = []) {
  return getUnreadNotifications(notifications).length;
}

export function getNotificationCategory(type) {
  const social = [
    NOTIFICATION_TYPES.LIKE,
    NOTIFICATION_TYPES.COMMENT,
    NOTIFICATION_TYPES.REPOST,
    NOTIFICATION_TYPES.FOLLOW,
    NOTIFICATION_TYPES.FOLLOW_REQUEST,
    NOTIFICATION_TYPES.MENTION,
    NOTIFICATION_TYPES.REPLY,
  ];

  const messages = [NOTIFICATION_TYPES.MESSAGE];

  const calls = [NOTIFICATION_TYPES.CALL];

  const rooms = [NOTIFICATION_TYPES.ROOM_INVITE];

  const monetization = [
    NOTIFICATION_TYPES.GIFT,
    NOTIFICATION_TYPES.SUBSCRIPTION,
  ];

  if (social.includes(type)) {
    return NOTIFICATION_CATEGORIES.SOCIAL;
  }

  if (messages.includes(type)) {
    return NOTIFICATION_CATEGORIES.MESSAGES;
  }

  if (calls.includes(type)) {
    return NOTIFICATION_CATEGORIES.CALLS;
  }

  if (rooms.includes(type)) {
    return NOTIFICATION_CATEGORIES.ROOMS;
  }

  if (monetization.includes(type)) {
    return NOTIFICATION_CATEGORIES.MONETIZATION;
  }

  return NOTIFICATION_CATEGORIES.SYSTEM;
}

export function filterNotificationsByType(notifications = [], type) {
  return notifications.filter((notification) => notification?.type === type);
}

export function filterNotificationsByCategory(notifications = [], category) {
  return notifications.filter(
    (notification) => getNotificationCategory(notification?.type) === category,
  );
}

export function sortNotificationsByDate(notifications = [], descending = true) {
  return [...notifications].sort((a, b) => {
    const first = new Date(a?.createdAt || a?.timestamp || 0).getTime();

    const second = new Date(b?.createdAt || b?.timestamp || 0).getTime();

    return descending ? second - first : first - second;
  });
}

export function removeNotification(notifications = [], notificationId) {
  return notifications.filter(
    (notification) =>
      String(getNotificationId(notification)) !== String(notificationId),
  );
}

export function updateNotification(
  notifications = [],
  notificationId,
  updates,
) {
  return notifications.map((notification) =>
    String(getNotificationId(notification)) === String(notificationId)
      ? { ...notification, ...updates }
      : notification,
  );
}

export function getNotificationNavigationTarget(notification) {
  if (!notification) return null;

  return (
    notification?.deepLink ||
    notification?.url ||
    notification?.targetUrl ||
    null
  );
}

export default {
  getNotificationId,
  getNotificationActor,
  getNotificationTarget,
  isNotificationRead,
  isNotificationUnread,
  markNotificationRead,
  markNotificationUnread,
  getUnreadNotifications,
  getUnreadNotificationCount,
  getNotificationCategory,
  filterNotificationsByType,
  filterNotificationsByCategory,
  sortNotificationsByDate,
  removeNotification,
  updateNotification,
  getNotificationNavigationTarget,
};
