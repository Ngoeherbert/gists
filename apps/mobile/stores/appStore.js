import { create } from "zustand";

export const useAppStore = create((set) => ({
  isInitialized: false,
  isOnline: true,
  isLoading: false,
  theme: "system",
  activeModal: null,
  toast: null,

  setInitialized: (isInitialized) => set({ isInitialized }),

  setOnline: (isOnline) => set({ isOnline }),

  setLoading: (isLoading) => set({ isLoading }),

  setTheme: (theme) => set({ theme }),

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),

  showToast: (toast) =>
    set({
      toast:
        typeof toast === "string" ? { message: toast, type: "info" } : toast,
    }),

  hideToast: () => set({ toast: null }),

  reset: () =>
    set({
      isInitialized: false,
      isOnline: true,
      isLoading: false,
      theme: "system",
      activeModal: null,
      toast: null,
    }),
}));

export default useAppStore;
