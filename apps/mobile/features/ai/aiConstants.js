export const AI_MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
};

export const AI_MESSAGE_STATUS = {
  SENDING: "sending",
  STREAMING: "streaming",
  COMPLETE: "complete",
  FAILED: "failed",
};

export const AI_MESSAGE_TYPES = {
  TEXT: "text",
  ERROR: "error",
  SYSTEM: "system",
};

export const AI_ACTIONS = {
  SEND: "send",
  RETRY: "retry",
  COPY: "copy",
  DELETE: "delete",
  REGENERATE: "regenerate",
};

export const AI_SUGGESTION_TYPES = {
  GENERAL: "general",
  WRITING: "writing",
  CREATIVE: "creative",
  PRODUCTIVITY: "productivity",
  SOCIAL: "social",
};

export const AI_PROMPT_TYPES = {
  GENERAL: "general",
  SUMMARIZE: "summarize",
  REWRITE: "rewrite",
  TRANSLATE: "translate",
  EXPLAIN: "explain",
  BRAINSTORM: "brainstorm",
  CAPTION: "caption",
  REPLY: "reply",
};

export const AI_ERRORS = {
  UNKNOWN: "AI request failed.",
  NETWORK: "Unable to connect to Gist AI.",
  TIMEOUT: "Gist AI took too long to respond.",
  EMPTY_MESSAGE: "Please enter a message.",
  MESSAGE_TOO_LONG: "Your message is too long.",
  UNAVAILABLE: "Gist AI is currently unavailable.",
};

export default {
  AI_MESSAGE_ROLES,
  AI_MESSAGE_STATUS,
  AI_MESSAGE_TYPES,
  AI_ACTIONS,
  AI_SUGGESTION_TYPES,
  AI_PROMPT_TYPES,
  AI_ERRORS,
};
