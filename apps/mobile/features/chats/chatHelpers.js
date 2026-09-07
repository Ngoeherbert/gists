import { CHAT_TYPES, CHAT_ROLES, MESSAGE_STATUS } from "./chatConstants";

export function isDirectChat(chat) {
  return chat?.type === CHAT_TYPES.DIRECT;
}

export function isGroupChat(chat) {
  return chat?.type === CHAT_TYPES.GROUP;
}

export function isRoomChat(chat) {
  return chat?.type === CHAT_TYPES.ROOM;
}

export function getChatMemberCount(chat) {
  if (Array.isArray(chat?.members)) {
    return chat.members.length;
  }

  return Number(chat?.memberCount) || 0;
}

export function getChatMembers(chat) {
  return Array.isArray(chat?.members) ? chat.members : [];
}

export function getChatMember(chat, userId) {
  return getChatMembers(chat).find(
    (member) => String(member?.id || member?.userId) === String(userId),
  );
}

export function getChatMemberRole(chat, userId) {
  return getChatMember(chat, userId)?.role || CHAT_ROLES.MEMBER;
}

export function isChatAdmin(chat, userId) {
  const role = getChatMemberRole(chat, userId);

  return role === CHAT_ROLES.ADMIN || role === CHAT_ROLES.OWNER;
}

export function isChatOwner(chat, userId) {
  return getChatMemberRole(chat, userId) === CHAT_ROLES.OWNER;
}

export function getOtherChatMember(chat, currentUserId) {
  if (!isDirectChat(chat)) return null;

  return (
    getChatMembers(chat).find(
      (member) =>
        String(member?.id || member?.userId) !== String(currentUserId),
    ) || null
  );
}

export function getChatDisplayName(chat, currentUserId) {
  if (!chat) return "Chat";

  if (chat.name) return chat.name;

  const otherMember = getOtherChatMember(chat, currentUserId);

  if (otherMember) {
    return (
      otherMember.name || otherMember.username || otherMember.fullName || "User"
    );
  }

  return "Chat";
}

export function getChatAvatar(chat, currentUserId) {
  if (!chat) return null;

  if (chat.avatar) return chat.avatar;

  const otherMember = getOtherChatMember(chat, currentUserId);

  return (
    otherMember?.avatar ||
    otherMember?.profilePhoto ||
    otherMember?.profileImage ||
    null
  );
}

export function getLastMessage(chat) {
  return chat?.lastMessage || null;
}

export function getUnreadCount(chat) {
  return Math.max(0, Number(chat?.unreadCount ?? chat?.unreadMessages ?? 0));
}

export function hasUnreadMessages(chat) {
  return getUnreadCount(chat) > 0;
}

export function isMuted(chat) {
  return Boolean(chat?.muted || chat?.isMuted);
}

export function isArchived(chat) {
  return Boolean(chat?.archived || chat?.isArchived);
}

export function isMessageSending(message) {
  return message?.status === MESSAGE_STATUS.SENDING;
}

export function isMessageSent(message) {
  return message?.status === MESSAGE_STATUS.SENT;
}

export function isMessageDelivered(message) {
  return message?.status === MESSAGE_STATUS.DELIVERED;
}

export function isMessageRead(message) {
  return message?.status === MESSAGE_STATUS.READ;
}

export function isMessageFailed(message) {
  return message?.status === MESSAGE_STATUS.FAILED;
}

export function isMessageOwnedByUser(message, userId) {
  return String(message?.senderId || message?.userId) === String(userId);
}

export function canEditMessage(message, userId) {
  return isMessageOwnedByUser(message, userId) && !isMessageFailed(message);
}

export function canDeleteMessage(message, userId) {
  return isMessageOwnedByUser(message, userId);
}

export function getMessageSender(message) {
  return message?.sender || message?.user || null;
}

export function getMessageText(message) {
  return message?.text || message?.content || message?.body || "";
}

export function getMessageTimestamp(message) {
  return message?.createdAt || message?.timestamp || message?.sentAt || null;
}

export function sortChatsByActivity(chats = []) {
  return [...chats].sort((a, b) => {
    const first = new Date(
      a?.lastMessage?.createdAt || a?.updatedAt || 0,
    ).getTime();

    const second = new Date(
      b?.lastMessage?.createdAt || b?.updatedAt || 0,
    ).getTime();

    return second - first;
  });
}

export function groupMessagesByDate(messages = []) {
  const groups = {};

  messages.forEach((message) => {
    const timestamp = getMessageTimestamp(message);

    if (!timestamp) return;

    const date = new Date(timestamp);
    const key = date.toISOString().split("T")[0];

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(message);
  });

  return groups;
}
