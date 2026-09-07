// apps/mobile/features/rooms/roomUtils.js

export function isValidRoom(room) {
  return Boolean(room && (room.id || room.roomId));
}

export function getRoomId(room) {
  return room?.id || room?.roomId || null;
}

export function getRoomType(room) {
  return room?.type || "group";
}

export function getRoomStatus(room) {
  return room?.status || "active";
}

export function getRoomTypeLabel(type) {
  const labels = {
    group: "Group",
    community: "Community",
    private: "Private",
  };

  return labels[type] || "Group";
}

export function getRoomStatusLabel(status) {
  const labels = {
    active: "Active",
    inactive: "Inactive",
    archived: "Archived",
    deleted: "Deleted",
  };

  return labels[status] || "Active";
}

export function normalizeRoom(room = {}) {
  return {
    ...room,
    id: room.id || room.roomId || null,
    name: room.name || room.title || "Gist Room",
    description: room.description || "",
    avatar: room.avatar || room.avatarUrl || room.image || null,
    type: room.type || "group",
    status: room.status || "active",
    members: Array.isArray(room.members) ? room.members : [],
    membersCount: Number(
      room.membersCount ?? room.memberCount ?? room.members?.length ?? 0,
    ),
    maxMembers: Number(room.maxMembers || 500),
    unreadCount: Number(room.unreadCount || 0),
  };
}

export function normalizeRooms(rooms = []) {
  return rooms.map(normalizeRoom);
}

export function buildCreateRoomPayload(data = {}) {
  return {
    name: String(data.name || "").trim(),
    description: String(data.description || "").trim(),
    type: data.type || "group",
    avatar: data.avatar || data.avatarUrl || null,
    memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
  };
}

export function buildRoomUpdatePayload(data = {}) {
  const payload = {};

  const fields = [
    "name",
    "description",
    "type",
    "avatar",
    "avatarUrl",
    "settings",
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined) {
      payload[field] = data[field];
    }
  });

  return payload;
}

export function buildRoomMessagePayload(message = {}) {
  return {
    text: String(message.text || "").trim(),
    type: message.type || "text",
    attachments: Array.isArray(message.attachments) ? message.attachments : [],
    replyToId: message.replyToId || message.replyTo?.id || null,
  };
}

export function buildRoomSearchParams(query, page = 1, limit = 20) {
  return {
    query: String(query || "").trim(),
    page,
    limit,
  };
}

export function mergeRoom(room, updates = {}) {
  return {
    ...normalizeRoom(room),
    ...updates,
  };
}

export function updateRoomMemberCount(room, increment = true) {
  const current = Number(
    room?.membersCount ?? room?.memberCount ?? room?.members?.length ?? 0,
  );

  return {
    ...room,
    membersCount: Math.max(0, current + (increment ? 1 : -1)),
  };
}

export function getRoomInvitePayload(roomId, userIds = []) {
  return {
    roomId,
    userIds: Array.isArray(userIds) ? userIds : [],
  };
}

export default {
  isValidRoom,
  getRoomId,
  getRoomType,
  getRoomStatus,
  getRoomTypeLabel,
  getRoomStatusLabel,
  normalizeRoom,
  normalizeRooms,
  buildCreateRoomPayload,
  buildRoomUpdatePayload,
  buildRoomMessagePayload,
  buildRoomSearchParams,
  mergeRoom,
  updateRoomMemberCount,
  getRoomInvitePayload,
};
