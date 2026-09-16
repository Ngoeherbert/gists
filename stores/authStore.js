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

// ---------------------------------------------------------------------------
// Default providers
//
// The store is transport-agnostic: real sign-in/register/verify calls are
// injected by the caller. Until an API client exists these local stubs keep the
// auth funnel fully usable, and every action still accepts a real provider.
// Replace by passing `signin` / `register` / `verify` (or set them globally via
// `setAuthProviders`) once your client is ready.
// ---------------------------------------------------------------------------
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function makeId(prefix = "user") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function makeTokens(identifier) {
  return {
    accessToken: `local.${identifier || "anon"}.${Date.now().toString(36)}`,
    refreshToken: `refresh.${Date.now().toString(36)}`,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
  };
}

// Derives a display name + username + avatar from whatever identifier was supplied.
function identityFrom(identifier) {
  if (!identifier) return { name: "Gists user", username: "gists.dev", email: "", avatarUrl: "https://i.pravatar.cc/200?img=12" };
  if (identifier.includes("@")) {
    const handle = identifier.split("@")[0];
    return { name: handle, username: handle.toLowerCase(), email: identifier, avatarUrl: `https://i.pravatar.cc/200?img=${(handle.charCodeAt(0) % 50) + 1}` };
  }
  return { name: identifier, username: String(identifier).replace(/\D/g, "").slice(-6) || "gists.dev", email: "", avatarUrl: "https://i.pravatar.cc/200?img=8" };
}

const localSignin = async ({ identifier, password }) => {
  await wait(600);
  if (!identifier || !password) throw new Error("Enter your email and password");
  const base = identityFrom(identifier);
  return {
    user: { id: makeId(), ...base, isNew: false, createdAt: new Date().toISOString() },
    tokens: makeTokens(identifier),
  };
};

const localRegister = async (payload = {}) => {
  await wait(700);
  if (!payload.email || !payload.password) throw new Error("Email and password are required");
  return {
    user: {
      id: makeId(),
      name: payload.name || identityFrom(payload.email).name,
      username: payload.username || identityFrom(payload.email).username,
      email: payload.email,
      phone: payload.phone || "",
      isNew: true,
      createdAt: new Date().toISOString(),
    },
    tokens: makeTokens(payload.email),
  };
};

const localVerify = async ({ code }) => {
  await wait(500);
  if (!code || String(code).length < 6) throw new Error("Invalid code");
  return { verified: true, code: String(code) };
};

const localResend = async () => {
  await wait(300);
  return { sent: true };
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

  // Injectable API seam. Left empty so the local stubs above are used; call
  // setAuthProviders({ signin, register, verify, resend }) to switch to a real
  // client. Per-call providers always take precedence over these.
  providers: {},
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

  // Register (or clear) the API providers used by every auth action.
  setAuthProviders: (providers = {}) =>
    set((state) => {
      const merged = { ...state.providers, ...providers };
      return { providers: merged };
    }),

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

  // Hand off to the API layer; returns the user on success. Pass `signin` to
  // use your real client — otherwise the local stub keeps the funnel working.
  login: async ({ identifier, password, signin }) => {
    set({ isLoading: true, error: null });
    try {
      const provider = signin || get().providers.signin || localSignin;
      const { user, tokens } = await provider({ identifier, password });
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
      const provider = register || get().providers.register || localRegister;
      const { user, tokens } = await provider(payload);
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
      user: { id: "guest", name: "Guest", username: "guest", avatarUrl: "https://i.pravatar.cc/200?img=12" },
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
      const provider = verify || get().providers.verify || localVerify;
      const result = await provider({ ...get().pendingIdentity, code });
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
