// stores/storyStore.js
// Stories: the tray (grouped by author), the full-screen viewer, seen state,
// and composer drafts.

import { create } from "zustand";
import {
  createStoryProvider,
  storiesProvider,
} from "../utils/mockApi";

const initialState = {
  // Tray
  groups: [], // [{ id, author, stories: [...], hasUnseen, lastUpdatedAt }]
  isLoading: false,
  isRefreshing: false,
  error: null,

  // Viewer
  isViewerOpen: false,
  viewerGroupId: null,
  viewerIndex: 0,
  isPaused: false,
  isMuted: true,
  progress: 0, // 0..1 for the active story

  // Seen tracking (mirrored locally + pushed to server)
  seen: {}, // storyId -> true

  // Composer
  draft: null, // { media, mediaType, caption, duration, stickers, ... }
  isUploading: false,
  uploadProgress: 0,

  // Injectable API seam — see utils/mockApi.js for the local defaults.
  providers: {},
};

function groupHasUnseen(group, seen) {
  return Boolean(
    group?.hasUnseen &&
      group.stories?.some((story) => !seen[story.id] && !story.seen),
  );
}

const useStoryStore = create((set, get) => ({
  ...initialState,

  // Swap in a real API client (or clear it with `setProviders({})`).
  setProviders: (providers = {}) =>
    set((state) => {
      const merged = { ...state.providers, ...providers };
      return { providers: merged };
    }),

  // -------------------------------------------------------------------------
  // Tray
  // -------------------------------------------------------------------------
  fetchStories: async ({ refresh = false, fetchStories } = {}) => {
    set({ isLoading: !refresh, isRefreshing: refresh, error: null });
    try {
      const provider = fetchStories || get().providers.stories || storiesProvider;
      const groups = (await provider()) || [];
      set({ groups, isLoading: false, isRefreshing: false });
      return groups;
    } catch (error) {
      set({
        isLoading: false,
        isRefreshing: false,
        error: error.message || "Failed to load stories",
      });
      return [];
    }
  },

  setGroups: (groups = []) => set({ groups }),

  prependGroup: (group) => set((state) => ({ groups: [group, ...state.groups] })),

  upsertGroup: (group) =>
    set((state) => {
      const exists = state.groups.some((g) => g.id === group.id);
      return {
        groups: exists
          ? state.groups.map((g) => (g.id === group.id ? { ...g, ...group } : g))
          : [group, ...state.groups],
      };
    }),

  removeGroup: (groupId) =>
    set((state) => ({ groups: state.groups.filter((g) => g.id !== groupId) })),

  // -------------------------------------------------------------------------
  // Viewer
  // -------------------------------------------------------------------------
  openViewer: (groupId, index = 0) => {
    set({
      isViewerOpen: true,
      viewerGroupId: groupId,
      viewerIndex: index,
      isPaused: false,
      progress: 0,
    });
    get().markGroupSeen(groupId);
  },

  closeViewer: () =>
    set({ isViewerOpen: false, viewerGroupId: null, viewerIndex: 0, progress: 0, isPaused: false }),

  setViewerIndex: (viewerIndex) => set({ viewerIndex, progress: 0 }),

  nextStory: () => {
    const { viewerGroupId, viewerIndex, groups } = get();
    const group = groups.find((g) => g.id === viewerGroupId);
    if (!group) return false;
    if (viewerIndex < group.stories.length - 1) {
      set({ viewerIndex: viewerIndex + 1, progress: 0, isPaused: false });
      return true;
    }
    // Advance to the next group that has stories.
    const groupIdx = groups.findIndex((g) => g.id === viewerGroupId);
    const next = groups.slice(groupIdx + 1).find((g) => g.stories?.length);
    if (next) {
      get().openViewer(next.id, 0);
      return true;
    }
    get().closeViewer();
    return false;
  },

  prevStory: () => {
    const { viewerGroupId, viewerIndex, groups } = get();
    if (viewerIndex > 0) {
      set({ viewerIndex: viewerIndex - 1, progress: 0, isPaused: false });
      return true;
    }
    const groupIdx = groups.findIndex((g) => g.id === viewerGroupId);
    const prev = [...groups.slice(0, groupIdx)].reverse().find((g) => g.stories?.length);
    if (prev) {
      get().openViewer(prev.id, prev.stories.length - 1);
      return true;
    }
    return false;
  },

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setProgress: (progress) => set({ progress: Math.min(1, Math.max(0, progress)) }),

  currentStory: () => {
    const { groups, viewerGroupId, viewerIndex } = get();
    const group = groups.find((g) => g.id === viewerGroupId);
    return group?.stories?.[viewerIndex] || null;
  },

  // -------------------------------------------------------------------------
  // Seen state
  // -------------------------------------------------------------------------
  markSeen: (storyId) => {
    if (!storyId) return;
    set((state) => {
      if (state.seen[storyId]) return state;
      const seen = { ...state.seen, [storyId]: true };
      const groupIndex = state.groups.findIndex((group) =>
        Array.isArray(group.stories) && group.stories.some((story) => story?.id === storyId),
      );
      if (groupIndex === -1) return { seen };
      const group = state.groups[groupIndex];
      const groups = [...state.groups];
      groups[groupIndex] = {
        ...group,
        hasUnseen: groupHasUnseen(group, seen),
      };
      return { seen, groups };
    });
  },

  markGroupSeen: (groupId) =>
    set((state) => {
      const groupIndex = state.groups.findIndex((group) => group.id === groupId);
      if (groupIndex === -1) return state;
      const group = state.groups[groupIndex];
      const seen = { ...state.seen };
      group.stories?.forEach((story) => {
        seen[story.id] = true;
      });
      const groups = [...state.groups];
      groups[groupIndex] = {
        ...group,
        hasUnseen: false,
      };
      return { seen, groups };
    }),

  isSeen: (storyId) => Boolean(get().seen[storyId]) || Boolean(get().groups
    .flatMap((g) => g.stories || [])
    .find((s) => s.id === storyId)?.seen),

  clearSeen: () => set({ seen: {} }),

  // -------------------------------------------------------------------------
  // Interactions
  // -------------------------------------------------------------------------
  likeStory: ({ groupId, storyId, liked = true }) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              stories: g.stories.map((s) =>
                s.id === storyId
                  ? { ...s, isLiked: liked, likesCount: Math.max(0, (s.likesCount ?? 0) + (liked ? 1 : -1)) }
                  : s
              ),
            }
      ),
    })),

  replyToStory: ({ groupId, storyId, reply }) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              stories: g.stories.map((s) =>
                s.id === storyId ? { ...s, replies: [...(s.replies || []), reply] } : s
              ),
            }
      ),
    })),

  // -------------------------------------------------------------------------
  // Composer / upload
  // -------------------------------------------------------------------------
  setDraft: (draft) =>
    set((state) => {
      const next = { ...state.draft, ...draft };
      return { draft: next };
    }),

  updateDraft: (patch) =>
    set((state) => ({ draft: state.draft ? { ...state.draft, ...patch } : patch })),

  clearDraft: () => set({ draft: null, uploadProgress: 0, isUploading: false }),

  setUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),

  publishStory: async ({ create, payload }) => {
    set({ isUploading: true, uploadProgress: 0, error: null });
    try {
      const provider = create || get().providers.create || createStoryProvider;
      const story = await provider(payload ?? get().draft);
      set({ isUploading: false, uploadProgress: 1, draft: null });
      return story;
    } catch (error) {
      set({ isUploading: false, error: error.message || "Failed to publish story" });
      return null;
    }
  },

  deleteStory: ({ groupId, storyId }) =>
    set((state) => ({
      groups: state.groups
        .map((g) =>
          g.id !== groupId ? g : { ...g, stories: g.stories.filter((s) => s.id !== storyId) }
        )
        .filter((g) => g.stories?.length),
    })),

  clearError: () => set({ error: null }),

  reset: () => set({ ...initialState }),
}));

export default useStoryStore;
