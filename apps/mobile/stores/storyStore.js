import { create } from "zustand";

export const useStoryStore = create((set) => ({
  stories: [],
  activeStory: null,
  activeIndex: 0,
  isPaused: false,
  isLoading: false,
  error: null,

  setStories: (stories) => set({ stories: stories || [] }),

  addStory: (story) =>
    set((state) => ({
      stories: [story, ...state.stories],
    })),

  updateStory: (storyId, updates) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === storyId ? { ...story, ...updates } : story,
      ),
    })),

  removeStory: (storyId) =>
    set((state) => ({
      stories: state.stories.filter((story) => story.id !== storyId),
    })),

  markViewed: (storyId) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === storyId ? { ...story, viewed: true } : story,
      ),
    })),

  setActiveStory: (story) =>
    set({
      activeStory: story,
      activeIndex: 0,
      isPaused: false,
    }),

  setActiveIndex: (activeIndex) => set({ activeIndex }),

  nextStory: () =>
    set((state) => ({
      activeIndex: state.activeIndex + 1,
    })),

  previousStory: () =>
    set((state) => ({
      activeIndex: Math.max(0, state.activeIndex - 1),
    })),

  setPaused: (isPaused) => set({ isPaused }),

  togglePaused: () =>
    set((state) => ({
      isPaused: !state.isPaused,
    })),

  closeStory: () =>
    set({
      activeStory: null,
      activeIndex: 0,
      isPaused: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      stories: [],
      activeStory: null,
      activeIndex: 0,
      isPaused: false,
      isLoading: false,
      error: null,
    }),
}));

export default useStoryStore;
