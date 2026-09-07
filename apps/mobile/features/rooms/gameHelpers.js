// apps/mobile/features/rooms/roomConstants.js

export const ROOM_TYPES = {
  GROUP: "group",
  COMMUNITY: "community",
  PRIVATE: "private",
};

export const ROOM_ROLES = {
  MEMBER: "member",
  ADMIN: "admin",
  OWNER: "owner",
};

export const ROOM_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
  DELETED: "deleted",
};

export const ROOM_MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  VOICE: "voice",
  FILE: "file",
  SYSTEM: "system",
  GAME: "game",
};

export const ROOM_ACTIONS = {
  JOIN: "join",
  LEAVE: "leave",
  INVITE: "invite",
  MESSAGE: "message",
  MUTE: "mute",
  UNMUTE: "unmute",
  EDIT: "edit",
  DELETE: "delete",
  REPORT: "report",
  BLOCK: "block",
  SETTINGS: "settings",
};

export const ROOM_MEMBER_ACTIONS = {
  ADD: "add",
  REMOVE: "remove",
  PROMOTE: "promote",
  DEMOTE: "demote",
  MUTE: "mute",
  UNMUTE: "unmute",
  BAN: "ban",
  UNBAN: "unban",
};

export const ROOM_ERRORS = {
  INVALID_ROOM: "INVALID_ROOM",
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  ROOM_FULL: "ROOM_FULL",
  ALREADY_MEMBER: "ALREADY_MEMBER",
  NOT_MEMBER: "NOT_MEMBER",
  NOT_AUTHORIZED: "NOT_AUTHORIZED",
  CANNOT_LEAVE: "CANNOT_LEAVE",
  MEMBER_NOT_FOUND: "MEMBER_NOT_FOUND",
  INVALID_MESSAGE: "INVALID_MESSAGE",
};

export const ROOM_LIMITS = {
  MAX_NAME_LENGTH: 80,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_MEMBERS: 500,
  MAX_MESSAGE_LENGTH: 5000,
  MAX_PINNED_MESSAGES: 10,
};

export const ROOM_PERMISSIONS = {
  SEND_MESSAGES: "send_messages",
  DELETE_MESSAGES: "delete_messages",
  MANAGE_MEMBERS: "manage_members",
  MANAGE_SETTINGS: "manage_settings",
  INVITE_MEMBERS: "invite_members",
  START_GAMES: "start_games",
};

export default {
  ROOM_TYPES,
  ROOM_ROLES,
  ROOM_STATUS,
  ROOM_MESSAGE_TYPES,
  ROOM_ACTIONS,
  ROOM_MEMBER_ACTIONS,
  ROOM_ERRORS,
  ROOM_LIMITS,
  ROOM_PERMISSIONS,
};
