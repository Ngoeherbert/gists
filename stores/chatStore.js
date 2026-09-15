// stores/chatStore.js
// Direct + group conversations, message threads, typing/presence, gist rooms,
// the AI chat and voice/video call state.

import { create } from "zustand";
import config from "../constants/config";

const MESSAGES_LIMIT = config.pagination.messagesLimit;

const makeThread = () => ({
  ids: [],
  byId: {},
  cursor: null,
  hasMore: true,
  isLoading: false,
  error: null,
});

const initialState = {
  conversations: [], // [{ id, type, participants, lastMessage, unreadCount, ... }]
  conversationsById: {},
  isLoadingConversations: false,

  threads: {}, // conversationId -> thread
  activeConversationId: null,

  // Ephemeral per-conversation state
  typing: {}, // conversationId -> { [userId]: expiresAt }
  presence: {}, // userId -> { isOnline, lastSeenAt }

  // Pinned / muted / archived bookkeeping
  pinned: [],
  muted: [],
  archived: [],

  // Own state
  isTyping: false,
  replyTo: null,
  draftByConversation: {}, // conversationId -> text

  // Gist rooms (group watch/play sessions)
  rooms: {}, // roomId -> room
  activeRoomId: null,
  activeGame: null,

  // AI chat
  ai: { thread: makeThread(), isThinking: false },

  // Calls
  call: null, // { id, kind: "voice"|"video", peer, status, startedAt, isMuted, isCameraOn }

  error: null,
};

const useChatStore = create((set, get) => ({
  ...initialState,

  // -------------------------------------------------------------------------
  // Conversations
  // -------------------------------------------------------------------------
  fetchConversations: async ({ refresh = false, fetchConversations } = {}) => {
    set({ isLoadingConversations: true, error: null });
    try {
      if (typeof fetchConversations !== "function") {
        throw new Error("fetchConversations provider is required");
      }
      const conversations = (await fetchConversations({ refresh })) || [];
      const byId = {};
      conversations.forEach((c) => {
        byId[c.id] = c;
      });
      set({ conversations, conversationsById: byId, isLoadingConversations: false });
      return conversations;
    } catch (error) {
      set({ isLoadingConversations: false, error: error.message || "Failed to load chats" });
      return [];
    }
  },

  setConversations: (conversations = []) =>
    set(() => {
      const byId = {};
      conversations.forEach((c) => {
        byId[c.id] = c;
      });
      return { conversations, conversationsById: byId };
    }),

  upsertConversation: (conversation) =>
    set((state) => {
      const exists = state.conversations.some((c) => c.id === conversation.id);
      const conversations = exists
        ? state.conversations.map((c) => (c.id === conversation.id ? { ...c, ...conversation } : c))
        : [conversation, ...state.conversations];
      const byId = {
        ...state.conversationsById,
        [conversation.id]: { ...state.conversationsById[conversation.id], ...conversation },
      };
      return { conversations, conversationsById: byId };
    }),

  removeConversation: (conversationId) =>
    set((state) => {
      const { [conversationId]: _removedConv, ...conversationsById } = state.conversationsById;
      const { [conversationId]: _removedThread, ...threads } = state.threads;
      return {
        conversations: state.conversations.filter((c) => c.id !== conversationId),
        conversationsById,
        threads,
        activeConversationId:
          state.activeConversationId === conversationId ? null : state.activeConversationId,
      };
    }),

  setActiveConversation: (activeConversationId) => {
    set({ activeConversationId });
    if (activeConversationId) get().markConversationRead(activeConversationId);
  },

  getConversation: (conversationId) => get().conversationsById[conversationId] || null,

  // -------------------------------------------------------------------------
  // Messages / threads
  // -------------------------------------------------------------------------
  fetchMessages: async ({ conversationId, refresh = false, fetchPage } = {}) => {
    const existing = get().threads[conversationId];
    if (existing?.isLoading) return [];

    set((state) => {
      const base = refresh ? makeThread() : existing || makeThread();
      const thread = { ...base, isLoading: true, error: null };
      return { threads: { ...state.threads, [conversationId]: thread } };
    });

    try {
      if (typeof fetchPage !== "function") throw new Error("fetchPage provider is required");
      const { items = [], nextCursor = null } = await fetchPage({
        conversationId,
        cursor: refresh ? undefined : existing?.cursor ?? undefined,
        limit: MESSAGES_LIMIT,
      });

      set((state) => {
        const prev = state.threads[conversationId] || makeThread();
        // History is paginated backwards: older items go to the front.
        const byId = { ...prev.byId };
        items.forEach((m) => {
          byId[m.id] = m;
        });
        const thread = {
          ...prev,
          ids: Array.from(new Set([...items.map((m) => m.id), ...prev.ids])),
          byId,
          cursor: nextCursor,
          hasMore: Boolean(nextCursor),
          isLoading: false,
        };
        return { threads: { ...state.threads, [conversationId]: thread } };
      });
      return items;
    } catch (error) {
      set((state) => {
        const prev = state.threads[conversationId] || makeThread();
        const thread = { ...prev, isLoading: false, error: error.message };
        return { threads: { ...state.threads, [conversationId]: thread }, error: error.message };
      });
      return [];
    }
  },

  loadOlderMessages: (conversationId, fetchPage) =>
    get().fetchMessages({ conversationId, fetchPage }),

  receiveMessage: ({ conversationId, message }) =>
    set((state) => {
      const prev = state.threads[conversationId] || makeThread();
      const thread = {
        ...prev,
        ids: [...prev.ids, message.id],
        byId: { ...prev.byId, [message.id]: message },
      };
      const conversation = state.conversationsById[conversationId];
      const isActive = state.activeConversationId === conversationId;
      const conversationsById = conversation
        ? {
            ...state.conversationsById,
            [conversationId]: {
              ...conversation,
              lastMessage: message,
              unreadCount: isActive ? 0 : (conversation.unreadCount ?? 0) + 1,
              updatedAt: message.createdAt ?? Date.now(),
            },
          }
        : state.conversationsById;
      return {
        threads: { ...state.threads, [conversationId]: thread },
        conversationsById,
      };
    }),

  sendMessage: ({ conversationId, message }) =>
    set((state) => {
      const prev = state.threads[conversationId] || makeThread();
      const thread = {
        ...prev,
        ids: [...prev.ids, message.id],
        byId: { ...prev.byId, [message.id]: message },
      };
      const conversation = state.conversationsById[conversationId];
      const { [conversationId]: _draft, ...draftByConversation } = state.draftByConversation;
      const conversationsById = conversation
        ? {
            ...state.conversationsById,
            [conversationId]: {
              ...conversation,
              lastMessage: message,
              updatedAt: message.createdAt ?? Date.now(),
            },
          }
        : state.conversationsById;
      return {
        threads: { ...state.threads, [conversationId]: thread },
        conversationsById,
        draftByConversation,
        replyTo: null,
      };
    }),

  updateMessage: ({ conversationId, messageId, patch }) =>
    set((state) => {
      const thread = state.threads[conversationId];
      if (!thread?.byId[messageId]) return state;
      const byId = { ...thread.byId, [messageId]: { ...thread.byId[messageId], ...patch } };
      const threads = { ...state.threads, [conversationId]: { ...thread, byId } };
      return { threads };
    }),

  deleteMessage: ({ conversationId, messageId }) =>
    set((state) => {
      const thread = state.threads[conversationId];
      if (!thread) return state;
      const { [messageId]: _removed, ...byId } = thread.byId;
      const nextThread = { ...thread, ids: thread.ids.filter((id) => id !== messageId), byId };
      return { threads: { ...state.threads, [conversationId]: nextThread } };
    }),

  reactToMessage: ({ conversationId, messageId, emoji }) =>
    set((state) => {
      const thread = state.threads[conversationId];
      const message = thread?.byId[messageId];
      if (!message) return state;
      const reactions = { ...(message.reactions || {}) };
      reactions[emoji] = (reactions[emoji] ?? 0) + 1;
      const byId = { ...thread.byId, [messageId]: { ...message, reactions } };
      const threads = { ...state.threads, [conversationId]: { ...thread, byId } };
      return { threads };
    }),

  markConversationRead: (conversationId) =>
    set((state) => {
      const conversation = state.conversationsById[conversationId];
      if (!conversation || !conversation.unreadCount) return state;
      return {
        conversationsById: {
          ...state.conversationsById,
          [conversationId]: { ...conversation, unreadCount: 0 },
        },
      };
    }),

  totalUnread: () =>
    get().conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),

  // -------------------------------------------------------------------------
  // Typing / presence
  // -------------------------------------------------------------------------
  setTyping: (conversationId, userId, isTyping = true) =>
    set((state) => {
      const current = { ...(state.typing[conversationId] || {}) };
      if (isTyping) current[userId] = Date.now() + 5000;
      else delete current[userId];
      return { typing: { ...state.typing, [conversationId]: current } };
    }),

  setIsTyping: (isTyping) => set({ isTyping }),

  setPresence: (userId, value) =>
    set((state) => {
      const presence = { ...state.presence, [userId]: value };
      return { presence };
    }),

  isUserOnline: (userId) => Boolean(get().presence[userId]?.isOnline),

  // -------------------------------------------------------------------------
  // Drafts / reply
  // -------------------------------------------------------------------------
  setDraft: (conversationId, text) =>
    set((state) => ({
      draftByConversation: { ...state.draftByConversation, [conversationId]: text },
    })),

  setReplyTo: (replyTo) => set({ replyTo }),

  // -------------------------------------------------------------------------
  // Pin / mute / archive
  // -------------------------------------------------------------------------
  togglePin: (conversationId) =>
    set((state) => {
      const pinned = state.pinned.includes(conversationId)
        ? state.pinned.filter((id) => id !== conversationId)
        : [...state.pinned, conversationId];
      return { pinned };
    }),

  toggleMute: (conversationId) =>
    set((state) => {
      const muted = state.muted.includes(conversationId)
        ? state.muted.filter((id) => id !== conversationId)
        : [...state.muted, conversationId];
      return { muted };
    }),

  toggleArchive: (conversationId) =>
    set((state) => {
      const archived = state.archived.includes(conversationId)
        ? state.archived.filter((id) => id !== conversationId)
        : [...state.archived, conversationId];
      return { archived };
    }),

  // -------------------------------------------------------------------------
  // Gist rooms
  // -------------------------------------------------------------------------
  upsertRoom: (room) =>
    set((state) => {
      const prev = state.rooms[room.id];
      const rooms = { ...state.rooms, [room.id]: { ...prev, ...room } };
      return { rooms };
    }),

  setActiveRoom: (activeRoomId) => set({ activeRoomId }),
  setActiveGame: (activeGame) => set({ activeGame }),

  joinRoomParticipants: (roomId, participant) =>
    set((state) => {
      const room = state.rooms[roomId];
      if (!room) return state;
      const participants = [...(room.participants || []), participant];
      const rooms = { ...state.rooms, [roomId]: { ...room, participants } };
      return { rooms };
    }),

  leaveRoom: (roomId) =>
    set((state) => {
      const { [roomId]: _removed, ...rooms } = state.rooms;
      return {
        rooms,
        activeRoomId: state.activeRoomId === roomId ? null : state.activeRoomId,
      };
    }),

  // -------------------------------------------------------------------------
  // AI chat
  // -------------------------------------------------------------------------
  appendAiMessage: (message) =>
    set((state) => {
      const prev = state.ai.thread;
      return {
        ai: {
          ...state.ai,
          thread: {
            ...prev,
            ids: [...prev.ids, message.id],
            byId: { ...prev.byId, [message.id]: message },
          },
        },
      };
    }),

  setAiThinking: (isThinking) =>
    set((state) => ({
      ai: { ...state.ai, isThinking },
    })),
  clearAiThread: () =>
    set((state) => ({
      ai: { thread: makeThread(), isThinking: false },
    })),

  // -------------------------------------------------------------------------
  // Calls
  // -------------------------------------------------------------------------
  startCall: ({ kind = "voice", peer, callId }) =>
    set({
      call: {
        id: callId || `call-${Date.now()}`,
        kind,
        peer,
        status: "ringing",
        startedAt: null,
        isMuted: false,
        isCameraOn: kind === "video",
      },
    }),

  setCallStatus: (status) =>
    set((state) => {
      if (!state.call) return state;
      const startedAt = status === "active" ? state.call.startedAt ?? Date.now() : state.call.startedAt;
      return { call: { ...state.call, status, startedAt } };
    }),

  toggleCallMute: () =>
    set((state) => {
      if (!state.call) return {};
      return { call: { ...state.call, isMuted: !state.call.isMuted } };
    }),

  toggleCamera: () =>
    set((state) => {
      if (!state.call) return {};
      return { call: { ...state.call, isCameraOn: !state.call.isCameraOn } };
    }),

  endCall: () => set({ call: null }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ...initialState,
      ai: { thread: makeThread(), isThinking: false },
    }),
}));

export default useChatStore;
