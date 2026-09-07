// apps/mobile/features/rooms/roomHelpers.js

export function getRoomId(room) {
  return room?.id || room?.roomId || null;
}

export function getRoomName(room) {
  return room?.name || room?.title || "Gist Room";
}

export function getRoomDescription(room) {
  return room?.description || "";
}

export function getRoomAvatar(room) {
  return room?.avatar || room?.avatarUrl || room?.image || null;
}

export function getRoomOwner(room) {
  return room?.owner || room?.createdBy || null;
}

export function getRoomOwnerId(room) {
  const owner = getRoomOwner(room);

  return (
    owner?.id || owner?.userId || room?.ownerId || room?.createdById || null
  );
}

export function getRoomMembers(room) {
  return Array.isArray(room?.members) ? room.members : [];
}

export function getRoomMemberCount(room) {
  return Number(
    room?.membersCount ?? room?.memberCount ?? getRoomMembers(room).length ?? 0,
  );
}

export function getRoomMember(room, userId) {
  if (!userId) return null;

  return (
    getRoomMembers(room).find(
      (member) => (member?.id || member?.userId) === userId,
    ) || null
  );
}

export function getRoomMemberRole(room, userId) {
  const member = getRoomMember(room, userId);

  if (member?.role) return member.role;

  if (getRoomOwnerId(room) === userId) return "owner";

  return null;
}

export function isRoomOwner(room, userId) {
  return Boolean(userId && getRoomOwnerId(room) === userId);
}

export function isRoomAdmin(room, userId) {
  const role = getRoomMemberRole(room, userId);

  return role === "admin" || role === "owner";
}

export function isRoomMember(room, userId) {
  return Boolean(getRoomMember(room, userId));
}

export function isRoomFull(room) {
  const maxMembers = Number(room?.maxMembers || 500);

  return getRoomMemberCount(room) >= maxMembers;
}

export function isRoomPrivate(room) {
  return room?.type === "private" || room?.isPrivate === true;
}

export function isRoomActive(room) {
  return !room?.status || room.status === "active";
}

export function isRoomArchived(room) {
  return room?.status === "archived";
}

export function getRoomLastMessage(room) {
  return room?.lastMessage || room?.latestMessage || null;
}

export function getRoomUnreadCount(room) {
  return Number(room?.unreadCount || 0);
}

export function isRoomMuted(room) {
  return Boolean(room?.isMuted || room?.muted);
}

export function getRoomPermissions(room, userId) {
  const role = getRoomMemberRole(room, userId);
  const isOwner = role === "owner";
  const isAdmin = role === "admin" || isOwner;

  return {
    sendMessages: Boolean(role),
    deleteMessages: isAdmin,
    manageMembers: isAdmin,
    manageSettings: isAdmin,
    inviteMembers: isAdmin || role === "member",
    startGames: Boolean(role),
    isOwner,
    isAdmin,
  };
}

export function sortRooms(rooms = [], key = "updatedAt") {
  return [...rooms].sort((a, b) => {
    const first = new Date(a?.[key] || 0).getTime();
    const second = new Date(b?.[key] || 0).getTime();

    return second - first;
  });
}

export function filterRooms(rooms = [], query = "") {
  const normalizedQuery = String(query).trim().toLowerCase();

  if (!normalizedQuery) return rooms;

  return rooms.filter((room) => {
    const name = getRoomName(room).toLowerCase();
    const description = getRoomDescription(room).toLowerCase();

    return (
      name.includes(normalizedQuery) || description.includes(normalizedQuery)
    );
  });
}

export default {
  getRoomId,
  getRoomName,
  getRoomDescription,
  getRoomAvatar,
  getRoomOwner,
  getRoomOwnerId,
  getRoomMembers,
  getRoomMemberCount,
  getRoomMember,
  getRoomMemberRole,
  isRoomOwner,
  isRoomAdmin,
  isRoomMember,
  isRoomFull,
  isRoomPrivate,
  isRoomActive,
  isRoomArchived,
  getRoomLastMessage,
  getRoomUnreadCount,
  isRoomMuted,
  getRoomPermissions,
  sortRooms,
  filterRooms,
};
