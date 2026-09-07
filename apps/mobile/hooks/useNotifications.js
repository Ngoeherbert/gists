import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationsService from "../services/notifications";

export const notificationKeys = {
  all: ["notifications"],
  list: (params) => [...notificationKeys.all, "list", params],
  unreadCount: () => [...notificationKeys.all, "unread-count"],
};

export function useNotifications(params = {}, options = {}) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsService.getNotifications(params),
    ...options,
  });
}

export function useUnreadCount(options = {}) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationsService.getUnreadCount,
    ...options,
  });
}

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: notificationKeys.all,
    });
  };

  const markAsRead = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: invalidate,
  });

  const markAllAsRead = useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: invalidate,
  });

  const deleteNotification = useMutation({
    mutationFn: notificationsService.deleteNotification,
    onSuccess: invalidate,
  });

  const clearNotifications = useMutation({
    mutationFn: notificationsService.clearNotifications,
    onSuccess: invalidate,
  });

  const registerPushToken = useMutation({
    mutationFn: ({ token, platform }) =>
      notificationsService.registerPushToken(token, platform),
  });

  const removePushToken = useMutation({
    mutationFn: notificationsService.removePushToken,
  });

  return {
    markAsRead: markAsRead.mutateAsync,
    markAllAsRead: markAllAsRead.mutateAsync,
    deleteNotification: deleteNotification.mutateAsync,
    clearNotifications: clearNotifications.mutateAsync,
    registerPushToken: registerPushToken.mutateAsync,
    removePushToken: removePushToken.mutateAsync,

    isMarkingAsRead: markAsRead.isPending,
    isMarkingAllAsRead: markAllAsRead.isPending,
    isDeleting: deleteNotification.isPending,
    isClearing: clearNotifications.isPending,
  };
}

export default {
  useNotifications,
  useUnreadCount,
  useNotificationActions,
};
