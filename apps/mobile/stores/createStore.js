import { create } from "zustand";

const initialState = {
  mode: null,
  media: [],
  caption: "",
  location: null,
  hashtags: [],
  mentions: [],
  audience: "everyone",
  allowComments: true,
  allowReposts: true,
  allowSharing: true,
  isUploading: false,
  uploadProgress: 0,
  error: null,
};

export const useCreateStore = create((set) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),

  addMedia: (media) =>
    set((state) => ({
      media: [...state.media, media],
    })),

  setMedia: (media) =>
    set({
      media: media || [],
    }),

  removeMedia: (index) =>
    set((state) => ({
      media: state.media.filter((_, i) => i !== index),
    })),

  clearMedia: () => set({ media: [] }),

  setCaption: (caption) => set({ caption }),

  setLocation: (location) => set({ location }),

  clearLocation: () => set({ location: null }),

  setHashtags: (hashtags) => set({ hashtags: hashtags || [] }),

  addHashtag: (hashtag) =>
    set((state) => ({
      hashtags: state.hashtags.includes(hashtag)
        ? state.hashtags
        : [...state.hashtags, hashtag],
    })),

  removeHashtag: (hashtag) =>
    set((state) => ({
      hashtags: state.hashtags.filter((item) => item !== hashtag),
    })),

  setMentions: (mentions) => set({ mentions: mentions || [] }),

  addMention: (mention) =>
    set((state) => ({
      mentions: state.mentions.includes(mention)
        ? state.mentions
        : [...state.mentions, mention],
    })),

  removeMention: (mention) =>
    set((state) => ({
      mentions: state.mentions.filter((item) => item !== mention),
    })),

  setAudience: (audience) => set({ audience }),

  setAllowComments: (allowComments) => set({ allowComments }),

  setAllowReposts: (allowReposts) => set({ allowReposts }),

  setAllowSharing: (allowSharing) => set({ allowSharing }),

  setUploading: (isUploading) => set({ isUploading }),

  setUploadProgress: (uploadProgress) =>
    set({
      uploadProgress: Math.min(100, Math.max(0, uploadProgress)),
    }),

  setError: (error) => set({ error }),

  reset: () => set({ ...initialState }),
}));

export default useCreateStore;
