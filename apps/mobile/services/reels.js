import { del, get, patch, post } from "./api";

export async function getReels(params = {}) {
  return get("/reels", { params });
}

export async function getReel(id) {
  return get(`/reels/${id}`);
}

export async function createReel(data) {
  return post("/reels", data);
}

export async function updateReel(id, data) {
  return patch(`/reels/${id}`, data);
}

export async function deleteReel(id) {
  return del(`/reels/${id}`);
}

export async function reactToReel(id, reaction) {
  return post(`/reels/${id}/reaction`, {
    reaction,
  });
}

export async function removeReelReaction(id) {
  return del(`/reels/${id}/reaction`);
}

export async function saveReel(id) {
  return post(`/reels/${id}/save`);
}

export async function unsaveReel(id) {
  return del(`/reels/${id}/save`);
}

export async function shareReel(id, data = {}) {
  return post(`/reels/${id}/share`, data);
}

export async function repostReel(id, data = {}) {
  return post(`/reels/${id}/repost`, data);
}

export async function getReelComments(id, params = {}) {
  return get(`/reels/${id}/comments`, { params });
}

export async function addReelComment(id, content, parentId = null) {
  return post(`/reels/${id}/comments`, {
    content,
    parentId,
  });
}

export async function deleteReelComment(reelId, commentId) {
  return del(`/reels/${reelId}/comments/${commentId}`);
}

export async function recordReelView(id) {
  return post(`/reels/${id}/view`);
}

export default {
  getReels,
  getReel,
  createReel,
  updateReel,
  deleteReel,
  reactToReel,
  removeReelReaction,
  saveReel,
  unsaveReel,
  shareReel,
  repostReel,
  getReelComments,
  addReelComment,
  deleteReelComment,
  recordReelView,
};
