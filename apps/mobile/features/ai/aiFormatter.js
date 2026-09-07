export function formatAIMessage(message) {
  if (!message) {
    return {
      id: null,
      role: "assistant",
      content: "",
      type: "text",
      status: "complete",
      createdAt: null,
    };
  }

  return {
    id: message.id || message._id || null,
    role: message.role || "assistant",
    content: message.content || message.message || message.text || "",
    type: message.type || "text",
    status: message.status || "complete",
    createdAt: message.createdAt || message.created_at || null,
  };
}

export function formatAIMessages(messages = []) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages.map(formatAIMessage);
}

export function formatAIResponse(response) {
  if (!response) {
    return null;
  }

  return {
    id: response.id || response._id || null,
    role: response.role || "assistant",
    content: response.content || response.message || response.text || "",
    type: response.type || "text",
    status: response.status || "complete",
    createdAt:
      response.createdAt || response.created_at || new Date().toISOString(),
  };
}

export function formatConversation(conversation) {
  if (!conversation) {
    return null;
  }

  return {
    id: conversation.id || conversation._id || null,
    title: conversation.title || conversation.name || "New conversation",
    createdAt: conversation.createdAt || conversation.created_at || null,
    updatedAt: conversation.updatedAt || conversation.updated_at || null,
    messageCount: conversation.messageCount ?? conversation.message_count ?? 0,
  };
}

export function formatConversations(conversations = []) {
  if (!Array.isArray(conversations)) {
    return [];
  }

  return conversations.map(formatConversation).filter(Boolean);
}

export function formatSuggestion(suggestion) {
  if (!suggestion) {
    return null;
  }

  if (typeof suggestion === "string") {
    return {
      id: suggestion,
      text: suggestion,
      type: "general",
    };
  }

  return {
    id: suggestion.id || suggestion._id || suggestion.text || null,
    text: suggestion.text || suggestion.label || suggestion.prompt || "",
    type: suggestion.type || "general",
  };
}

export function formatSuggestions(suggestions = []) {
  if (!Array.isArray(suggestions)) {
    return [];
  }

  return suggestions.map(formatSuggestion).filter((item) => item?.text);
}

export function formatAIError(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  return (
    error.message ||
    error.data?.message ||
    error.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

export default {
  formatAIMessage,
  formatAIMessages,
  formatAIResponse,
  formatConversation,
  formatConversations,
  formatSuggestion,
  formatSuggestions,
  formatAIError,
};
