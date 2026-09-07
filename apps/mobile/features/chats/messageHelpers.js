import { MESSAGE_TYPES, MESSAGE_STATUS } from "./chatConstants";

export function createTemporaryMessage({
  chatId,
  senderId,
  text = "",
  type = MESSAGE_TYPES.TEXT,
  media = null,
  replyTo = null,
} = {}) {
  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    chatId,
    senderId,
    text,
    type,
    media,
    replyTo,
    status: MESSAGE_STATUS.SENDING,
    createdAt: new Date().toISOString(),
    optimistic: true,
  };
}

export function getMessageId(message) {
  return message?.id || message?._id || null;
}

export function getSenderId(message) {
  return message?.senderId || message?.userId || message?.sender?.id;
}

export function isOwnMessage(message, userId) {
  const senderId = getSenderId(message);

  return (
    senderId !== null &&
    senderId !== undefined &&
    String(senderId) === String(userId)
  );
}

export function isTextMessage(message) {
  return message?.type === MESSAGE_TYPES.TEXT;
}

export function isMediaMessage(message) {
  return [
    MESSAGE_TYPES.IMAGE,
    MESSAGE_TYPES.VIDEO,
    MESSAGE_TYPES.AUDIO,
    MESSAGE_TYPES.VOICE,
  ].includes(message?.type);
}

export function isFileMessage(message) {
  return message?.type === MESSAGE_TYPES.FILE;
}

export function isReplyMessage(message) {
  return Boolean(
    message?.replyTo || message?.replyToId || message?.repliedMessage,
  );
}

export function getRepliedMessage(message) {
  return message?.replyTo || message?.repliedMessage || null;
}

export function getMessageReaction(message, userId) {
  if (!Array.isArray(message?.reactions)) {
    return null;
  }

  return (
    message.reactions.find(
      (reaction) =>
        String(reaction?.userId || reaction?.user?.id) === String(userId),
    ) || null
  );
}

export function hasUserReacted(message, userId) {
  return Boolean(getMessageReaction(message, userId));
}

export function getMessageReactions(message) {
  return Array.isArray(message?.reactions) ? message.reactions : [];
}

export function getMessageAttachments(message) {
  if (Array.isArray(message?.attachments)) {
    return message.attachments;
  }

  if (message?.media) {
    return [message.media];
  }

  if (message?.attachment) {
    return [message.attachment];
  }

  return [];
}

export function getMessageAttachmentCount(message) {
  return getMessageAttachments(message).length;
}

export function getMessageFileName(message) {
  return (
    message?.fileName ||
    message?.file?.name ||
    message?.attachment?.name ||
    message?.media?.name ||
    "File"
  );
}

export function getMessageMimeType(message) {
  return (
    message?.mimeType ||
    message?.file?.mimeType ||
    message?.attachment?.mimeType ||
    message?.media?.mimeType ||
    ""
  );
}

export function getMessageUrl(message) {
  return (
    message?.url ||
    message?.file?.url ||
    message?.attachment?.url ||
    message?.media?.url ||
    null
  );
}

export function mergeMessage(updatedMessage, messages = []) {
  const updatedId = getMessageId(updatedMessage);

  return messages.map((message) =>
    getMessageId(message) === updatedId
      ? { ...message, ...updatedMessage }
      : message,
  );
}

export function removeMessage(messageId, messages = []) {
  return messages.filter((message) => getMessageId(message) !== messageId);
}

export function appendMessage(message, messages = []) {
  if (!message) return messages;

  const id = getMessageId(message);

  if (id && messages.some((item) => getMessageId(item) === id)) {
    return messages;
  }

  return [...messages, message];
}

export function prependMessage(message, messages = []) {
  if (!message) return messages;

  const id = getMessageId(message);

  if (id && messages.some((item) => getMessageId(item) === id)) {
    return messages;
  }

  return [message, ...messages];
}

export function replaceTemporaryMessage(temporaryId, message, messages = []) {
  return messages.map((item) => (item.id === temporaryId ? message : item));
}

export function markMessageFailed(message, error = null) {
  return {
    ...message,
    status: MESSAGE_STATUS.FAILED,
    error: error?.message || "Failed to send message.",
  };
}
