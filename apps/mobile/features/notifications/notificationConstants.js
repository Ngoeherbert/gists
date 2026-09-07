export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  REPOST: "repost",
  FOLLOW: "follow",
  FOLLOW_REQUEST: "follow_request",
  MENTION: "mention",
  REPLY: "reply",
  MESSAGE: "message",
  CALL: "call",
  ROOM_INVITE: "room_invite",
  GIFT: "gift",
  SUBSCRIPTION: "subscription",
  SYSTEM: "system",
};

export const NOTIFICATION_STATUS = {
  UNREAD: "unread",
  READ: "read",
};

export const NOTIFICATION_ACTIONS = {
  OPEN: "open",
  MARK_READ: "mark_read",
  MARK_UNREAD: "mark_unread",
  DELETE: "delete",
};

export const NOTIFICATION_CATEGORIES = {
  SOCIAL: "social",
  MESSAGES: "messages",
  CALLS: "calls",
  ROOMS: "rooms",
  MONETIZATION: "monetization",
  SYSTEM: "system",
};

export const NOTIFICATION_LIMITS = {
  MAX_TITLE_LENGTH: 120,
  MAX_BODY_LENGTH: 500,
  MAX_BATCH_SIZE: 50,
};

export default {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  NOTIFICATION_ACTIONS,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_LIMITS,
};
