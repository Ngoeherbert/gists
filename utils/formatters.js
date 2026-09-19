// utils/formatters.js
// Shared display formatting helpers (relative time, counts, clock labels ...).

// Relative time for past timestamps: "now", "5m", "3h", "2d", "1w".
export function formatRelativeTime(ts) {
  if (!ts) return "";
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (seconds < 60) return "now";
  const units = [
    ["m", 60],
    ["h", 3600],
    ["d", 86400],
    ["w", 604800],
  ];
  let out = "now";
  for (const [suffix, secs] of units) {
    if (seconds >= secs) out = `${Math.floor(seconds / secs)}${suffix}`;
  }
  return out;
}

// Compact engagement counts used by the reels rail and post cards:
//   42 -> "42" · 999 -> "999" · 1200 -> "1.2K" · 125000 -> "125K" · 2400000 -> "2.4M"
// Values whose scaled number reaches 100 drop the decimal ("125K", not "125.0K")
// so the label never grows wider than it has to.
export function formatCount(n = 0) {
  const value = Number(n) || 0;
  const sign = value < 0 ? "-" : "";
  const magnitude = Math.abs(value);

  if (magnitude < 1000) return `${sign}${Math.round(magnitude)}`;

  const compact = (divisor, suffix) => {
    const scaled = magnitude / divisor;
    const rounded = scaled >= 100 ? Math.round(scaled) : Math.round(scaled * 10) / 10;
    return `${sign}${rounded}${suffix}`;
  };

  return magnitude < 1000000 ? compact(1000, "K") : compact(1000000, "M");
}

// Playback clock: seconds -> "0:00", "0:07", "1:24", "59:59". Clamps bad input
// (negative / NaN / undefined) to "0:00" so a player never renders "NaN:NaN".
export function formatClock(seconds = 0) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, "0")}`;
}

