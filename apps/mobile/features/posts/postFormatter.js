import { POST_TYPES, POST_AUDIENCE, POST_STATUS } from "./postConstants";

export function formatPost(post = {}) {
  return {
    ...post,
    id: getPostId(post),
    caption: formatCaption(post.caption || post.text),
    author: formatAuthor(post.author || post.user),
    media: formatMedia(post.media),
    type: post.type || POST_TYPES.TEXT,
    audience: post.audience || POST_AUDIENCE.EVERYONE,
    status: post.status || POST_STATUS.PUBLISHED,
    stats: formatPostStats(post),
  };
}

export function formatPosts(posts = []) {
  return posts.map(formatPost);
}

export function getPostId(post) {
  return post?.id || post?._id || null;
}

export function formatCaption(caption = "") {
  const value = String(caption || "").trim();

  return value;
}

export function formatAuthor(author = {}) {
  if (!author) return null;

  return {
    ...author,
    id: author.id || author._id || null,
    name: author.name || author.fullName || author.username || "User",
    username: author.username || "",
    avatar: author.avatar || author.profilePhoto || author.profileImage || null,
  };
}

export function formatMedia(media) {
  if (!media) return [];

  const items = Array.isArray(media) ? media : [media];

  return items.map((item) => ({
    ...item,
    id: item?.id || item?._id || null,
    url: item?.url || item?.uri || item?.source || null,
    type: item?.type || "image",
    thumbnail: item?.thumbnail || item?.thumbnailUrl || null,
  }));
}

export function formatPostStats(post = {}) {
  return {
    likes: Number(post.likesCount ?? post.likeCount ?? post.likes ?? 0),
    comments: Number(
      post.commentsCount ?? post.commentCount ?? post.comments ?? 0,
    ),
    reposts: Number(post.repostsCount ?? post.repostCount ?? post.reposts ?? 0),
    shares: Number(post.sharesCount ?? post.shareCount ?? post.shares ?? 0),
    saves: Number(post.savesCount ?? post.saveCount ?? post.saves ?? 0),
    views: Number(post.viewsCount ?? post.viewCount ?? post.views ?? 0),
  };
}

export function formatPostDate(post = {}) {
  const timestamp = post.createdAt || post.publishedAt || post.updatedAt;

  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatPostTime(post = {}) {
  const timestamp = post.createdAt || post.publishedAt || post.updatedAt;

  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatPostPreview(post = {}, maxLength = 120) {
  const text = formatCaption(post.caption || post.text);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

export default {
  formatPost,
  formatPosts,
  getPostId,
  formatCaption,
  formatAuthor,
  formatMedia,
  formatPostStats,
  formatPostDate,
  formatPostTime,
  formatPostPreview,
};
