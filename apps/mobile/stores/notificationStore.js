import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setNotifications: (notifications) =>
    set({
      notifications: notifications || [],
      unreadCount: (notifications || []).filter(
        (notification) => !notification.read
      ).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        notification,
        ...state.notifications,
      ],
      unreadCount: notification.read
        ? state.unreadCount
        : state.unreadCount + 1,
    })),

  markAsRead: (notificationId) =>
    set((state) => {
      const notification = state.notifications.find(
        (item) => item.id === notificationId
      );

      return {
        notifications: state.notifications.map((item) =>
          item.id === notificationId
            ? { ...item, read: true }
            : item
        ),
        unreadCount:
          notification && !notification.read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map(
        (notification) => ({
          ...notification,
          read: true,
        })
      ),
      unreadCount: 0,
    })),

  removeNotification: (notificationId) =>
    set((state) => {
      const notification = state.notifications.find(
        (item) => item.id === notificationId
      );

      return {
        notifications: state.notifications.filter(
          (item) => item.id !== notificationId
        ),
        unreadCount:
          notification && !notification.read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
    }),

  setUnreadCount: (unreadCount) =>
    set({
      unreadCount: Math.max(0, unreadCount),
    }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  setError: (error) =>
    set({ error }),

  clearError: () =>
    set({ error: null }),

  reset: () =>
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
    }),
}));

export default useNotificationStore;