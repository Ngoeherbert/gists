// utils/formatters.js
// Shared display formatting helpers (relative time, counts, ...).

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

