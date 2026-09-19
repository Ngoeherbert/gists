// utils/reelVisuals.js
// Presentation helpers for the vertical reel player.
//
// The mock provider serves real sample MP4s (utils/mockApi.js -> `videoUri`),
// so expo-video paints actual frames. The deterministic gradient poster stays
// as the first-frame placeholder (and the full fallback for reels with no
// source yet), and the preview clock drives the scrubber for those
// poster-only reels. Everything here is pure (no imports, no side effects)
// so it can be unit tested directly.

// Dark, on-brand poster gradients: [from, via, to]. Each reel always resolves
// to the same palette because the index is derived from its id.
export const POSTER_GRADIENTS = [
  ["#2A1B5E", "#6C5CE7", "#0B0B0F"],
  ["#0E3A56", "#00C2FF", "#0B0B0F"],
  ["#5A1140", "#FF4D8D", "#0B0B0F"],
  ["#123A2C", "#22C55E", "#0B0B0F"],
  ["#4A2B0C", "#F59E0B", "#0B0B0F"],
  ["#1B2A5E", "#3B82F6", "#0B0B0F"],
  ["#3E1450", "#8B5CF6", "#0B0B0F"],
  ["#0A3B3B", "#14B8A6", "#0B0B0F"],
];

// Gradient direction: the light source sits in the top-left corner and fades
// into the app background at the bottom-right, behind the caption block.
export const POSTER_START = { x: 0, y: 0 };
export const POSTER_END = { x: 1, y: 1 };
export const POSTER_LOCATIONS = [0, 0.55, 1];

// djb2-style string hash -> non-negative integer. Stable across renders and
// sessions, which is what keeps a reel's poster from flickering.
export function hashSeed(seed = "") {
  let hash = 5381;
  const value = String(seed);
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// The [from, via, to] triple painted behind a reel.
export function reelPoster(seed = "") {
  return POSTER_GRADIENTS[hashSeed(seed) % POSTER_GRADIENTS.length];
}

// The accent (middle) stop, used for the poster's coloured wash. Returned as a
// bare hex so callers can append an alpha pair, e.g. `${reelAccent(id)}44`.
export function reelAccent(seed = "") {
  return reelPoster(seed)[1];
}

// Preview duration for a mock reel: 15-45s, deterministic per id.
export function reelDurationSeconds(seed = "") {
  return 15 + (hashSeed(seed) % 31);
}
