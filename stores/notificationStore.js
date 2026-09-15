// stores/notificationStore.js
// In-app notification list, unread badges and per-category preferences.
// Push-token registration lives here too (expo-notifications is called by the
// hook/util layer, this store just records the resulting token + permission).

import { create } from "zustand";
import config from "../constants/config";

const PAGE_LIMIT = config.pagination.defaultLimit;

const makeFeed = () => ({
  ids: [],
  cursor: null,
  hasMore: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
});

const initialState = {
  feed: makeFeed(),
  items: {}, // notificationId -> notification

  // Badges
  unreadCount: 0,
  mentionCount: 0,
  messageCount: 0,

  // Filtering
  activeFilter: "all", // "all" | "mentions" | "follows" | "likes" | "comments"

  // Push
  pushToken: null,
  pushPermission: "undetermined", // "granted" | "denied" | "undetermined"

  // Preferences (mirrors profile/settings/notifications)
  preferences: {
    push: true,
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    reposts: true,
    stories: true,
    reels: true,
    email: false,
    sound: true,
    vibration: true,
  },

  error: null,
};

const useNotificationStore = create((set, get) => ({
  ...initialState,

  // -------------------------------------------------------------------------
  // Feed loading
  // -------------------------------------------------------------------------
  fetchNotifications: async ({ refresh = false, filter, fetchPage } = {}) => {
    const current = get().feed;
    if (current.isLoading) return [];
    if (!refresh && !current.hasMore) return [];

    set((state) => {
      const feed = { ...state.feed, isLoading: true, isRefreshing: refresh, error: null };
      return { feed };
    });

    try {
      if (typeof fetchPage !== "function") throw new Error("fetchPage provider is required");
      const { items = [], nextCursor = null, unreadCount } = await fetchPage({
        cursor: refresh ? undefined : current.cursor,
        limit: PAGE_LIMIT,
        filter: filter ?? get().activeFilter,
      });

      set((state) => {
        const prevIds = refresh ? [] : state.feed.ids;
        const merged = { ...state.items };
        items.forEach((n) => {
          merged[n.id] = n;
        });
        const feed = {
          ...state.feed,
          ids: Array.from(new Set([...prevIds, ...items.map((n) => n.id)])),
          cursor: nextCursor,
          hasMore: Boolean(nextCursor),
          isLoading: false,
          isRefreshing: false,
        };
        return {
          feed,
          items: merged,
          ...(typeof unreadCount === "number" ? { unreadCount } : {}),
        };
      });
      return items;
    } catch (error) {
      set((state) => {
        const feed = {
          ...state.feed,
          isLoading: false,
          isRefreshing: false,
          error: error.message || "Failed to load notifications",
        };
        return { feed, error: error.message };
      });
      return [];
    }
  },

  refreshNotifications: (fetchPage) => get().fetchNotifications({ refresh: true, fetchPage }),
  loadMoreNotifications: (fetchPage) => get().fetchNotifications({ fetchPage }),

  setActiveFilter: (activeFilter) =>
    set((state) => ({
      activeFilter,
      feed: { ...state.feed, ids: [], cursor: null, hasMore: true },
    })),

  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------
  receiveNotification: (notification) =>
    set((state) => {
      const items = { ...state.items, [notification.id]: notification };
      const feed = { ...state.feed, ids: [notification.id, ...state.feed.ids] };
      return { items, feed, unreadCount: state.unreadCount + 1 };
    }),

  markRead: (notificationId) =>
    set((state) => {
      const notification = state.items[notificationId];
      if (!notification || notification.isRead) return state;
      const items = { ...state.items, [notificationId]: { ...notification, isRead: true } };
      return { items, unreadCount: Math.max(0, state.unreadCount - 1) };
    }),

  markAllRead: () =>
    set((state) => {
      const items = {};
      Object.entries(state.items).forEach(([id, n]) => {
        items[id] = { ...n, isRead: true };
      });
      return { items, unreadCount: 0, mentionCount: 0 };
    }),

  removeNotification: (notificationId) =>
    set((state) => {
      const notification = state.items[notificationId];
      const { [notificationId]: _removed, ...items } = state.items;
      const feed = { ...state.feed, ids: state.feed.ids.filter((id) => id !== notificationId) };
      const delta = notification && !notification.isRead ? 1 : 0;
      return { items, feed, unreadCount: Math.max(0, state.unreadCount - delta) };
    }),

  clearAll: () =>
    set((state) => ({
      items: {},
      feed: { ...state.feed, ids: [], cursor: null, hasMore: true },
      unreadCount: 0,
      mentionCount: 0,
      messageCount: 0,
    })),

  setCounts: ({ unreadCount, mentionCount, messageCount } = {}) =>
    set((state) => ({
      unreadCount: typeof unreadCount === "number" ? unreadCount : state.unreadCount,
      mentionCount: typeof mentionCount === "number" ? mentionCount : state.mentionCount,
      messageCount: typeof messageCount === "number" ? messageCount : state.messageCount,
    })),

  // -------------------------------------------------------------------------
  // Push
  // -------------------------------------------------------------------------
  setPushToken: (pushToken) => set({ pushToken }),
  setPushPermission: (pushPermission) => set({ pushPermission }),

  // -------------------------------------------------------------------------
  // Preferences
  // -------------------------------------------------------------------------
  setPreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),

  setPreferences: (patch) =>
    set((state) => ({
      preferences: { ...state.preferences, ...patch },
    })),

  resetPreferences: () =>
    set({ preferences: { ...initialState.preferences } }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ...initialState,
      feed: makeFeed(),
      preferences: { ...initialState.preferences },
    }),
}));

export default useNotificationStore;
