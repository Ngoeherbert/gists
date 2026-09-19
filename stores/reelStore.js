// stores/reelStore.js
// Vertical reels: feed + playback, per-reel engagement, comments and the
// editor/preview composer state used by app/(main)/reels/*.

import { create } from "zustand";
import config from "../constants/config";
import {
  commentsProvider,
  createReelProvider,
  reelProvider,
} from "../utils/mockApi";

const PAGE_LIMIT = config.pagination.defaultLimit;
const COMMENTS_LIMIT = config.pagination.commentsLimit;

const makeFeed = () => ({
  ids: [],
  cursor: null,
  hasMore: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
});

const initialState = {
  homeFeed: makeFeed(),
  followingFeed: makeFeed(),
  reels: {}, // reelId -> reel
  comments: {}, // reelId -> { ids, byId, cursor, hasMore, isLoading }

  // Playback (only one reel plays at a time)
  activeReelId: null,
  isPlaying: false,
  position: 0,
  duration: 0,

  // Viewing preference (off by default): when the visible reel finishes,
  // advance to the next one instead of looping. Toggled from the reel
  // options sheet.
  autoScrollEnabled: false,

  // Composer / editor
  draft: null,
  editor: { trim: null, music: null, effects: {}, text: [] },
  isUploading: false,
  uploadProgress: 0,

  // Injectable API seam — see utils/mockApi.js for the local defaults.
  providers: {},

  error: null,
};

const useReelStore = create((set, get) => ({
  ...initialState,

  // Swap in a real API client (or clear it with `setProviders({})`).
  setProviders: (providers = {}) =>
    set((state) => {
      const merged = { ...state.providers, ...providers };
      return { providers: merged };
    }),

  // -------------------------------------------------------------------------
  // Feed
  // -------------------------------------------------------------------------
  fetchReels: async ({ refresh = false, fetchPage, feedType = "home" } = {}) => {
    const current = get()[feedType === "home" ? "homeFeed" : "followingFeed"];
    if (current.isLoading) return [];
    if (!refresh && !current.hasMore) return [];

    set((state) => ({
      [feedType === "home" ? "homeFeed" : "followingFeed"]: {
        ...current,
        isLoading: true,
        isRefreshing: refresh,
        error: null,
      },
    }));

    try {
      const provider = fetchPage || get().providers.feed || reelProvider;
      const { items = [], nextCursor = null } = await provider({
        cursor: refresh ? undefined : current.cursor,
        limit: PAGE_LIMIT,
      });

      set((state) => {
        const prevIds = refresh ? [] : current.ids;
        const reels = { ...state.reels };
        items.forEach((r) => {
          reels[r.id] = r;
        });
        return {
          reels,
          [feedType === "home" ? "homeFeed" : "followingFeed"]: {
            ...current,
            ids: Array.from(new Set([...prevIds, ...items.map((r) => r.id)])),
            cursor: nextCursor,
            hasMore: Boolean(nextCursor),
            isLoading: false,
            isRefreshing: false,
          },
        };
      });
      return items;
    } catch (error) {
      set((state) => ({
        [feedType === "home" ? "homeFeed" : "followingFeed"]: {
          ...current,
          isLoading: false,
          isRefreshing: false,
          error: error.message || "Failed to load reels",
        },
        error: error.message,
      }));
      return [];
    }
  },

  refreshReels: (fetchPage) => get().fetchReels({ refresh: true, fetchPage }),
  loadMoreReels: (fetchPage) => get().fetchReels({ fetchPage }),

  setReels: (items = []) =>
    set((state) => {
      const reels = { ...state.reels };
      items.forEach((r) => {
        reels[r.id] = r;
      });
      return { reels };
    }),

  upsertReel: (reel) =>
    set((state) => {
      const next = {
        ...state.reels,
        [reel.id]: { ...state.reels[reel.id], ...reel },
      };
      return { reels: next };
    }),

  getReel: (reelId) => get().reels[reelId] || null,

  removeReel: (reelId) =>
    set((state) => {
      const { [reelId]: _removed, ...reels } = state.reels;
      return {
        reels,
        homeFeed: {
          ...state.homeFeed,
          ids: state.homeFeed.ids.filter((id) => id !== reelId),
        },
      };
    }),

  // Reposts — optimistic and reversible, mirroring feedStore.toggleRepost.
  toggleRepost: async ({ reelId, repost, unrepost }) => {
    const reel = get().reels[reelId];
    if (!reel) return;
    const wasReposted = Boolean(reel.isReposted);
    const count = reel.repostsCount ?? 0;

    get().upsertReel({
      ...reel,
      isReposted: !wasReposted,
      repostsCount: wasReposted ? Math.max(0, count - 1) : count + 1,
    });

    try {
      const fn = wasReposted ? unrepost : repost;
      if (typeof fn === "function") await fn(reelId);
    } catch (error) {
      get().upsertReel({ ...reel, isReposted: wasReposted, repostsCount: count });
      set({ error: error.message || "Failed to update repost" });
    }
  },

  // "Hide" from the reel options sheet: drop the reel from every feed and
  // the cache so the pager unmounts its row immediately.
  hideReel: (reelId) =>
    set((state) => {
      const { [reelId]: _removed, ...reels } = state.reels;
      return {
        reels,
        homeFeed: {
          ...state.homeFeed,
          ids: state.homeFeed.ids.filter((id) => id !== reelId),
        },
        followingFeed: {
          ...state.followingFeed,
          ids: state.followingFeed.ids.filter((id) => id !== reelId),
        },
      };
    }),

  // -------------------------------------------------------------------------
  // Playback
  // -------------------------------------------------------------------------
  setActiveReel: (activeReelId) =>
    set((state) =>
      state.activeReelId === activeReelId
        ? { isPlaying: true }
        : { activeReelId, isPlaying: true, position: 0 },
    ),
  setPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),

  toggleAutoScroll: () =>
    set((state) => ({ autoScrollEnabled: !state.autoScrollEnabled })),

  // -------------------------------------------------------------------------
  // Engagement (optimistic)
  // -------------------------------------------------------------------------
  toggleLike: async ({ reelId, like, unlike }) => {
    const reel = get().reels[reelId];
    if (!reel) return;
    const wasLiked = Boolean(reel.isLiked);
    const count = reel.likesCount ?? 0;

    get().upsertReel({
      ...reel,
      isLiked: !wasLiked,
      likesCount: wasLiked ? Math.max(0, count - 1) : count + 1,
    });

    try {
      const fn = wasLiked ? unlike : like;
      if (typeof fn === "function") await fn(reelId);
    } catch (error) {
      get().upsertReel({ ...reel, isLiked: wasLiked, likesCount: count });
      set({ error: error.message || "Failed to update like" });
    }
  },

  toggleSave: async ({ reelId, save, unsave }) => {
    const reel = get().reels[reelId];
    if (!reel) return;
    const wasSaved = Boolean(reel.isSaved);

    get().upsertReel({ ...reel, isSaved: !wasSaved });

    try {
      const fn = wasSaved ? unsave : save;
      if (typeof fn === "function") await fn(reelId);
    } catch (error) {
      get().upsertReel({ ...reel, isSaved: wasSaved });
      set({ error: error.message || "Failed to save reel" });
    }
  },

  incrementShare: (reelId) => {
    const reel = get().reels[reelId];
    if (reel)
      get().upsertReel({ ...reel, sharesCount: (reel.sharesCount ?? 0) + 1 });
  },

  incrementView: (reelId) => {
    const reel = get().reels[reelId];
    if (reel)
      get().upsertReel({ ...reel, viewsCount: (reel.viewsCount ?? 0) + 1 });
  },

  // -------------------------------------------------------------------------
  // Comments
  // -------------------------------------------------------------------------
  fetchComments: async ({ reelId, refresh = false, fetchPage } = {}) => {
    const existing = get().comments[reelId];
    if (existing?.isLoading) return [];

    set((state) => {
      const bucket = {
        ids: refresh ? [] : existing?.ids || [],
        byId: refresh ? {} : existing?.byId || {},
        cursor: refresh ? null : (existing?.cursor ?? null),
        hasMore: true,
        isLoading: true,
      };
      return { comments: { ...state.comments, [reelId]: bucket } };
    });

    try {
      const provider = fetchPage || get().providers.comments || commentsProvider;
      const { items = [], nextCursor = null } = await provider({
        reelId,
        cursor: refresh ? undefined : (existing?.cursor ?? undefined),
        limit: COMMENTS_LIMIT,
      });

      set((state) => {
        const prev = state.comments[reelId];
        const bucket = {
          ids: [...prev.ids, ...items.map((c) => c.id)],
          byId: { ...prev.byId },
          cursor: nextCursor,
          hasMore: Boolean(nextCursor),
          isLoading: false,
        };
        items.forEach((c) => {
          bucket.byId[c.id] = c;
        });
        return { comments: { ...state.comments, [reelId]: bucket } };
      });
      return items;
    } catch (error) {
      set((state) => {
        const bucket = { ...state.comments[reelId], isLoading: false };
        return {
          comments: { ...state.comments, [reelId]: bucket },
          error: error.message,
        };
      });
      return [];
    }
  },

  addComment: ({ reelId, comment }) =>
    set((state) => {
      const current = state.comments[reelId] || {
        ids: [],
        byId: {},
        cursor: null,
        hasMore: true,
        isLoading: false,
      };
      const reel = state.reels[reelId];
      const nextBucket = {
        ...current,
        ids: [comment.id, ...current.ids],
        byId: { ...current.byId, [comment.id]: comment },
      };
      const reels = reel
        ? {
            ...state.reels,
            [reelId]: { ...reel, commentsCount: (reel.commentsCount ?? 0) + 1 },
          }
        : state.reels;
      return { comments: { ...state.comments, [reelId]: nextBucket }, reels };
    }),

  removeComment: ({ reelId, commentId }) =>
    set((state) => {
      const bucket = state.comments[reelId];
      if (!bucket) return state;
      const { [commentId]: _removed, ...byId } = bucket.byId;
      const reel = state.reels[reelId];
      const nextBucket = {
        ...bucket,
        ids: bucket.ids.filter((id) => id !== commentId),
        byId,
      };
      const reels = reel
        ? {
            ...state.reels,
            [reelId]: {
              ...reel,
              commentsCount: Math.max(0, (reel.commentsCount ?? 1) - 1),
            },
          }
        : state.reels;
      return { comments: { ...state.comments, [reelId]: nextBucket }, reels };
    }),

  toggleCommentLike: ({ reelId, commentId }) =>
    set((state) => {
      const bucket = state.comments[reelId];
      const comment = bucket?.byId[commentId];
      if (!comment) return state;
      const nextComment = {
        ...comment,
        isLiked: !comment.isLiked,
        likesCount: Math.max(
          0,
          (comment.likesCount ?? 0) + (comment.isLiked ? -1 : 1),
        ),
      };
      const nextBucket = {
        ...bucket,
        byId: { ...bucket.byId, [commentId]: nextComment },
      };
      return { comments: { ...state.comments, [reelId]: nextBucket } };
    }),

  // -------------------------------------------------------------------------
  // Composer / editor
  // -------------------------------------------------------------------------
  setDraft: (draft) =>
    set((state) => {
      const next = { ...state.draft, ...draft };
      return { draft: next };
    }),

  setEditor: (patch) =>
    set((state) => {
      const editor = { ...state.editor, ...patch };
      return { editor };
    }),

  addEditorText: (item) =>
    set((state) => {
      const editor = { ...state.editor, text: [...state.editor.text, item] };
      return { editor };
    }),

  clearDraft: () =>
    set({
      draft: null,
      editor: { trim: null, music: null, effects: {}, text: [] },
    }),

  setUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),

  publishReel: async ({ create, payload }) => {
    set({ isUploading: true, uploadProgress: 0, error: null });
    try {
      const provider = create || get().providers.create || createReelProvider;
      const reel = await provider(payload ?? get().draft);
      set((state) => {
        const reels = { ...state.reels, [reel.id]: reel };
        const homeFeed = { ...state.homeFeed, ids: [reel.id, ...state.homeFeed.ids] };
        return {
          reels,
          homeFeed,
          isUploading: false,
          uploadProgress: 1,
          draft: null,
        };
      });
      return reel;
    } catch (error) {
      set({
        isUploading: false,
        error: error.message || "Failed to publish reel",
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ...initialState,
      homeFeed: makeFeed(),
      followingFeed: makeFeed(),
      editor: { trim: null, music: null, effects: {}, text: [] },
    }),
}));

export default useReelStore;
