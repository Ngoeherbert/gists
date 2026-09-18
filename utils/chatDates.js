// utils/chatDates.js
// Calendar-day helpers for the chat thread's date dividers.
//
// Everything here works off LOCAL calendar days, never UTC: a message sent at
// 00:30 belongs to the day the user actually saw it, so the key is built from
// getFullYear / getMonth / getDate instead of toISOString().

const MS_PER_DAY = 86400000;

// Local calendar-day key, e.g. "2026-09-18". Returns null for a missing or
// unparsable timestamp so callers can fall back instead of grouping on NaN.
export function dayKey(ts) {
  if (ts === null || ts === undefined || ts === "") return null;
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return null;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Midnight-anchored copy of a timestamp, so two dates can be compared by
// calendar day rather than by their raw millisecond distance.
function startOfDay(ts) {
  const date = new Date(ts);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function isSameDay(a, b) {
  const keyA = dayKey(a);
  return Boolean(keyA) && keyA === dayKey(b);
}

// Divider label, WhatsApp-style: "Today", "Yesterday", the weekday name for
// anything inside the last week, then a full date beyond that.
export function formatDayLabel(ts, now = Date.now()) {
  if (!dayKey(ts)) return "";
  if (!dayKey(now)) return "";

  if (isSameDay(ts, now)) return "Today";

  // Compare against yesterday's midnight rather than "24h ago" so the label
  // flips at midnight instead of at the message's time of day.
  const yesterday = startOfDay(now).getTime() - MS_PER_DAY;
  if (isSameDay(ts, yesterday)) return "Yesterday";

  // Math.round absorbs the 23h / 25h days produced by DST transitions.
  const daysAgo = Math.round(
    (startOfDay(now).getTime() - startOfDay(ts).getTime()) / MS_PER_DAY,
  );
  if (daysAgo >= 0 && daysAgo < 7) {
    return new Date(ts).toLocaleDateString([], { weekday: "long" });
  }
  return new Date(ts).toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// True when the message at `index` opens a new calendar day, i.e. the thread
// should render a DateDivider above it. The first message always opens one;
// messages with an unusable timestamp never do.
export function startsNewDay(messages, index) {
  if (!Array.isArray(messages)) return false;
  const current = messages[index];
  if (!current) return false;
  if (index <= 0) return Boolean(dayKey(current.createdAt));

  const previous = messages[index - 1];
  const currentKey = dayKey(current.createdAt);
  const previousKey = dayKey(previous?.createdAt);
  if (!currentKey) return false;
  // A gap in the data (unparsable predecessor) still counts as a new day so
  // the thread never runs two days together under one divider.
  if (!previousKey) return true;
  return currentKey !== previousKey;
}

export default { dayKey, isSameDay, formatDayLabel, startsNewDay };