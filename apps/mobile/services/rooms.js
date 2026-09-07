import { del, get, patch, post } from "./api";

export async function getRooms(params = {}) {
  return get("/rooms", { params });
}

export async function getRoom(id) {
  return get(`/rooms/${id}`);
}

export async function createRoom(data) {
  return post("/rooms", data);
}

export async function updateRoom(id, data) {
  return patch(`/rooms/${id}`, data);
}

export async function deleteRoom(id) {
  return del(`/rooms/${id}`);
}

export async function joinRoom(id) {
  return post(`/rooms/${id}/join`);
}

export async function leaveRoom(id) {
  return post(`/rooms/${id}/leave`);
}

export async function getRoomMembers(id, params = {}) {
  return get(`/rooms/${id}/members`, { params });
}

export async function addRoomMember(roomId, userId) {
  return post(`/rooms/${roomId}/members`, {
    userId,
  });
}

export async function removeRoomMember(roomId, userId) {
  return del(`/rooms/${roomId}/members/${userId}`);
}

export async function updateRoomMemberRole(roomId, userId, role) {
  return patch(`/rooms/${roomId}/members/${userId}`, {
    role,
  });
}

export async function getRoomMessages(roomId, params = {}) {
  return get(`/rooms/${roomId}/messages`, { params });
}

export async function sendRoomMessage(roomId, data) {
  return post(`/rooms/${roomId}/messages`, data);
}

export async function updateRoomSettings(roomId, data) {
  return patch(`/rooms/${roomId}/settings`, data);
}

export async function inviteToRoom(roomId, userIds) {
  return post(`/rooms/${roomId}/invite`, {
    userIds,
  });
}

export default {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  getRoomMembers,
  addRoomMember,
  removeRoomMember,
  updateRoomMemberRole,
  getRoomMessages,
  sendRoomMessage,
  updateRoomSettings,
  inviteToRoom,
};
