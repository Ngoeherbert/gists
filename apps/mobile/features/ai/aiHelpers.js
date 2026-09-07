import aiConfig from "./aiConfig";

export function createMessageId() {
  return `ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createUserMessage(content) {
  return {
    id: createMessageId(),
    role: "user",
    content: content.trim(),
    type: "text",
    status: "complete",
    createdAt: new Date().toISOString(),
  };
}

export function createAssistantMessage(content = "") {
  return {
    id: createMessageId(),
    role: "assistant",
    content,
    type: "text",
    status: "complete",
    createdAt: new Date().toISOString(),
  };
}

export function createConversationTitle(message = "") {
  const text = message.trim();

  if (!text) {
    return "New conversation";
  }

  const firstLine = text.split("\n")[0].trim();

  if (firstLine.length <= aiConfig.limits.maxConversationTitleLength) {
    return firstLine;
  }

  return `${firstLine.slice(
    0,
    aiConfig.limits.maxConversationTitleLength - 3,
  )}...`;
}

export function getLastMessage(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  return messages[messages.length - 1];
}

export function getLastUserMessage(messages = []) {
  if (!Array.isArray(messages)) {
    return null;
  }

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === "user") {
      return messages[i];
    }
  }

  return null;
}

export function getLastAssistantMessage(messages = []) {
  if (!Array.isArray(messages)) {
    return null;
  }

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === "assistant") {
      return messages[i];
    }
  }

  return null;
}

export function isUserMessage(message) {
  return message?.role === "user";
}

export function isAssistantMessage(message) {
  return message?.role === "assistant";
}

export function isSystemMessage(message) {
  return message?.role === "system";
}

export function hasMessages(messages = []) {
  return Array.isArray(messages) && messages.length > 0;
}

export function getMessageCount(messages = []) {
  return Array.isArray(messages) ? messages.length : 0;
}

export function buildConversationContext(messages = []) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .slice(-aiConfig.limits.maxContextItems)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))
    .filter((message) => message.content);
}

export function mergeStreamingText(current = "", incoming = "") {
  if (!incoming) {
    return current;
  }

  return `${current}${incoming}`;
}

export default {
  createMessageId,
  createUserMessage,
  createAssistantMessage,
  createConversationTitle,
  getLastMessage,
  getLastUserMessage,
  getLastAssistantMessage,
  isUserMessage,
  isAssistantMessage,
  isSystemMessage,
  hasMessages,
  getMessageCount,
  buildConversationContext,
  mergeStreamingText,
};
