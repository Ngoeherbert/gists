import { MESSAGE_TYPES } from "./chatConstants";
import { isOwnMessage, getMessageSender } from "./messageHelpers";

export function canSendMessage(user) {
  return Boolean(user?.id || user?._id);
}

export function canSendMessageToChat(chat, userId) {
  if (!chat || !userId) return false;

  if (!Array.isArray(chat.members)) {
    return true;
  }

  return chat.members.some(
    (member) => String(member?.id || member?.userId) === String(userId),
  );
}

export function canEditMessage(message, userId) {
  if (!message || !userId) return false;

  if (!isOwnMessage(message, userId)) {
    return false;
  }

  return message.type === MESSAGE_TYPES.TEXT;
}

export function canDeleteMessage(message, userId, isAdmin = false) {
  if (!message || !userId) return false;

  return isOwnMessage(message, userId) || isAdmin;
}

export function canReplyToMessage(message) {
  if (!message) return false;

  return message.type !== MESSAGE_TYPES.SYSTEM;
}

export function canReactToMessage(message) {
  if (!message) return false;

  return message.type !== MESSAGE_TYPES.SYSTEM;
}

export function canForwardMessage(message) {
  if (!message) return false;

  return message.type !== MESSAGE_TYPES.SYSTEM;
}

export function canCopyMessage(message) {
  if (!message) return false;

  return message.type === MESSAGE_TYPES.TEXT;
}

export function canSaveMessage(message) {
  if (!message) return false;

  return message.type !== MESSAGE_TYPES.SYSTEM;
}

export function canReportMessage(message, userId) {
  if (!message || !userId) return false;

  return !isOwnMessage(message, userId);
}

export function canManageMessage(message, userId, isAdmin = false) {
  return {
    edit: canEditMessage(message, userId),
    delete: canDeleteMessage(message, userId, isAdmin),
    reply: canReplyToMessage(message),
    react: canReactToMessage(message),
    forward: canForwardMessage(message),
    copy: canCopyMessage(message),
    save: canSaveMessage(message),
    report: canReportMessage(message, userId),
  };
}

export function isMessageFromUser(message, userId) {
  return isOwnMessage(message, userId);
}

export function getMessageOwner(message) {
  return getMessageSender(message);
}

export default {
  canSendMessage,
  canSendMessageToChat,
  canEditMessage,
  canDeleteMessage,
  canReplyToMessage,
  canReactToMessage,
  canForwardMessage,
  canCopyMessage,
  canSaveMessage,
  canReportMessage,
  canManageMessage,
  isMessageFromUser,
  getMessageOwner,
};
