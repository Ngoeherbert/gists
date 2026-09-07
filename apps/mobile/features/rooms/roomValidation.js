// apps/mobile/features/rooms/roomValidation.js

import {
  ROOM_LIMITS,
  ROOM_MESSAGE_TYPES,
  ROOM_ROLES,
  ROOM_TYPES,
} from "./roomConstants";

export function validateRoomId(id) {
  return Boolean(id && typeof id === "string" && id.trim());
}

export function validateRoomName(name) {
  if (!name || typeof name !== "string") return false;

  const value = name.trim();

  return value.length > 0 && value.length <= ROOM_LIMITS.MAX_NAME_LENGTH;
}

export function validateRoomDescription(description) {
  if (description === undefined || description === null) return true;

  return String(description).length <= ROOM_LIMITS.MAX_DESCRIPTION_LENGTH;
}

export function validateRoomType(type) {
  return Object.values(ROOM_TYPES).includes(type);
}

export function validateRoomRole(role) {
  return Object.values(ROOM_ROLES).includes(role);
}

export function validateRoomMembers(members) {
  if (!Array.isArray(members)) return false;

  return (
    members.length <= ROOM_LIMITS.MAX_MEMBERS &&
    members.every((member) => {
      const id = member?.id || member?.userId || member;

      return Boolean(id);
    })
  );
}

export function validateMessageType(type) {
  return Object.values(ROOM_MESSAGE_TYPES).includes(type);
}

export function validateRoomMessage(message = {}) {
  const errors = {};

  if (message.type !== undefined && !validateMessageType(message.type)) {
    errors.type = "Invalid room message type.";
  }

  if (
    message.text !== undefined &&
    String(message.text).length > ROOM_LIMITS.MAX_MESSAGE_LENGTH
  ) {
    errors.text = "Message is too long.";
  }

  if (message.type === "text" && !String(message.text || "").trim()) {
    errors.text = "Message cannot be empty.";
  }

  if (
    message.attachments !== undefined &&
    !Array.isArray(message.attachments)
  ) {
    errors.attachments = "Invalid attachments.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCreateRoom(data = {}) {
  const errors = {};

  if (!validateRoomName(data.name)) {
    errors.name = "A valid room name is required.";
  }

  if (!validateRoomDescription(data.description)) {
    errors.description = "Room description is too long.";
  }

  if (data.type !== undefined && !validateRoomType(data.type)) {
    errors.type = "Invalid room type.";
  }

  if (data.memberIds !== undefined && !validateRoomMembers(data.memberIds)) {
    errors.memberIds = "Invalid room members.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateRoom(data = {}) {
  const errors = {};

  if (data.name !== undefined && !validateRoomName(data.name)) {
    errors.name = "Invalid room name.";
  }

  if (
    data.description !== undefined &&
    !validateRoomDescription(data.description)
  ) {
    errors.description = "Room description is too long.";
  }

  if (data.type !== undefined && !validateRoomType(data.type)) {
    errors.type = "Invalid room type.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRoomInvite(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return false;
  }

  return (
    userIds.length <= ROOM_LIMITS.MAX_MEMBERS &&
    userIds.every((id) => Boolean(id))
  );
}

export function hasRoomValidationErrors(result) {
  return Boolean(result && !result.valid);
}

export default {
  validateRoomId,
  validateRoomName,
  validateRoomDescription,
  validateRoomType,
  validateRoomRole,
  validateRoomMembers,
  validateMessageType,
  validateRoomMessage,
  validateCreateRoom,
  validateUpdateRoom,
  validateRoomInvite,
  hasRoomValidationErrors,
};
