import { POST_TYPES, POST_AUDIENCE, POST_STATUS } from "./postConstants";

export function getPostId(post) {
  return post?.id || post?._id || null;
}

export function getPostAuthor(post) {
  return post?.author || post?.user || post?.creator || null;
}

export function getPostAuthorId(post) {
  const author = getPostAuthor(post);

  return author?.id || author?._id || post?.authorId || post?.userId || null;
}

export function isPostOwnedByUser(post, userId) {
  const authorId = getPostAuthorId(post);

  return (
    authorId !== null &&
    authorId !== undefined &&
    String(authorId) === String(userId)
  );
}

export function isTextPost(post) {
  return post?.type === POST_TYPES.TEXT;
}

export function isImagePost(post) {
  return post?.type === POST_TYPES.IMAGE;
}

export function isVideoPost(post) {
  return post?.type === POST_TYPES.VIDEO;
}

export function isMixedPost(post) {
  return post?.type === POST_TYPES.MIXED;
}

export function isPublishedPost(post) {
  return post?.status === POST_STATUS.PUBLISHED || !post?.status;
}

export function isDraftPost(post) {
  return post?.status === POST_STATUS.DRAFT;
}

export function isArchivedPost(post) {
  return post?.status === POST_STATUS.ARCHIVED;
}

export function isDeletedPost(post) {
  return post?.status === POST_STATUS.DELETED;
}

export function isPostPublic(post) {
  return !post?.audience || post.audience === POST_AUDIENCE.EVERYONE;
}

export function isFollowersOnlyPost(post) {
  return post?.audience === POST_AUDIENCE.FOLLOWERS;
}

export function isCloseFriendsPost(post) {
  return post?.audience === POST_AUDIENCE.CLOSE_FRIENDS;
}

export function isPrivatePost(post) {
  return post?.audience === POST_AUDIENCE.ONLY_ME;
}

export function getPostMedia(post) {
  if (Array.isArray(post?.media)) {
    return post.media;
  }

  if (post?.media) {
    return [post.media];
  }

  if (Array.isArray(post?.attachments)) {
    return post.attachments;
  }

  return [];
}

export function getPostMediaCount(post) {
  return getPostMedia(post).length;
}

export function getPostCaption(post) {
  return post?.caption || post?.text || "";
}

export function getPostLocation(post) {
  return post?.location || null;
}

export function getPostHashtags(post) {
  if (Array.isArray(post?.hashtags)) {
    return post.hashtags;
  }

  return [];
}

export function getPostMentions(post) {
  if (Array.isArray(post?.mentions)) {
    return post.mentions;
  }

  return [];
}

export function getPostStats(post = {}) {
  return {
    likes: Number(post.likesCount ?? post.likeCount ?? 0),
    comments: Number(post.commentsCount ?? post.commentCount ?? 0),
    reposts: Number(post.repostsCount ?? post.repostCount ?? 0),
    shares: Number(post.sharesCount ?? post.shareCount ?? 0),
    saves: Number(post.savesCount ?? post.saveCount ?? 0),
    views: Number(post.viewsCount ?? post.viewCount ?? 0),
  };
}

export function isPostLikedByUser(post) {
  return Boolean(post?.liked || post?.isLiked || post?.userReaction);
}

export function isPostSavedByUser(post) {
  return Boolean(post?.saved || post?.isSaved);
}

export function isPostRepostedByUser(post) {
  return Boolean(post?.reposted || post?.isReposted);
}

export function getPostReaction(post) {
  return post?.userReaction || post?.reaction || null;
}

export function getPostCreatedAt(post) {
  return post?.createdAt || post?.publishedAt || null;
}

export function getPostUpdatedAt(post) {
  return post?.updatedAt || null;
}

export function sortPostsByDate(posts = [], descending = true) {
  return [...posts].sort((a, b) => {
    const first = new Date(getPostCreatedAt(a) || 0).getTime();

    const second = new Date(getPostCreatedAt(b) || 0).getTime();

    return descending ? second - first : first - second;
  });
}

export default {
  getPostId,
  getPostAuthor,
  getPostAuthorId,
  isPostOwnedByUser,
  isTextPost,
  isImagePost,
  isVideoPost,
  isMixedPost,
  isPublishedPost,
  isDraftPost,
  isArchivedPost,
  isDeletedPost,
  isPostPublic,
  isFollowersOnlyPost,
  isCloseFriendsPost,
  isPrivatePost,
  getPostMedia,
  getPostMediaCount,
  getPostCaption,
  getPostLocation,
  getPostHashtags,
  getPostMentions,
  getPostStats,
  isPostLikedByUser,
  isPostSavedByUser,
  isPostRepostedByUser,
  getPostReaction,
  getPostCreatedAt,
  getPostUpdatedAt,
  sortPostsByDate,
};
