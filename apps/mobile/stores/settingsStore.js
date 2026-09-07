import { create } from "zustand";

const initialSettings = {
  theme: "system",
  notificationsEnabled: true,
  messageNotifications: true,
  callNotifications: true,
  emailNotifications: true,
  pushNotifications: true,
  autoplayVideos: true,
  saveMediaToDevice: false,
  showOnlineStatus: true,
  showReadReceipts: true,
  allowMessageRequests: true,
  allowMentions: true,
  allowReposts: true,
  privateAccount: false,
  language: "en",
};

export const useSettingsStore = create((set) => ({
  ...initialSettings,

  setSetting: (key, value) =>
    set({
      [key]: value,
    }),

  updateSettings: (settings) =>
    set({
      ...settings,
    }),

  setTheme: (theme) => set({ theme }),

  toggle: (key) =>
    set((state) => ({
      [key]: !state[key],
    })),

  reset: () =>
    set({
      ...initialSettings,
    }),
}));

export default useSettingsStore;
