export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  VOICE: "voice",
  FILE: "file",
  LOCATION: "location",
  CONTACT: "contact",
  GIF: "gif",
  STICKER: "sticker",
  SYSTEM: "system",
};

export const MESSAGE_STATUS = {
  SENDING: "sending",
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  FAILED: "failed",
};

export const CHAT_TYPES = {
  DIRECT: "direct",
  GROUP: "group",
  ROOM: "room",
};

export const CHAT_ROLES = {
  MEMBER: "member",
  ADMIN: "admin",
  OWNER: "owner",
};

export const CALL_TYPES = {
  VOICE: "voice",
  VIDEO: "video",
};

export const CALL_STATUS = {
  IDLE: "idle",
  CONNECTING: "connecting",
  RINGING: "ringing",
  ACTIVE: "active",
  ENDED: "ended",
  MISSED: "missed",
  DECLINED: "declined",
  FAILED: "failed",
};

export const CHAT_LIMITS = {
  MAX_MESSAGE_LENGTH: 5000,
  MAX_GROUP_MEMBERS: 500,
  MAX_FILE_SIZE: 50 * 1024 * 1024,
};

export default {
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  CHAT_TYPES,
  CHAT_ROLES,
  CALL_TYPES,
  CALL_STATUS,
  CHAT_LIMITS,
};
