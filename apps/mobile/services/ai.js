import { del, get, post } from "./api";

export async function getConversations(params = {}) {
  return get("/ai/conversations", { params });
}

export async function getConversation(id) {
  return get(`/ai/conversations/${id}`);
}

export async function createConversation(data = {}) {
  return post("/ai/conversations", data);
}

export async function sendMessage(conversationId, message) {
  return post(`/ai/conversations/${conversationId}/messages`, {
    message,
  });
}

export async function deleteConversation(id) {
  return del(`/ai/conversations/${id}`);
}

export async function clearConversation(id) {
  return del(`/ai/conversations/${id}/messages`);
}

export async function getSuggestions() {
  return get("/ai/suggestions");
}

export async function askAI(message, context = {}) {
  return post("/ai/chat", {
    message,
    context,
  });
}

export default {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  deleteConversation,
  clearConversation,
  getSuggestions,
  askAI,
};
