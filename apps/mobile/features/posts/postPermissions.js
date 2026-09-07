import { POST_AUDIENCE } from "./postConstants";
import { isPostOwnedByUser } from "./postHelpers";

export function canCreatePost(user) {
  return Boolean(user?.id || user?._id);
}

export function canEditPost(post, userId) {
  return isPostOwnedByUser(post, userId);
}

export function canDeletePost(post, userId, isAdmin = false) {
  return isPostOwnedByUser(post, userId) || isAdmin;
}

export function canReactToPost(post) {
  return Boolean(post?.id || post?._id);
}

export function canCommentOnPost(post) {
  if (!post) return false;

  return post.audience !== POST_AUDIENCE.ONLY_ME;
}

export function canSharePost(post) {
  if (!post) return false;

  return post.audience !== POST_AUDIENCE.ONLY_ME;
}

export function canRepostPost(post) {
  if (!post) return false;

  return post.audience === POST_AUDIENCE.EVERYONE;
}

export function canSavePost(post) {
  return Boolean(post?.id || post?._id);
}

export function canReportPost(post, userId) {
  if (!post || !userId) return false;

  return !isPostOwnedByUser(post, userId);
}

export function canChangeAudience(post, userId) {
  return isPostOwnedByUser(post, userId);
}

export function canManagePost(post, userId, isAdmin = false) {
  return {
    edit: canEditPost(post, userId),
    delete: canDeletePost(post, userId, isAdmin),
    react: canReactToPost(post),
    comment: canCommentOnPost(post),
    share: canSharePost(post),
    repost: canRepostPost(post),
    save: canSavePost(post),
    report: canReportPost(post, userId),
    changeAudience: canChangeAudience(post, userId),
  };
}

export default {
  canCreatePost,
  canEditPost,
  canDeletePost,
  canReactToPost,
  canCommentOnPost,
  canSharePost,
  canRepostPost,
  canSavePost,
  canReportPost,
  canChangeAudience,
  canManagePost,
};
