// stores/appStore.js
// App-wide UI / device / network state. Nothing user-specific lives here;
// that belongs in authStore / profileStore.

import { create } from "zustand";
import config from "../constants/config";

const initialState = {
  // Lifecycle
  isReady: false, // app finished bootstrapping (fonts, session restore, ...)
  isOnline: true, // device connectivity
  isForeground: true, // app state: active vs background

  // Theme
  themeMode: "dark", // "dark" | "light" | "system"
  colors: null, // optional manual color override

  // UI chrome
  activeTab: "feeds",
  keyboardVisible: false,
  isTabBarHidden: false,

  // Global overlays / transient UI
  activeModal: null, // { type, props } | null
  activeSheet: null, // bottom sheet
  toast: null, // { id, type, message }
  globalLoading: false,

  // Feature flags (seeded from config, overridable at runtime)
  features: { ...config.features },

  // Routing intents (e.g. deep links waiting for auth)
  pendingRoute: null,

  // Onboarding funnel (transient, cleared once the account exists)
  hasSeenOnboarding: false,
  onboardingSlide: 0,
  signupRole: null, // "creator" | "viewer" | null
  interests: [], // selected interest ids
};

const useAppStore = create((set, get) => ({
  ...initialState,

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------
  setReady: (isReady = true) => set({ isReady }),

  setOnline: (isOnline) => set({ isOnline }),
  setForeground: (isForeground) => set({ isForeground }),

  // -------------------------------------------------------------------------
  // Theme
  // -------------------------------------------------------------------------
  setThemeMode: (themeMode) => set({ themeMode }),
  setColors: (colors) => set({ colors }),

  // -------------------------------------------------------------------------
  // UI chrome
  // -------------------------------------------------------------------------
  setActiveTab: (activeTab) => set({ activeTab }),
  setKeyboardVisible: (keyboardVisible) => set({ keyboardVisible }),
  hideTabBar: () => set({ isTabBarHidden: true }),
  showTabBar: () => set({ isTabBarHidden: false }),

  // -------------------------------------------------------------------------
  // Overlays
  // -------------------------------------------------------------------------
  openModal: (type, props = {}) => set({ activeModal: { type, props } }),
  closeModal: () => set({ activeModal: null }),

  openSheet: (type, props = {}) => set({ activeSheet: { type, props } }),
  closeSheet: () => set({ activeSheet: null }),

  showToast: (message, type = "info") =>
    set({ toast: { id: Date.now(), message, type } }),
  hideToast: () => set({ toast: null }),

  setGlobalLoading: (globalLoading) => set({ globalLoading }),

  // -------------------------------------------------------------------------
  // Feature flags
  // -------------------------------------------------------------------------
  setFeature: (key, value) =>
    set((state) => ({ features: { ...state.features, [key]: value } })),
  isFeatureEnabled: (key) => Boolean(get().features[key]),

  // -------------------------------------------------------------------------
  // Onboarding funnel
  // -------------------------------------------------------------------------
  completeOnboarding: () => set({ hasSeenOnboarding: true }),
  setOnboardingSlide: (onboardingSlide) => set({ onboardingSlide }),
  setSignupRole: (signupRole) => set({ signupRole }),

  toggleInterest: (interestId) =>
    set((state) => ({
      interests: state.interests.includes(interestId)
        ? state.interests.filter((id) => id !== interestId)
        : [...state.interests, interestId],
    })),

  setInterests: (interests) => set({ interests }),

  // -------------------------------------------------------------------------
  // Routing intents
  // -------------------------------------------------------------------------
  setPendingRoute: (pendingRoute) => set({ pendingRoute }),
  consumePendingRoute: () => {
    const { pendingRoute } = get();
    if (pendingRoute) set({ pendingRoute: null });
    return pendingRoute;
  },

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------
  reset: () => set({ ...initialState, features: { ...config.features } }),
}));

export default useAppStore;
