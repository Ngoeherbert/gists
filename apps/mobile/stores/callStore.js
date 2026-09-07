import { create } from "zustand";

export const useCallStore = create((set) => ({
  call: null,
  callType: null,
  status: "idle",
  isMuted: false,
  isCameraEnabled: true,
  isSpeakerEnabled: true,
  isFrontCamera: true,
  duration: 0,
  error: null,

  startCall: ({ call, callType = "voice" }) =>
    set({
      call: call || null,
      callType,
      status: "connecting",
      duration: 0,
      error: null,
    }),

  setStatus: (status) => set({ status }),

  setDuration: (duration) => set({ duration }),

  incrementDuration: () =>
    set((state) => ({
      duration: state.duration + 1,
    })),

  toggleMute: () =>
    set((state) => ({
      isMuted: !state.isMuted,
    })),

  toggleCamera: () =>
    set((state) => ({
      isCameraEnabled: !state.isCameraEnabled,
    })),

  toggleSpeaker: () =>
    set((state) => ({
      isSpeakerEnabled: !state.isSpeakerEnabled,
    })),

  switchCamera: () =>
    set((state) => ({
      isFrontCamera: !state.isFrontCamera,
    })),

  setMuted: (isMuted) => set({ isMuted }),

  setCameraEnabled: (isCameraEnabled) => set({ isCameraEnabled }),

  setSpeakerEnabled: (isSpeakerEnabled) => set({ isSpeakerEnabled }),

  setError: (error) =>
    set({
      error,
      status: "failed",
    }),

  endCall: () =>
    set({
      call: null,
      callType: null,
      status: "ended",
      isMuted: false,
      isCameraEnabled: true,
      isSpeakerEnabled: true,
      isFrontCamera: true,
      duration: 0,
      error: null,
    }),

  reset: () =>
    set({
      call: null,
      callType: null,
      status: "idle",
      isMuted: false,
      isCameraEnabled: true,
      isSpeakerEnabled: true,
      isFrontCamera: true,
      duration: 0,
      error: null,
    }),
}));

export default useCallStore;
