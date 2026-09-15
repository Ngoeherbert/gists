// stores/profileStore.js
// The signed-in user's profile, other users' public profiles, follow graph and
// the tabbed content lists (posts / reels / likes / saved) on profile screens.

import { create } from "zustand";
import config from "../constants/config";

const PAGE_LIMIT = config.pagination.defaultLimit;

const makeList = () => ({
  ids: [],
  cursor: null,
  hasMore: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
});

const LIST_KEYS = ["posts", "reels", "likes", "saved", "followers", "following"];

const makeLists = () => {
  const lists = {};
  LIST_KEYS.forEach((key) => {
    lists[key] = makeList();
  });
  return lists;
};

const initialState = {
  // Signed-in user's own profile
  me: null,
  isLoadingMe: false,

  // Viewed profiles: userId -> profile
  profiles: {},
  isLoadingProfile: false,

  // Content lists, keyed by `${listType}:${userId}` (userId defaults to "me")
  lists: {},
  entities: {}, // generic cache: postId/reelId/userId -> entity

  // Follow graph helpers
  following: [], // ids the signed-in user follows
  followers: [],

  // Edit profile
  isSaving: false,
  error: null,
};

const listKey = (type, userId) => `${type}:${userId || "me"}`;

const useProfileStore = create((set, get) => ({
  ...initialState,

  // -------------------------------------------------------------------------
  // Own profile
  // -------------------------------------------------------------------------
  fetchMe: async ({ fetchMe } = {}) => {
    set({ isLoadingMe: true, error: null });
    try {
      if (typeof fetchMe !== "function") throw new Error("fetchMe provider is required");
      const me = await fetchMe();
      set({ me, isLoadingMe: false });
      return me;
    } catch (error) {
      set({ isLoadingMe: false, error: error.message || "Failed to load profile" });
      return null;
    }
  },

  setMe: (me) => set({ me }),
  setProfile: (userId, profile) =>
    set((state) => ({
      profiles: { ...state.profiles, [userId]: profile },
    })),

  updateMe: (patch) =>
    set((state) => {
      const me = state.me ? { ...state.me, ...patch } : state.me;
      return { me };
    }),

  updateProfile: (userId, patch) =>
    set((state) => {
      const profile = state.profiles[userId];
      if (!profile) return state;
      return { profiles: { ...state.profiles, [userId]: { ...profile, ...patch } }};
    }),

  saveProfile: async ({ patch, update }) => {
    const previous = get().me;
    if (previous) get().updateMe(patch);
    set({ isSaving: true, error: null });
    try {
      if (typeof update === "function") {
        const fresh = await update(patch);
        if (fresh) get().setMe(fresh);
      }
      set({ isSaving: false });
      return get().me;
    } catch (error) {
      if (previous) get().setMe(previous); // rollback
      set({ isSaving: false, error: error.message || "Failed to save profile" });
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Other users' profiles
  // -------------------------------------------------------------------------
  fetchProfile: async ({ userId, fetchProfile } = {}) => {
    set({ isLoadingProfile: true, error: null });
    try {
      if (typeof fetchProfile !== "function") throw new Error("fetchProfile provider is required");
      const profile = await fetchProfile(userId);
      set((state) => ({
        profiles: { ...state.profiles, [userId]: profile },
        isLoadingProfile: false,
      }));
      return profile;
    } catch (error) {
      set({ isLoadingProfile: false, error: error.message || "Failed to load profile" });
      return null;
    }
  },

  getProfile: (userId) => (userId ? get().profiles[userId] || null : get().me),

  // -------------------------------------------------------------------------
  // Content lists
  // -------------------------------------------------------------------------
  fetchList: async ({ type, userId, refresh = false, fetchPage } = {}) => {
    const key = listKey(type, userId);
    const current = get().lists[key];
    if (current?.isLoading) return [];
    if (!refresh && current && !current.hasMore) return [];

    set((state) => {
      const base = current || makeList();
      const list = { ...base, isLoading: true, isRefreshing: refresh, error: null };
      return { lists: { ...state.lists, [key]: list } };
    });

    try {
      if (typeof fetchPage !== "function") throw new Error("fetchPage provider is required");
      const { items = [], nextCursor = null } = await fetchPage({
        type,
        userId,
        cursor: refresh ? undefined : current?.cursor ?? undefined,
        limit: PAGE_LIMIT,
      });

      set((state) => {
        const prev = state.lists[key] || makeList();
        const entities = { ...state.entities };
        items.forEach((item) => {
          entities[item.id] = item;
        });
        const list = {
          ...prev,
          ids: Array.from(new Set([...(refresh ? [] : prev.ids), ...items.map((i) => i.id)])),
          cursor: nextCursor,
          hasMore: Boolean(nextCursor),
          isLoading: false,
          isRefreshing: false,
        };
        return { lists: { ...state.lists, [key]: list }, entities };
      });
      return items;
    } catch (error) {
      set((state) => {
        const prev = state.lists[key] || makeList();
        const list = { ...prev, isLoading: false, isRefreshing: false, error: error.message };
        return { lists: { ...state.lists, [key]: list }, error: error.message };
      });
      return [];
    }
  },

  refreshList: ({ type, userId, fetchPage }) =>
    get().fetchList({ type, userId, refresh: true, fetchPage }),

  loadMoreList: ({ type, userId, fetchPage }) => get().fetchList({ type, userId, fetchPage }),

  resetList: ({ type, userId }) =>
    set((state) => ({
      lists: { ...state.lists, [listKey(type, userId)]: makeList() },
    })),

  getList: ({ type, userId }) => get().lists[listKey(type, userId)] || makeList(),

  // -------------------------------------------------------------------------
  // Follow graph
  // -------------------------------------------------------------------------
  toggleFollow: async ({ userId, follow, unfollow }) => {
    const isFollowing = get().following.includes(userId);
    set((state) => ({
      following: isFollowing
        ? state.following.filter((id) => id !== userId)
        : [...state.following, userId],
    }));

    try {
      const fn = isFollowing ? unfollow : follow;
      if (typeof fn === "function") await fn(userId);
    } catch (error) {
      set((state) => ({
        following: isFollowing
          ? [...state.following, userId]
          : state.following.filter((id) => id !== userId),
        error: error.message || "Failed to update follow",
      }));
    }
  },

  isFollowing: (userId) => get().following.includes(userId),
  setFollowing: (following = []) => set({ following }),
  setFollowers: (followers = []) => set({ followers }),

  removeFollower: (userId) =>
    set((state) => ({
      followers: state.followers.filter((id) => id !== userId),
    })),

  // -------------------------------------------------------------------------
  // Blocks (settings/privacy)
  // -------------------------------------------------------------------------
  blocked: [],
  toggleBlock: (userId) =>
    set((state) => {
      const blocked = state.blocked.includes(userId)
        ? state.blocked.filter((id) => id !== userId)
        : [...state.blocked, userId];
      return { blocked };
    }),

  isBlocked: (userId) => get().blocked.includes(userId),

  // -------------------------------------------------------------------------
  // Share / QR payload used by profile/share
  // -------------------------------------------------------------------------
  sharePayload: () => {
    const me = get().me;
    if (!me) return null;
    return {
      url: `gists://profile/${me.username || me.id}`,
      title: me.name || me.username,
      message: me.bio || "Check out my Gists profile",
    };
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ...initialState,
      lists: makeLists(),
    }),
}));

export default useProfileStore;
