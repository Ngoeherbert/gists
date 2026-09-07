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

export const MESSAGE_ACTIONS = {
  REPLY: "reply",
  EDIT: "edit",
  DELETE: "delete",
  COPY: "copy",
  FORWARD: "forward",
  REACT: "react",
  SAVE: "save",
  REPORT: "report",
};

export const CHAT_ACTIONS = {
  MUTE: "mute",
  UNMUTE: "unmute",
  ARCHIVE: "archive",
  UNARCHIVE: "unarchive",
  DELETE: "delete",
  MARK_READ: "mark_read",
  MARK_UNREAD: "mark_unread",
  LEAVE: "leave",
  BLOCK: "block",
  REPORT: "report",
};

export const CHAT_ERRORS = {
  CHAT_NOT_FOUND: "CHAT_NOT_FOUND",
  MESSAGE_NOT_FOUND: "MESSAGE_NOT_FOUND",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  SEND_FAILED: "SEND_FAILED",
  EDIT_FAILED: "EDIT_FAILED",
  DELETE_FAILED: "DELETE_FAILED",
  MEDIA_UPLOAD_FAILED: "MEDIA_UPLOAD_FAILED",
  INVALID_MESSAGE: "INVALID_MESSAGE",
};

export const CHAT_LIMITS = {
  MAX_MESSAGE_LENGTH: 5000,
  MAX_GROUP_MEMBERS: 500,
  MAX_FILE_SIZE: 50 * 1024 * 1024,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,
  MAX_VIDEO_SIZE: 100 * 1024 * 1024,
  MAX_FORWARD_CHATS: 20,
  MAX_REACTIONS: 20,
};

export default {
  CHAT_TYPES,
  CHAT_ROLES,
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  MESSAGE_ACTIONS,
  CHAT_ACTIONS,
  CHAT_ERRORS,
  CHAT_LIMITS,
};
