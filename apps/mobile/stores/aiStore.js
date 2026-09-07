import { create } from "zustand";

const createMessage = (message) => ({
  id: message.id || `${Date.now()}-${Math.random()}`,
  role: message.role || "user",
  content: message.content || "",
  createdAt: message.createdAt || new Date().toISOString(),
  ...message,
});

export const useAIStore = create((set) => ({
  messages: [],
  suggestions: [],
  isLoading: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, createMessage(message)],
      error: null,
    })),

  addMessages: (messages) =>
    set((state) => ({
      messages: [...state.messages, ...messages.map(createMessage)],
      error: null,
    })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, ...updates } : message,
      ),
    })),

  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),

  setSuggestions: (suggestions) => set({ suggestions: suggestions || [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearConversation: () =>
    set({
      messages: [],
      suggestions: [],
      error: null,
      isLoading: false,
    }),

  reset: () =>
    set({
      messages: [],
      suggestions: [],
      isLoading: false,
      error: null,
    }),
}));

export default useAIStore;
