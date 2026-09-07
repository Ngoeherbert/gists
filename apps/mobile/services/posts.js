import { del, get, patch, post } from "./api";

export async function getFeed(params = {}) {
  return get("/posts/feed", { params });
}

export async function getPosts(params = {}) {
  return get("/posts", { params });
}

export async function getPost(id) {
  return get(`/posts/${id}`);
}

export async function createPost(data) {
  return post("/posts", data);
}

export async function updatePost(id, data) {
  return patch(`/posts/${id}`, data);
}

export async function deletePost(id) {
  return del(`/posts/${id}`);
}

export async function reactToPost(id, reaction) {
  return post(`/posts/${id}/reaction`, {
    reaction,
  });
}

export async function removePostReaction(id) {
  return del(`/posts/${id}/reaction`);
}

export async function savePost(id) {
  return post(`/posts/${id}/save`);
}

export async function unsavePost(id) {
  return del(`/posts/${id}/save`);
}

export async function repostPost(id, data = {}) {
  return post(`/posts/${id}/repost`, data);
}

export async function removeRepost(id) {
  return del(`/posts/${id}/repost`);
}

export async function sharePost(id, data = {}) {
  return post(`/posts/${id}/share`, data);
}

export async function getComments(id, params = {}) {
  return get(`/posts/${id}/comments`, { params });
}

export async function addComment(id, content, parentId = null) {
  return post(`/posts/${id}/comments`, {
    content,
    parentId,
  });
}

export async function updateComment(postId, commentId, content) {
  return patch(`/posts/${postId}/comments/${commentId}`, {
    content,
  });
}

export async function deleteComment(postId, commentId) {
  return del(`/posts/${postId}/comments/${commentId}`);
}

export async function reportPost(id, reason) {
  return post(`/posts/${id}/report`, {
    reason,
  });
}

export default {
  getFeed,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  reactToPost,
  removePostReaction,
  savePost,
  unsavePost,
  repostPost,
  removeRepost,
  sharePost,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  reportPost,
};
