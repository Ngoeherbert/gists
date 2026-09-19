// utils/reelCache.js
// TikTok-style offline cache for reel clips. While a reel sits near the
// viewport its full video is pulled into the app cache; once the download
// completes the player upgrades to the local file at the next safe boundary
// (activation or replay), so rewatching a reel never touches the network and
// can't stall on it.
//
// SDK 54: this uses the modern expo-file-system API (File / Directory /
// Paths). Transfers are deduped per source URI and idempotent, so repeated
// prefetches and interrupted downloads are safe.

import { Directory, File, Paths } from "expo-file-system";
import { hashSeed } from "./reelVisuals";

// In-flight downloads keyed by source URI, so rows asking for the same clip
// (common: the mock pool cycles a handful of sources) share one transfer.
const pending = new Map();

function reelsDir() {
  try {
    return new Directory(Paths.cache, "reels");
  } catch {
    return null; // platform without a usable cache directory (web)
  }
}

// Deterministic file name per source URI (stable across sessions).
export function reelCachePath(videoUri = "") {
  const dir = reelsDir();
  return dir ? `${dir.uri}/${hashSeed(videoUri)}.mp4` : null;
}

// The local file for a fully downloaded clip, or null. A pure disk check —
// no network, no waiting.
export function getCachedReelUri(videoUri) {
  const path = reelCachePath(videoUri);
  if (!path) return null;
  try {
    const file = new File(path);
    if (file.exists && file.size > 0) return file.uri;
  } catch {}
  return null;
}

// Download the full clip, or resolve immediately when it's already cached.
// Failures resolve to null — the caller keeps streaming remotely.
export function downloadReel(videoUri) {
  if (!videoUri) return Promise.resolve(null);
  const inFlight = pending.get(videoUri);
  if (inFlight) return inFlight;

  const task = (async () => {
    try {
      const dir = reelsDir();
      if (!dir) return null;
      if (!dir.exists) dir.create();

      const cached = getCachedReelUri(videoUri);
      if (cached) return cached;

      const file = await File.downloadFileAsync(
        videoUri,
        new File(dir, `${hashSeed(videoUri)}.mp4`),
        { idempotent: true },
      );
      return file.size > 0 ? file.uri : null;
    } catch {
      return null; // offline / blocked host — the remote stream still works
    } finally {
      pending.delete(videoUri);
    }
  })();

  pending.set(videoUri, task);
  return task;
}
