import { del, get, post } from "./api";

export async function getNotifications(params = {}) {
  return get("/notifications", { params });
}

export async function getUnreadCount() {
  return get("/notifications/unread-count");
}

export async function markAsRead(id) {
  return post(`/notifications/${id}/read`);
}

export async function markAllAsRead() {
  return post("/notifications/read-all");
}

export async function deleteNotification(id) {
  return del(`/notifications/${id}`);
}

export async function clearNotifications() {
  return del("/notifications");
}

export async function registerPushToken(token, platform) {
  return post("/notifications/push-token", {
    token,
    platform,
  });
}

export async function removePushToken(token) {
  return del("/notifications/push-token", {
    body: { token },
  });
}

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  registerPushToken,
  removePushToken,
};
