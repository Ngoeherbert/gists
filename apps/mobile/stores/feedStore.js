import { create } from "zustand";

export const useFeedStore = create((set) => ({
  posts: [],
  stories: [],
  savedPosts: [],
  isRefreshing: false,
  isLoading: false,
  error: null,

  setPosts: (posts) => set({ posts: posts || [] }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePost: (postId, updates) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...updates } : post,
      ),
    })),

  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),

  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;

        const liked = !post.liked;

        return {
          ...post,
          liked,
          likesCount: Math.max(0, (post.likesCount || 0) + (liked ? 1 : -1)),
        };
      }),
    })),

  toggleSave: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          saved: !post.saved,
        };
      }),
    })),

  toggleRepost: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;

        const reposted = !post.reposted;

        return {
          ...post,
          reposted,
          repostsCount: Math.max(
            0,
            (post.repostsCount || 0) + (reposted ? 1 : -1),
          ),
        };
      }),
    })),

  setStories: (stories) => set({ stories: stories || [] }),

  markStoryViewed: (storyId) =>
    set((state) => ({
      stories: state.stories.map((story) =>
        story.id === storyId ? { ...story, viewed: true } : story,
      ),
    })),

  setSavedPosts: (savedPosts) => set({ savedPosts: savedPosts || [] }),

  setRefreshing: (isRefreshing) => set({ isRefreshing }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      posts: [],
      stories: [],
      savedPosts: [],
      isRefreshing: false,
      isLoading: false,
      error: null,
    }),
}));

export default useFeedStore;
