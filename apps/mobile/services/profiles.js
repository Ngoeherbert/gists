import { del, get, patch, post } from "./api";

export async function getMyProfile() {
  return get("/profiles/me");
}

export async function getProfile(username) {
  return get(`/profiles/${username}`);
}

export async function updateProfile(data) {
  return patch("/profiles/me", data);
}

export async function updateProfilePhoto(data) {
  return patch("/profiles/me/photo", data);
}

export async function followUser(userId) {
  return post(`/profiles/${userId}/follow`);
}

export async function unfollowUser(userId) {
  return del(`/profiles/${userId}/follow`);
}

export async function getFollowers(userId, params = {}) {
  return get(`/profiles/${userId}/followers`, { params });
}

export async function getFollowing(userId, params = {}) {
  return get(`/profiles/${userId}/following`, { params });
}

export async function searchUsers(query, params = {}) {
  return get("/profiles/search", {
    params: {
      query,
      ...params,
    },
  });
}

export async function blockUser(userId) {
  return post(`/profiles/${userId}/block`);
}

export async function unblockUser(userId) {
  return del(`/profiles/${userId}/block`);
}

export async function reportUser(userId, reason) {
  return post(`/profiles/${userId}/report`, {
    reason,
  });
}

export async function getUserPosts(userId, params = {}) {
  return get(`/profiles/${userId}/posts`, { params });
}

export async function getUserReels(userId, params = {}) {
  return get(`/profiles/${userId}/reels`, { params });
}

export async function getUserStats(userId) {
  return get(`/profiles/${userId}/stats`);
}

export default {
  getMyProfile,
  getProfile,
  updateProfile,
  updateProfilePhoto,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  blockUser,
  unblockUser,
  reportUser,
  getUserPosts,
  getUserReels,
  getUserStats,
};
