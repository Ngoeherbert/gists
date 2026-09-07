import { CHAT_TYPES, MESSAGE_TYPES, MESSAGE_STATUS } from "./chatConstants";

export function isValidChatType(type) {
  return Object.values(CHAT_TYPES).includes(type);
}

export function isValidMessageType(type) {
  return Object.values(MESSAGE_TYPES).includes(type);
}

export function isValidMessageStatus(status) {
  return Object.values(MESSAGE_STATUS).includes(status);
}

export function getChatTypeLabel(type) {
  const labels = {
    [CHAT_TYPES.DIRECT]: "Chat",
    [CHAT_TYPES.GROUP]: "Group",
    [CHAT_TYPES.ROOM]: "Gist Room",
  };

  return labels[type] || "Chat";
}

export function getMessageTypeLabel(type) {
  const labels = {
    [MESSAGE_TYPES.TEXT]: "Message",
    [MESSAGE_TYPES.IMAGE]: "Photo",
    [MESSAGE_TYPES.VIDEO]: "Video",
    [MESSAGE_TYPES.AUDIO]: "Audio",
    [MESSAGE_TYPES.VOICE]: "Voice message",
    [MESSAGE_TYPES.FILE]: "File",
    [MESSAGE_TYPES.LOCATION]: "Location",
    [MESSAGE_TYPES.CONTACT]: "Contact",
    [MESSAGE_TYPES.GIF]: "GIF",
    [MESSAGE_TYPES.STICKER]: "Sticker",
    [MESSAGE_TYPES.SYSTEM]: "System message",
  };

  return labels[type] || "Message";
}

export function getMessageStatusLabel(status) {
  const labels = {
    [MESSAGE_STATUS.SENDING]: "Sending",
    [MESSAGE_STATUS.SENT]: "Sent",
    [MESSAGE_STATUS.DELIVERED]: "Delivered",
    [MESSAGE_STATUS.READ]: "Read",
    [MESSAGE_STATUS.FAILED]: "Failed",
  };

  return labels[status] || "";
}

export function getMessagePreview(message) {
  if (!message) return "";

  if (message.text || message.content) {
    return message.text || message.content;
  }

  return getMessageTypeLabel(message.type);
}

export function normalizeMessage(message = {}) {
  return {
    ...message,
    id: message.id || message._id,
    text: message.text || message.content || "",
    type: message.type || MESSAGE_TYPES.TEXT,
    status: message.status || MESSAGE_STATUS.SENT,
    senderId: message.senderId || message.userId || message.sender?.id,
    createdAt: message.createdAt || message.timestamp || message.sentAt || null,
  };
}

export function normalizeMessages(messages = []) {
  return messages.map(normalizeMessage);
}

export function normalizeChat(chat = {}) {
  return {
    ...chat,
    id: chat.id || chat._id,
    type: chat.type || CHAT_TYPES.DIRECT,
    members: Array.isArray(chat.members) ? chat.members : [],
    unreadCount: Number(chat.unreadCount || 0),
    muted: Boolean(chat.muted || chat.isMuted),
    archived: Boolean(chat.archived || chat.isArchived),
  };
}

export function normalizeChats(chats = []) {
  return chats.map(normalizeChat);
}

export function buildMessagePayload({
  chatId,
  text = "",
  type = MESSAGE_TYPES.TEXT,
  replyTo = null,
  media = null,
  metadata = {},
} = {}) {
  return {
    chatId,
    text: text.trim(),
    type,
    replyTo,
    media,
    metadata,
  };
}

export function buildReactionPayload(messageId, reaction) {
  return {
    messageId,
    reaction,
  };
}

export function buildTypingPayload(chatId, isTyping) {
  return {
    chatId,
    isTyping: Boolean(isTyping),
  };
}

export function getChatId(chat) {
  return chat?.id || chat?._id || null;
}

export function getMessageId(message) {
  return message?.id || message?._id || null;
}

export function isEmptyMessage(text) {
  return !String(text || "").trim();
}

export function getAttachmentUrl(message) {
  return (
    message?.url || message?.media?.url || message?.attachment?.url || null
  );
}
