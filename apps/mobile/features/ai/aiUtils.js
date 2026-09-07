import aiConfig from "./aiConfig";

export function sanitizeAIInput(value = "") {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function isAIInputValid(value = "") {
  const input = sanitizeAIInput(value);

  return input.length > 0 && input.length <= aiConfig.limits.maxMessageLength;
}

export function getAIInputError(value = "") {
  const input = sanitizeAIInput(value);

  if (!input) {
    return "Please enter a message.";
  }

  if (input.length > aiConfig.limits.maxMessageLength) {
    return `Message must be ${aiConfig.limits.maxMessageLength} characters or less.`;
  }

  return null;
}

export function truncateAIText(value = "", maxLength = 500) {
  const text = String(value || "");

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

export function normalizeAIText(value = "") {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .trim();
}

export function stripMarkdown(value = "") {
  return normalizeAIText(value)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .trim();
}

export function getAIWordCount(value = "") {
  const text = normalizeAIText(value);

  if (!text) {
    return 0;
  }

  return text.split(/\s+/).length;
}

export function getAICharacterCount(value = "") {
  return String(value || "").length;
}

export function isAIEnabled() {
  return aiConfig.enabled === true;
}

export function isAIFeatureEnabled(feature) {
  return isAIEnabled() && aiConfig.features?.[feature] === true;
}

export function getSuggestionLimit() {
  return Math.max(0, aiConfig.limits.maxSuggestions);
}

export function limitSuggestions(suggestions = []) {
  if (!Array.isArray(suggestions)) {
    return [];
  }

  return suggestions.slice(0, getSuggestionLimit());
}

export function prepareAIContext(context = {}) {
  if (!context || typeof context !== "object") {
    return {};
  }

  return {
    ...context,
    messages: Array.isArray(context.messages)
      ? context.messages.slice(-aiConfig.limits.maxContextItems)
      : [],
  };
}

export function extractAIContent(response) {
  if (!response) {
    return "";
  }

  if (typeof response === "string") {
    return response;
  }

  return normalizeAIText(
    response.content ||
      response.message ||
      response.text ||
      response.data?.content ||
      response.data?.message ||
      "",
  );
}

export function isAIError(error) {
  return Boolean(error?.code || error?.status || error?.response?.status);
}

export function getAIErrorCode(error) {
  return (
    error?.code || error?.data?.code || error?.response?.data?.code || null
  );
}

export default {
  sanitizeAIInput,
  isAIInputValid,
  getAIInputError,
  truncateAIText,
  normalizeAIText,
  stripMarkdown,
  getAIWordCount,
  getAICharacterCount,
  isAIEnabled,
  isAIFeatureEnabled,
  getSuggestionLimit,
  limitSuggestions,
  prepareAIContext,
  extractAIContent,
  isAIError,
  getAIErrorCode,
};
