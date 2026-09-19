// stores/profileStore.js
// The signed-in user's profile, other users' public profiles, follow graph and
// the tabbed content lists (posts / reels / likes / saved) on profile screens.

import { create } from "zustand";
import config from "../constants/config";
import {
  meProvider,
  profileListProvider,
  profileProvider,
} from "../utils/mockApi";
import { VERIFIED_USERS } from "../utils/mockApi";

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

  // Verified accounts: three tiers — blue, gold and custom (any preferred
  // colour). White badges render black-on-light and white-on-dark for contrast
  // in both modes. The VerifiedBadge component consumes getVerifiedBadge(userId).
  verifiedUsers: VERIFIED_USERS,

  // Injectable API seam — see utils/mockApi.js for the local defaults.
  providers: {},
};

const listKey = (type, userId) => `${type}:${userId || "me"}`;

const useProfileStore = create((set, get) => ({
  ...initialState,

  // Swap in a real API client (or clear it with `setProviders({})`).
  setProviders: (providers = {}) =>
    set((state) => {
      const merged = { ...state.providers, ...providers };
      return { providers: merged };
    }),

  // -------------------------------------------------------------------------
  // Own profile
  // -------------------------------------------------------------------------
  fetchMe: async ({ fetchMe } = {}) => {
    set({ isLoadingMe: true, error: null });
    try {
      const provider = fetchMe || get().providers.me || meProvider;
      const me = await provider();
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
  // Verified accounts: three tiers — blue, gold and custom (any preferred
  // colour). White badges render black-on-light and white-on-dark for contrast
  // in both modes. The VerifiedBadge component consumes getVerifiedBadge(userId).
  // -------------------------------------------------------------------------
  getVerifiedBadge: (userId) => {
    const entry = get().verifiedUsers[userId];
    if (!entry) return { tier: "none", color: "#34B7F1" };
    const tier = entry.tier;
    const color = entry.color || "#34B7F1";
    const isWhiteBadge = color === "#FFFFFF" || color.toLowerCase() === "#ffffff";
    const isDarkTheme = get().themeMode === "dark";
    const iconColor = isWhiteBadge
      ? (isDarkTheme ? "#FFFFFF" : "#000000")
      : color;
    return { tier, color, iconColor, isWhiteBadge, isDarkTheme };
  },
  setVerifiedBadge: (userId, { tier, color }) =>
    set((state) => ({
      verifiedUsers: { ...state.verifiedUsers, [userId]: { tier, color } },
    })),

  // Share / QR payload used by profile/share
  // -------------------------------------------------------------------------
  // Other users' profiles
  // -------------------------------------------------------------------------
  fetchProfile: async ({ userId, fetchProfile } = {}) => {
    set({ isLoadingProfile: true, error: null });
    try {
      const provider = fetchProfile || get().providers.profile || profileProvider;
      const profile = await provider(userId);
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
      const provider = fetchPage || get().providers.list || profileListProvider;
      const { items = [], nextCursor = null } = await provider({
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

// Exported helpers for use in components
export const verifiedBadge = {
  tiers: {
    blue: { tier: "blue", color: "#34B7F1" },
    gold: { tier: "gold", color: "#FFD700" },
    custom: { tier: "custom" },
  },
  defaultColor: "#34B7F1",
};
