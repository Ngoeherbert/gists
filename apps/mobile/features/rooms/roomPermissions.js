// apps/mobile/features/rooms/roomPermissions.js

import {
  getRoomMemberRole,
  getRoomOwnerId,
  isRoomMember,
  isRoomFull,
} from "./roomHelpers";

export function canViewRoom(room) {
  return Boolean(room && room.status !== "deleted");
}

export function canJoinRoom(room, userId) {
  if (!room || !userId) return false;
  if (!canViewRoom(room)) return false;
  if (isRoomMember(room, userId)) return false;
  if (isRoomFull(room)) return false;
  if (room.isBanned || room.isBlocked) return false;

  return true;
}

export function canLeaveRoom(room, userId) {
  if (!room || !userId) return false;

  if (!isRoomMember(room, userId)) return false;

  return getRoomOwnerId(room) !== userId;
}

export function canSendRoomMessage(room, userId) {
  if (!room || !userId) return false;
  if (!isRoomMember(room, userId)) return false;
  if (room.isMuted) return false;

  const member = room.members?.find(
    (item) => (item?.id || item?.userId) === userId,
  );

  if (member?.isMuted || member?.muted) return false;

  return true;
}

export function canInviteToRoom(room, userId) {
  const role = getRoomMemberRole(room, userId);

  return role === "owner" || role === "admin" || role === "member";
}

export function canManageRoom(room, userId) {
  const role = getRoomMemberRole(room, userId);

  return role === "owner" || role === "admin";
}

export function canManageRoomSettings(room, userId) {
  return canManageRoom(room, userId);
}

export function canManageMembers(room, userId) {
  return canManageRoom(room, userId);
}

export function canPromoteMember(room, userId, targetMember) {
  if (!canManageMembers(room, userId)) return false;
  if (!targetMember) return false;

  const actorRole = getRoomMemberRole(room, userId);
  const targetRole = targetMember.role || "member";

  if (targetRole === "owner") return false;

  return actorRole === "owner" || targetRole === "member";
}

export function canDemoteMember(room, userId, targetMember) {
  if (!canManageMembers(room, userId)) return false;
  if (!targetMember) return false;

  const actorRole = getRoomMemberRole(room, userId);
  const targetRole = targetMember.role || "member";

  if (targetRole !== "admin") return false;

  return actorRole === "owner";
}

export function canRemoveMember(room, userId, targetMember) {
  if (!canManageMembers(room, userId)) return false;
  if (!targetMember) return false;

  const actorRole = getRoomMemberRole(room, userId);
  const targetRole = targetMember.role || "member";

  if (targetRole === "owner") return false;

  if (actorRole === "admin" && targetRole === "admin") {
    return false;
  }

  return true;
}

export function canDeleteRoom(room, userId) {
  return Boolean(room && userId && getRoomOwnerId(room) === userId);
}

export function canReportRoom(room, userId) {
  if (!room || !userId) return false;

  return getRoomOwnerId(room) !== userId;
}

export default {
  canViewRoom,
  canJoinRoom,
  canLeaveRoom,
  canSendRoomMessage,
  canInviteToRoom,
  canManageRoom,
  canManageRoomSettings,
  canManageMembers,
  canPromoteMember,
  canDemoteMember,
  canRemoveMember,
  canDeleteRoom,
  canReportRoom,
};
