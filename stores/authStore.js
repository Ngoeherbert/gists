// stores/authStore.js
// Authentication, session lifecycle, OTP flows and multi-account switching.
//
// Tokens are persisted with expo-secure-store (see utils/storage.js) — the
// store itself only keeps them in memory. Nothing here talks HTTP directly;
// `authenticate*` actions are the seam where an API client would be called.

import { create } from "zustand";
import {
  clearSession,
  getAccounts,
  getSession,
  setAccounts,
  setSession,
} from "../utils/storage";

// Auth funnel steps used by the (auth) route group.
export const AUTH_STATUS = {
  UNKNOWN: "unknown",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

const initialState = {
  status: AUTH_STATUS.UNKNOWN,
  isLoading: true, // true while restoring the session at boot
  error: null,

  user: null,
  tokens: { accessToken: null, refreshToken: null, expiresAt: null },
  isGuest: false,
  isOnboarded: false,

  // OTP / password-reset funnels
  pendingIdentity: null, // { type: "email" | "phone", value }
  pendingOtp: null, // { code?, resendAt, attempts, channel }
  otpCooldown: 0,

  // Multiple accounts (config.features.multipleAccounts)
  accounts: [], // [{ id, user, tokens, active }]
  activeAccountId: null,
};

const useAuthStore = create((set, get) => ({
  ...initialState,

  // -------------------------------------------------------------------------
  // Session restore / teardown
  // -------------------------------------------------------------------------
  restoreSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const [session, accounts] = await Promise.all([getSession(), getAccounts()]);
      if (!session?.user || !session?.tokens?.accessToken) {
        set({ ...initialState, isLoading: false, status: AUTH_STATUS.UNAUTHENTICATED });
        return null;
      }
      set({
        status: AUTH_STATUS.AUTHENTICATED,
        user: session.user,
        tokens: session.tokens,
        isOnboarded: Boolean(session.isOnboarded),
        accounts: accounts || [],
        activeAccountId: session.user.id ?? null,
        isLoading: false,
        error: null,
      });
      return session.user;
    } catch (error) {
      set({ isLoading: false, status: AUTH_STATUS.UNAUTHENTICATED, error: error.message });
      return null;
    }
  },

  setSession: async ({ user, tokens, isOnboarded = false }) => {
    await setSession({ user, tokens, isOnboarded });
    set({
      status: AUTH_STATUS.AUTHENTICATED,
      user,
      tokens,
      isOnboarded,
      error: null,
      isLoading: false,
    });
  },

  // Hand off to the API layer; returns the user on success.
  // `signin` is passed in by the caller (e.g. useAuth hook) to keep this store
  // free of a hard API dependency.
  login: async ({ identifier, password, signin }) => {
    set({ isLoading: true, error: null });
    try {
      if (typeof signin !== "function") throw new Error("signin provider is required");
      const { user, tokens } = await signin({ identifier, password });
      await get().setSession({ user, tokens });
      await get().addAccount({ user, tokens });
      return user;
    } catch (error) {
      set({ isLoading: false, error: error.message || "Unable to sign in" });
      return null;
    }
  },

  register: async ({ payload, register }) => {
    set({ isLoading: true, error: null });
    try {
      if (typeof register !== "function") throw new Error("register provider is required");
      const { user, tokens } = await register(payload);
      await get().setSession({ user, tokens });
      await get().addAccount({ user, tokens });
      return user;
    } catch (error) {
      set({ isLoading: false, error: error.message || "Unable to create account" });
      return null;
    }
  },

  loginAsGuest: () =>
    set({
      status: AUTH_STATUS.AUTHENTICATED,
      isGuest: true,
      user: { id: "guest", name: "Guest", username: "guest" },
      tokens: initialState.tokens,
      isLoading: false,
    }),

  logout: async ({ forget = true } = {}) => {
    await clearSession();
    set({
      ...initialState,
      isLoading: false,
      status: AUTH_STATUS.UNAUTHENTICATED,
      accounts: forget ? [] : get().accounts,
    });
  },

  setOnboarded: async (isOnboarded = true) => {
    set({ isOnboarded });
    const { user, tokens } = get();
    if (user && tokens.accessToken) await setSession({ user, tokens, isOnboarded });
  },

  updateUser: (patch) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...patch } : state.user,
    })),

  setTokens: (tokens) => set((state) => ({ tokens: { ...state.tokens, ...tokens } })),
  clearError: () => set({ error: null }),

  // -------------------------------------------------------------------------
  // OTP / password reset funnels
  // -------------------------------------------------------------------------
  startOtp: ({ type, value, channel = "sms", resendInSeconds = 60 } = {}) =>
    set({
      pendingIdentity: { type, value },
      pendingOtp: { channel, resendAt: Date.now() + resendInSeconds * 1000, attempts: 0 },
      otpCooldown: resendInSeconds,
    }),

  markOtpSent: (resendInSeconds = 60) =>
    set((state) => ({
      pendingOtp: {
        ...state.pendingOtp,
        resendAt: Date.now() + resendInSeconds * 1000,
      },
      otpCooldown: resendInSeconds,
    })),

  setOtpCooldown: (otpCooldown) => set({ otpCooldown }),

  verifyOtp: async ({ code, verify }) => {
    set({ isLoading: true, error: null });
    try {
      if (typeof verify !== "function") throw new Error("verify provider is required");
      const result = await verify({ ...get().pendingIdentity, code });
      set({
        isLoading: false,
        pendingOtp: null,
        ...(result?.user && result?.tokens
          ? { user: result.user, tokens: result.tokens, status: AUTH_STATUS.AUTHENTICATED }
          : {}),
      });
      return result;
    } catch (error) {
      set((state) => ({
        isLoading: false,
        error: error.message || "Invalid code",
        pendingOtp: state.pendingOtp
          ? { ...state.pendingOtp, attempts: state.pendingOtp.attempts + 1 }
          : null,
      }));
      return null;
    }
  },

  clearPendingAuth: () => set({ pendingIdentity: null, pendingOtp: null, otpCooldown: 0 }),

  // -------------------------------------------------------------------------
  // Multiple accounts
  // -------------------------------------------------------------------------
  addAccount: async ({ user, tokens }) => {
    if (!user?.id) return;
    const accounts = get().accounts.filter((a) => a.id !== user.id);
    const next = [...accounts, { id: user.id, user, tokens }];
    await setAccounts(next);
    set({ accounts: next, activeAccountId: user.id });
  },

  switchAccount: async (id) => {
    const account = get().accounts.find((a) => a.id === id);
    if (!account) return false;
    await get().setSession({ user: account.user, tokens: account.tokens });
    set({ activeAccountId: id });
    return true;
  },

  removeAccount: async (id) => {
    const next = get().accounts.filter((a) => a.id !== id);
    await setAccounts(next);
    set({ accounts: next });
    if (get().activeAccountId === id) await get().logout({ forget: false });
  },

  // -------------------------------------------------------------------------
  // Selectors
  // -------------------------------------------------------------------------
  isAuthenticated: () => get().status === AUTH_STATUS.AUTHENTICATED && !get().isGuest,

  reset: () => set({ ...initialState }),
}));

export default useAuthStore;
