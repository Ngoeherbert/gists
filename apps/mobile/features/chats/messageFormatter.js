import { MESSAGE_TYPES, MESSAGE_STATUS } from "./chatConstants";
import { normalizeMessage } from "./chatUtils";

export function formatMessage(message = {}) {
  const normalized = normalizeMessage(message);

  return {
    ...normalized,
    displayText: formatMessageText(normalized),
    displayTime: formatMessageTime(normalized),
    displayStatus: formatMessageStatus(normalized),
    preview: formatMessagePreview(normalized),
  };
}

export function formatMessages(messages = []) {
  return messages.map(formatMessage);
}

export function formatMessageText(message = {}) {
  if (message.type === MESSAGE_TYPES.IMAGE) {
    return message.caption || "Photo";
  }

  if (message.type === MESSAGE_TYPES.VIDEO) {
    return message.caption || "Video";
  }

  if (message.type === MESSAGE_TYPES.VOICE) {
    return "Voice message";
  }

  if (message.type === MESSAGE_TYPES.AUDIO) {
    return "Audio";
  }

  if (message.type === MESSAGE_TYPES.FILE) {
    return message.fileName || message.name || "File";
  }

  if (message.type === MESSAGE_TYPES.LOCATION) {
    return "Location";
  }

  if (message.type === MESSAGE_TYPES.CONTACT) {
    return "Contact";
  }

  if (message.type === MESSAGE_TYPES.GIF) {
    return "GIF";
  }

  if (message.type === MESSAGE_TYPES.STICKER) {
    return "Sticker";
  }

  return message.text || message.content || "";
}

export function formatMessagePreview(message = {}) {
  const text = formatMessageText(message);

  if (!text) return "";

  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

export function formatMessageTime(message = {}) {
  const timestamp = message.createdAt || message.timestamp || message.sentAt;

  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatMessageStatus(message = {}) {
  const status = message.status;

  const labels = {
    [MESSAGE_STATUS.SENDING]: "Sending",
    [MESSAGE_STATUS.SENT]: "Sent",
    [MESSAGE_STATUS.DELIVERED]: "Delivered",
    [MESSAGE_STATUS.READ]: "Read",
    [MESSAGE_STATUS.FAILED]: "Failed",
  };

  return labels[status] || "";
}

export function formatMessageDate(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatMessageCount(count) {
  const value = Number(count) || 0;

  return value === 1 ? "1 message" : `${value} messages`;
}
