import { create } from "zustand";

export const useReelStore = create((set) => ({
  reels: [],
  activeReelId: null,
  isPlaying: true,
  isMuted: false,
  // When enabled the feed auto-advances to the next reel as soon as the
  // current reel's playback finishes.
  autoSkip: false,
  progress: 0,
  duration: 0,
  isLoading: false,
  error: null,

  setReels: (reels) => set({ reels: reels || [] }),

  addReel: (reel) =>
    set((state) => ({
      reels: [reel, ...state.reels],
    })),

  updateReel: (reelId, updates) =>
    set((state) => ({
      reels: state.reels.map((reel) =>
        reel.id === reelId ? { ...reel, ...updates } : reel,
      ),
    })),

  removeReel: (reelId) =>
    set((state) => ({
      reels: state.reels.filter((reel) => reel.id !== reelId),
    })),

  setActiveReel: (reelId) =>
    set({
      activeReelId: reelId,
      progress: 0,
    }),

  setPlaying: (isPlaying) => set({ isPlaying }),

  togglePlaying: () =>
    set((state) => ({
      isPlaying: !state.isPlaying,
    })),

  setAutoSkip: (autoSkip) => set({ autoSkip }),

  toggleAutoSkip: () =>
    set((state) => ({
      autoSkip: !state.autoSkip,
    })),

  setMuted: (isMuted) => set({ isMuted }),

  toggleMuted: () =>
    set((state) => ({
      isMuted: !state.isMuted,
    })),

  setProgress: (progress) =>
    set({
      progress: Math.max(0, Math.min(1, progress)),
    }),

  setDuration: (duration) => set({ duration: Math.max(0, duration) }),

  resetPlayback: () =>
    set({
      activeReelId: null,
      isPlaying: true,
      progress: 0,
      duration: 0,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      reels: [],
      activeReelId: null,
      isPlaying: true,
      isMuted: false,
      autoSkip: false,
      progress: 0,
      duration: 0,
      isLoading: false,
      error: null,
    }),
}));

export default useReelStore;
