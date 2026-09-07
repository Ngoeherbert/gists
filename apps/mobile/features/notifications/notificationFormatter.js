import {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
} from "./notificationConstants";

export function formatNotification(notification = {}) {
  return {
    ...notification,
    id: getNotificationId(notification),
    title: formatNotificationTitle(notification),
    body: formatNotificationBody(notification),
    time: formatNotificationTime(notification),
    status: formatNotificationStatus(notification),
    icon: getNotificationIcon(notification),
  };
}

export function formatNotifications(notifications = []) {
  return notifications.map(formatNotification);
}

export function getNotificationId(notification) {
  return notification?.id || notification?._id || null;
}

export function formatNotificationTitle(notification = {}) {
  if (notification.title) {
    return notification.title;
  }

  const titles = {
    [NOTIFICATION_TYPES.LIKE]: "New reaction",
    [NOTIFICATION_TYPES.COMMENT]: "New comment",
    [NOTIFICATION_TYPES.REPOST]: "New repost",
    [NOTIFICATION_TYPES.FOLLOW]: "New follower",
    [NOTIFICATION_TYPES.FOLLOW_REQUEST]: "Follow request",
    [NOTIFICATION_TYPES.MENTION]: "You were mentioned",
    [NOTIFICATION_TYPES.REPLY]: "New reply",
    [NOTIFICATION_TYPES.MESSAGE]: "New message",
    [NOTIFICATION_TYPES.CALL]: "Incoming call",
    [NOTIFICATION_TYPES.ROOM_INVITE]: "Gist Room invite",
    [NOTIFICATION_TYPES.GIFT]: "New gift",
    [NOTIFICATION_TYPES.SUBSCRIPTION]: "New subscription",
    [NOTIFICATION_TYPES.SYSTEM]: "Gists",
  };

  return titles[notification.type] || "Notification";
}

export function formatNotificationBody(notification = {}) {
  if (notification.body) {
    return notification.body;
  }

  if (notification.message) {
    return notification.message;
  }

  const actor =
    notification.actor?.name || notification.actor?.username || "Someone";

  const bodies = {
    [NOTIFICATION_TYPES.LIKE]: `${actor} reacted to your post.`,
    [NOTIFICATION_TYPES.COMMENT]: `${actor} commented on your post.`,
    [NOTIFICATION_TYPES.REPOST]: `${actor} reposted your post.`,
    [NOTIFICATION_TYPES.FOLLOW]: `${actor} started following you.`,
    [NOTIFICATION_TYPES.FOLLOW_REQUEST]: `${actor} requested to follow you.`,
    [NOTIFICATION_TYPES.MENTION]: `${actor} mentioned you.`,
    [NOTIFICATION_TYPES.REPLY]: `${actor} replied to your comment.`,
    [NOTIFICATION_TYPES.MESSAGE]: `${actor} sent you a message.`,
    [NOTIFICATION_TYPES.CALL]: `${actor} is calling you.`,
    [NOTIFICATION_TYPES.ROOM_INVITE]: `${actor} invited you to a Gist Room.`,
    [NOTIFICATION_TYPES.GIFT]: `${actor} sent you a gift.`,
    [NOTIFICATION_TYPES.SUBSCRIPTION]: `${actor} subscribed to you.`,
    [NOTIFICATION_TYPES.SYSTEM]: "You have a new notification.",
  };

  return bodies[notification.type] || "You have a new notification.";
}

export function formatNotificationTime(notification = {}) {
  const timestamp =
    notification.createdAt || notification.timestamp || notification.date;

  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatNotificationStatus(notification = {}) {
  if (
    notification.status === NOTIFICATION_STATUS.READ ||
    notification.read === true ||
    notification.isRead === true
  ) {
    return "Read";
  }

  return "Unread";
}

export function getNotificationIcon(notification = {}) {
  const icons = {
    [NOTIFICATION_TYPES.LIKE]: "heart",
    [NOTIFICATION_TYPES.COMMENT]: "message-circle",
    [NOTIFICATION_TYPES.REPOST]: "repeat",
    [NOTIFICATION_TYPES.FOLLOW]: "user-plus",
    [NOTIFICATION_TYPES.FOLLOW_REQUEST]: "user-check",
    [NOTIFICATION_TYPES.MENTION]: "at-sign",
    [NOTIFICATION_TYPES.REPLY]: "corner-up-left",
    [NOTIFICATION_TYPES.MESSAGE]: "message-circle",
    [NOTIFICATION_TYPES.CALL]: "phone",
    [NOTIFICATION_TYPES.ROOM_INVITE]: "users",
    [NOTIFICATION_TYPES.GIFT]: "gift",
    [NOTIFICATION_TYPES.SUBSCRIPTION]: "star",
    [NOTIFICATION_TYPES.SYSTEM]: "bell",
  };

  return notification.icon || icons[notification.type] || "bell";
}

export function formatNotificationCount(count) {
  const value = Number(count) || 0;

  if (value <= 0) return "";
  if (value > 99) return "99+";

  return String(value);
}
