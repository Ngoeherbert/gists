import { del, get, patch, post } from "./api";

export async function getStories(params = {}) {
  return get("/stories", { params });
}

export async function getStory(id) {
  return get(`/stories/${id}`);
}

export async function createStory(data) {
  return post("/stories", data);
}

export async function updateStory(id, data) {
  return patch(`/stories/${id}`, data);
}

export async function deleteStory(id) {
  return del(`/stories/${id}`);
}

export async function markStoryViewed(id) {
  return post(`/stories/${id}/view`);
}

export async function reactToStory(id, reaction) {
  return post(`/stories/${id}/reaction`, {
    reaction,
  });
}

export async function replyToStory(id, content) {
  return post(`/stories/${id}/reply`, {
    content,
  });
}

export async function shareStory(id, data = {}) {
  return post(`/stories/${id}/share`, data);
}

export async function getStoryViewers(id, params = {}) {
  return get(`/stories/${id}/viewers`, { params });
}

export default {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  markStoryViewed,
  reactToStory,
  replyToStory,
  shareStory,
  getStoryViewers,
};
