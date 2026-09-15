// stores/feedStore.js
// Feeds (home / following / discover), posts, comments and social actions
// (like, repost, save, share). Mutations are optimistic and reversible.

import { create } from "zustand";
import config from "../constants/config";
import {
  createPostProvider,
  commentsProvider,
  feedProvider,
} from "../utils/mockApi";

const PAGE_LIMIT = config.pagination.defaultLimit;
const COMMENTS_LIMIT = config.pagination.commentsLimit;

// Each feed tab keeps its own cursor/list so switching tabs does not thrash state.
const makeFeed = () => ({
  ids: [],
  cursor: null,
  hasMore: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastFetchedAt: null,
});

const initialState = {
  feeds: {
    home: makeFeed(),
    following: makeFeed(),
    discover: makeFeed(),
  },
  activeFeed: "home",

  posts: {}, // postId -> post
  comments: {}, // postId -> { ids, byId, cursor, hasMore, isLoading }
  drafts: [],
  bookmarks: [],

  // Injectable API seam — see utils/mockApi.js for the local defaults.
  providers: {},

  error: null,
};

const toggleInArray = (arr, value) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const useFeedStore = create((set, get) => ({
  ...initialState,

  // Swap in a real API client (or clear it with `setProviders({})`).
  setProviders: (providers = {}) =>
    set((state) => {
      const merged = { ...state.providers, ...providers };
      return { providers: merged };
    }),

  // -------------------------------------------------------------------------
  // Feed navigation + loading
  // -------------------------------------------------------------------------
  setActiveFeed: (activeFeed) => set({ activeFeed }),

  // `fetchPage` is injected by the caller (API layer) to keep this store
  // transport-agnostic: ({ cursor, limit, feed }) => { items, nextCursor }.
  fetchFeed: async ({
    feed = get().activeFeed,
    refresh = false,
    cursor,
    fetchPage,
  } = {}) => {
    const current = get().feeds[feed];
    if (!current || current.isLoading) return [];
    if (!refresh && !current.hasMore) return [];

    set((state) => ({
      feeds: {
        ...state.feeds,
        [feed]: {
          ...state.feeds[feed],
          isLoading: true,
          isRefreshing: refresh,
          error: null,
        },
      },
    }));

    try {
      const provider = fetchPage || get().providers.feed || feedProvider;
      const pageCursor = refresh ? undefined : (cursor ?? current.cursor);
      const { items = [], nextCursor = null } = await provider({
        feed,
        cursor: pageCursor,
        limit: PAGE_LIMIT,
      });

      set((state) => {
        const prevIds = refresh ? [] : state.feeds[feed].ids;
        const ids = [...prevIds, ...items.map((p) => p.id)];
        return {
          posts: {
            ...state.posts,
            ...Object.fromEntries(items.map((p) => [p.id, p])),
          },
          feeds: {
            ...state.feeds,
            [feed]: {
              ...state.feeds[feed],
              ids: Array.from(new Set(ids)),
              cursor: nextCursor,
              hasMore: Boolean(nextCursor),
              isLoading: false,
              isRefreshing: false,
              lastFetchedAt: Date.now(),
            },
          },
        };
      });
      return items;
    } catch (error) {
      set((state) => ({
        feeds: {
          ...state.feeds,
          [feed]: {
            ...state.feeds[feed],
            isLoading: false,
            isRefreshing: false,
            error: error.message || "Failed to load feed",
          },
        },
        error: error.message,
      }));
      return [];
    }
  },

  refreshFeed: (feed = get().activeFeed, fetchPage) =>
    get().fetchFeed({ feed, refresh: true, fetchPage }),

  loadMoreFeed: (feed = get().activeFeed, fetchPage) =>
    get().fetchFeed({ feed, fetchPage }),

  resetFeed: (feed = get().activeFeed) =>
    set((state) => {
      const feeds = { ...state.feeds, [feed]: makeFeed() };
      return { feeds };
    }),

  // -------------------------------------------------------------------------
  // Posts
  // -------------------------------------------------------------------------
  setPosts: (posts = []) =>
    set((state) => ({
      posts: {
        ...state.posts,
        ...Object.fromEntries(posts.map((p) => [p.id, p])),
      },
    })),

  upsertPost: (post) =>
    set((state) => ({
      posts: {
        ...state.posts,
        [post.id]: { ...state.posts[post.id], ...post },
      },
    })),

  removePost: (postId) =>
    set((state) => {
      const { [postId]: _removed, ...posts } = state.posts;
      return {
        posts,
        feeds: Object.fromEntries(
          Object.entries(state.feeds).map(([key, feed]) => [
            key,
            { ...feed, ids: feed.ids.filter((id) => id !== postId) },
          ]),
        ),
      };
    }),

  getPost: (postId) => get().posts[postId] || null,

  createPost: async ({ payload, create: createPost }) => {
    set({ error: null });
    try {
      const provider = createPost || get().providers.createPost || createPostProvider;
      const post = await provider(payload);
      get().upsertPost(post);
      set((state) => ({
        feeds: {
          ...state.feeds,
          home: {
            ...state.feeds.home,
            ids: [post.id, ...state.feeds.home.ids],
          },
        },
      }));
      return post;
    } catch (error) {
      set({ error: error.message || "Failed to publish post" });
      return null;
    }
  },

  editPost: async ({ postId, patch, update }) => {
    const previous = get().posts[postId];
    if (!previous) return null;
    get().upsertPost({ ...previous, ...patch });
    try {
      if (typeof update === "function") {
        const fresh = await update({ postId, patch });
        if (fresh) get().upsertPost(fresh);
      }
      return get().posts[postId];
    } catch (error) {
      get().upsertPost(previous); // rollback
      set({ error: error.message || "Failed to update post" });
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Social actions (optimistic)
  // -------------------------------------------------------------------------
  toggleLike: async ({ postId, like, unlike }) => {
    const post = get().posts[postId];
    if (!post) return;
    const wasLiked = Boolean(post.isLiked);
    const count = post.likesCount ?? post.likeCount ?? 0;
    const next = wasLiked ? Math.max(0, count - 1) : count + 1;

    get().upsertPost({
      ...post,
      isLiked: !wasLiked,
      likesCount: next,
      likeCount: next,
    });

    try {
      const fn = wasLiked ? unlike : like;
      if (typeof fn === "function") await fn(postId);
    } catch (error) {
      get().upsertPost({
        ...post,
        isLiked: wasLiked,
        likesCount: count,
        likeCount: count,
      });
      set({ error: error.message || "Failed to update like" });
    }
  },

  toggleRepost: async ({ postId, repost, unrepost }) => {
    const post = get().posts[postId];
    if (!post) return;
    const wasReposted = Boolean(post.isReposted);
    const count = post.repostsCount ?? 0;

    get().upsertPost({
      ...post,
      isReposted: !wasReposted,
      repostsCount: wasReposted ? Math.max(0, count - 1) : count + 1,
    });

    try {
      const fn = wasReposted ? unrepost : repost;
      if (typeof fn === "function") await fn(postId);
    } catch (error) {
      get().upsertPost({
        ...post,
        isReposted: wasReposted,
        repostsCount: count,
      });
      set({ error: error.message || "Failed to repost" });
    }
  },

  toggleSave: async ({ postId, save, unsave }) => {
    const post = get().posts[postId];
    if (!post) return;
    const wasSaved = Boolean(post.isSaved);

    get().upsertPost({ ...post, isSaved: !wasSaved });
    set((state) => ({ bookmarks: toggleInArray(state.bookmarks, postId) }));

    try {
      const fn = wasSaved ? unsave : save;
      if (typeof fn === "function") await fn(postId);
    } catch (error) {
      get().upsertPost({ ...post, isSaved: wasSaved });
      set((state) => ({ bookmarks: toggleInArray(state.bookmarks, postId) }));
      set({ error: error.message || "Failed to save post" });
    }
  },

  incrementShare: (postId) => {
    const post = get().posts[postId];
    if (post)
      get().upsertPost({ ...post, sharesCount: (post.sharesCount ?? 0) + 1 });
  },

  // -------------------------------------------------------------------------
  // Comments
  // -------------------------------------------------------------------------
  fetchComments: async ({ postId, refresh = false, fetchPage } = {}) => {
    const existing = get().comments[postId];
    if (existing?.isLoading) return [];

    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: {
          ids: refresh ? [] : existing?.ids || [],
          byId: refresh ? {} : existing?.byId || {},
          cursor: refresh ? null : (existing?.cursor ?? null),
          hasMore: true,
          isLoading: true,
        },
      },
    }));

    try {
      const provider = fetchPage || get().providers.comments || commentsProvider;
      const { items = [], nextCursor = null } = await provider({
        postId,
        cursor: refresh ? undefined : (existing?.cursor ?? undefined),
        limit: COMMENTS_LIMIT,
      });
      set((state) => {
        const prev = state.comments[postId];
        return {
          comments: {
            ...state.comments,
            [postId]: {
              ids: [...prev.ids, ...items.map((c) => c.id)],
              byId: {
                ...prev.byId,
                ...Object.fromEntries(items.map((c) => [c.id, c])),
              },
              cursor: nextCursor,
              hasMore: Boolean(nextCursor),
              isLoading: false,
            },
          },
        };
      });
      return items;
    } catch (error) {
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: { ...state.comments[postId], isLoading: false },
        },
        error: error.message,
      }));
      return [];
    }
  },

  addComment: ({ postId, comment }) => {
    set((state) => {
      const current = state.comments[postId] || {
        ids: [],
        byId: {},
        cursor: null,
        hasMore: true,
      };
      const post = state.posts[postId];
      return {
        comments: {
          ...state.comments,
          [postId]: {
            ...current,
            ids: [comment.id, ...current.ids],
            byId: { ...current.byId, [comment.id]: comment },
          },
        },
        posts: post
          ? {
              ...state.posts,
              [postId]: {
                ...post,
                commentsCount: (post.commentsCount ?? 0) + 1,
              },
            }
          : state.posts,
      };
    });
  },

  updateComment: ({ postId, commentId, patch }) =>
    set((state) => {
      const bucket = state.comments[postId];
      if (!bucket?.byId[commentId]) return state;
      return {
        comments: {
          ...state.comments,
          [postId]: {
            ...bucket,
            byId: {
              ...bucket.byId,
              [commentId]: { ...bucket.byId[commentId], ...patch },
            },
          },
        },
      };
    }),

  removeComment: ({ postId, commentId }) =>
    set((state) => {
      const bucket = state.comments[postId];
      if (!bucket) return state;
      const { [commentId]: _removed, ...byId } = bucket.byId;
      const post = state.posts[postId];
      return {
        comments: {
          ...state.comments,
          [postId]: {
            ...bucket,
            ids: bucket.ids.filter((id) => id !== commentId),
            byId,
          },
        },
        posts: post
          ? {
              ...state.posts,
              [postId]: {
                ...post,
                commentsCount: Math.max(0, (post.commentsCount ?? 1) - 1),
              },
            }
          : state.posts,
      };
    }),

  toggleCommentLike: ({ postId, commentId }) => {
    const comment = get().comments[postId]?.byId[commentId];
    if (!comment) return;
    get().updateComment({
      postId,
      commentId,
      patch: {
        isLiked: !comment.isLiked,
        likesCount: Math.max(
          0,
          (comment.likesCount ?? 0) + (comment.isLiked ? -1 : 1),
        ),
      },
    });
  },

  // -------------------------------------------------------------------------
  // Drafts
  // -------------------------------------------------------------------------
  saveDraft: (draft) =>
    set((state) => ({
      drafts: draft.id
        ? state.drafts.map((d) => (d.id === draft.id ? { ...d, ...draft } : d))
        : [{ ...draft, id: `draft-${Date.now()}` }, ...state.drafts],
    })),

  removeDraft: (draftId) =>
    set((state) => ({ drafts: state.drafts.filter((d) => d.id !== draftId) })),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ...initialState,
      feeds: { home: makeFeed(), following: makeFeed(), discover: makeFeed() },
    }),
}));

export default useFeedStore;
