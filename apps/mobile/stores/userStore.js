import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  profile: null,
  followers: [],
  following: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : updates,
    })),

  setProfile: (profile) => set({ profile }),

  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : updates,
    })),

  setFollowers: (followers) => set({ followers: followers || [] }),

  setFollowing: (following) => set({ following: following || [] }),

  addFollower: (user) =>
    set((state) => ({
      followers: [
        user,
        ...state.followers.filter((item) => item.id !== user.id),
      ],
    })),

  removeFollower: (userId) =>
    set((state) => ({
      followers: state.followers.filter((user) => user.id !== userId),
    })),

  addFollowing: (user) =>
    set((state) => ({
      following: [
        user,
        ...state.following.filter((item) => item.id !== user.id),
      ],
    })),

  removeFollowing: (userId) =>
    set((state) => ({
      following: state.following.filter((user) => user.id !== userId),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      user: null,
      profile: null,
      followers: [],
      following: [],
      isLoading: false,
      error: null,
    }),
}));

export default useUserStore;
