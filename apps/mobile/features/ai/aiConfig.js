const aiConfig = {
  enabled: true,

  assistant: {
    name: "Gist AI",
    shortName: "AI",
    greeting: "Hi! I’m Gist AI. How can I help you today?",
  },

  limits: {
    maxMessageLength: 5000,
    maxConversationTitleLength: 100,
    maxSuggestions: 6,
    maxContextItems: 10,
  },

  suggestions: {
    enabled: true,
    defaultCount: 4,
  },

  features: {
    chat: true,
    suggestions: true,
    summaries: true,
    writing: true,
    translation: true,
    search: true,
  },

  ui: {
    showAvatar: true,
    showSuggestions: true,
    showTypingIndicator: true,
    animateResponses: true,
  },

  request: {
    timeout: 30000,
    retryCount: 2,
  },
};

export default aiConfig;
