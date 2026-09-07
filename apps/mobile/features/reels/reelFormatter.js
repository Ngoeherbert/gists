// apps/mobile/features/reels/reelFormatter.js

import { formatNumber } from "../../utils/formatNumber";
import { formatTime } from "../../utils/formatTime";
import { formatDate } from "../../utils/formatDate";

export function formatReel(reel = {}) {
  return {
    ...reel,
    id: reel.id || reel.reelId || null,
    caption: reel.caption || "",
    videoUrl: reel.videoUrl || reel.video?.url || reel.url || null,
    thumbnail:
      reel.thumbnail ||
      reel.thumbnailUrl ||
      reel.cover ||
      reel.video?.thumbnail ||
      null,
    duration: Number(reel.duration || 0),
    author: reel.author || reel.user || null,
    likesCount: Number(reel.likesCount || reel.likes || 0),
    commentsCount: Number(reel.commentsCount || reel.comments || 0),
    sharesCount: Number(reel.sharesCount || reel.shares || 0),
    viewsCount: Number(reel.viewsCount || reel.views || 0),
    repostsCount: Number(reel.repostsCount || reel.reposts || 0),
    savesCount: Number(reel.savesCount || reel.saves || 0),
    isLiked: Boolean(reel.isLiked || reel.liked),
    isSaved: Boolean(reel.isSaved || reel.saved),
    isReposted: Boolean(reel.isReposted || reel.reposted),
  };
}

export function formatReels(reels = []) {
  return reels.map(formatReel);
}

export function formatReelId(reel) {
  return reel?.id || reel?.reelId || null;
}

export function formatReelCaption(reel) {
  return reel?.caption || "";
}

export function formatReelDuration(reel) {
  return formatTime(Number(reel?.duration || 0));
}

export function formatReelStats(reel = {}) {
  return {
    likes: Number(reel.likesCount || reel.likes || 0),
    comments: Number(reel.commentsCount || reel.comments || 0),
    shares: Number(reel.sharesCount || reel.shares || 0),
    views: Number(reel.viewsCount || reel.views || 0),
    reposts: Number(reel.repostsCount || reel.reposts || 0),
    saves: Number(reel.savesCount || reel.saves || 0),
  };
}

export function formatReelStatCount(value) {
  return formatNumber(Number(value || 0));
}

export function formatReelDate(date) {
  return date ? formatDate(date) : "";
}

export function formatReelPreview(reel, maxLength = 120) {
  const caption = String(reel?.caption || "").trim();

  if (!caption) return "";

  if (caption.length <= maxLength) return caption;

  return `${caption.slice(0, maxLength - 3).trim()}...`;
}

export default {
  formatReel,
  formatReels,
  formatReelId,
  formatReelCaption,
  formatReelDuration,
  formatReelStats,
  formatReelStatCount,
  formatReelDate,
  formatReelPreview,
};
