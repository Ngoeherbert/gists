import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  setToken: (token) => set({ token }),

  setRefreshToken: (refreshToken) => set({ refreshToken }),

  setSession: ({ user, token, refreshToken }) =>
    set({
      user: user || null,
      token: token || null,
      refreshToken: refreshToken || null,
      isAuthenticated: Boolean(user && token),
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  logout: () =>
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),

  reset: () =>
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),
}));

export default useAuthStore;
