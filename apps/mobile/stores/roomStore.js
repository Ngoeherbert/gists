import { create } from "zustand";

export const useRoomStore = create((set) => ({
  rooms: [],
  activeRoom: null,
  members: {},
  messages: {},
  isLoading: false,
  error: null,

  setRooms: (rooms) => set({ rooms: rooms || [] }),

  addRoom: (room) =>
    set((state) => ({
      rooms: [room, ...state.rooms],
    })),

  updateRoom: (roomId, updates) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, ...updates } : room,
      ),
    })),

  removeRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
    })),

  setActiveRoom: (room) => set({ activeRoom: room }),

  setMembers: (roomId, members) =>
    set((state) => ({
      members: {
        ...state.members,
        [roomId]: members || [],
      },
    })),

  addMember: (roomId, member) =>
    set((state) => ({
      members: {
        ...state.members,
        [roomId]: [...(state.members[roomId] || []), member],
      },
    })),

  removeMember: (roomId, memberId) =>
    set((state) => ({
      members: {
        ...state.members,
        [roomId]: (state.members[roomId] || []).filter(
          (member) => member.id !== memberId,
        ),
      },
    })),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages || [],
      },
    })),

  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    })),

  updateMessage: (roomId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: (state.messages[roomId] || []).map((message) =>
          message.id === messageId ? { ...message, ...updates } : message,
        ),
      },
    })),

  removeMessage: (roomId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: (state.messages[roomId] || []).filter(
          (message) => message.id !== messageId,
        ),
      },
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      rooms: [],
      activeRoom: null,
      members: {},
      messages: {},
      isLoading: false,
      error: null,
    }),
}));

export default useRoomStore;
