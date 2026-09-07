import { del, get, patch, post } from "./api";

export async function getChats(params = {}) {
  return get("/chats", { params });
}

export async function getChat(id) {
  return get(`/chats/${id}`);
}

export async function createChat(data) {
  return post("/chats", data);
}

export async function deleteChat(id) {
  return del(`/chats/${id}`);
}

export async function markChatAsRead(id) {
  return post(`/chats/${id}/read`);
}

export async function muteChat(id, muted = true) {
  return patch(`/chats/${id}/mute`, { muted });
}

export async function archiveChat(id, archived = true) {
  return patch(`/chats/${id}/archive`, { archived });
}

export async function getMessages(chatId, params = {}) {
  return get(`/chats/${chatId}/messages`, { params });
}

export async function sendMessage(chatId, data) {
  return post(`/chats/${chatId}/messages`, data);
}

export async function editMessage(chatId, messageId, content) {
  return patch(`/chats/${chatId}/messages/${messageId}`, {
    content,
  });
}

export async function deleteMessage(chatId, messageId, forEveryone = false) {
  return del(
    `/chats/${chatId}/messages/${messageId}?forEveryone=${forEveryone}`,
  );
}

export async function reactToMessage(chatId, messageId, reaction) {
  return post(`/chats/${chatId}/messages/${messageId}/reaction`, {
    reaction,
  });
}

export async function removeReaction(chatId, messageId) {
  return del(`/chats/${chatId}/messages/${messageId}/reaction`);
}

export async function searchMessages(chatId, query) {
  return get(`/chats/${chatId}/messages/search`, {
    params: { query },
  });
}

export async function sendTypingStatus(chatId, typing = true) {
  return post(`/chats/${chatId}/typing`, { typing });
}

export default {
  getChats,
  getChat,
  createChat,
  deleteChat,
  markChatAsRead,
  muteChat,
  archiveChat,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  reactToMessage,
  removeReaction,
  searchMessages,
  sendTypingStatus,
};
