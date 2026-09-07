// apps/mobile/features/reels/reelEditor.js

import { REEL_EDITOR, REEL_LIMITS, VIDEO_FILTERS } from "./reelConstants";

export function createEditorState(video = null) {
  const duration = Number(video?.duration || 0);

  return {
    video,
    duration,
    startTime: 0,
    endTime: Math.min(
      duration || REEL_EDITOR.MAX_DURATION,
      REEL_EDITOR.MAX_DURATION,
    ),
    filter: VIDEO_FILTERS.NONE,
    muted: false,
    textOverlays: [],
    music: null,
  };
}

export function getTrimDuration(startTime = 0, endTime = 0) {
  return Math.max(0, Number(endTime) - Number(startTime));
}

export function clampTrimTimes(startTime, endTime, duration) {
  const totalDuration = Math.max(0, Number(duration) || 0);
  const maxDuration = Math.min(
    totalDuration || REEL_EDITOR.MAX_DURATION,
    REEL_EDITOR.MAX_DURATION,
  );

  let start = Math.max(0, Number(startTime) || 0);
  let end = Math.max(0, Number(endTime) || 0);

  start = Math.min(start, totalDuration);
  end = Math.min(end, totalDuration);

  if (end <= start) {
    end = Math.min(
      totalDuration || REEL_EDITOR.MAX_DURATION,
      start + maxDuration,
    );
  }

  if (end - start > REEL_EDITOR.MAX_DURATION) {
    end = start + REEL_EDITOR.MAX_DURATION;
  }

  return {
    startTime: start,
    endTime: Math.min(end, totalDuration || REEL_EDITOR.MAX_DURATION),
  };
}

export function isValidTrim(startTime, endTime, duration) {
  const trimDuration = getTrimDuration(startTime, endTime);
  const totalDuration = Number(duration) || 0;

  if (startTime < 0 || endTime <= startTime) return false;
  if (totalDuration > 0 && endTime > totalDuration) return false;

  return (
    trimDuration >= REEL_EDITOR.MIN_DURATION &&
    trimDuration <= REEL_EDITOR.MAX_DURATION
  );
}

export function addTextOverlay(overlays = [], overlay = {}) {
  if (overlays.length >= REEL_EDITOR.MAX_TEXT_OVERLAYS) {
    return overlays;
  }

  return [
    ...overlays,
    {
      id:
        overlay.id ||
        `overlay_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      text: overlay.text || "",
      x: Number(overlay.x ?? 0.5),
      y: Number(overlay.y ?? 0.5),
      fontSize: Number(overlay.fontSize || 24),
      startTime: Number(overlay.startTime || 0),
      endTime: Number(overlay.endTime || REEL_EDITOR.MAX_DURATION),
      ...overlay,
    },
  ];
}

export function updateTextOverlay(overlays = [], id, updates = {}) {
  return overlays.map((overlay) =>
    overlay.id === id ? { ...overlay, ...updates } : overlay,
  );
}

export function removeTextOverlay(overlays = [], id) {
  return overlays.filter((overlay) => overlay.id !== id);
}

export function setEditorFilter(state, filter) {
  if (!Object.values(VIDEO_FILTERS).includes(filter)) {
    return state;
  }

  return {
    ...state,
    filter,
  };
}

export function setEditorMusic(state, music) {
  return {
    ...state,
    music: music || null,
  };
}

export function toggleEditorMute(state) {
  return {
    ...state,
    muted: !state.muted,
  };
}

export function getEditorPayload(state = {}) {
  return {
    video: state.video,
    startTime: state.startTime,
    endTime: state.endTime,
    filter: state.filter || VIDEO_FILTERS.NONE,
    muted: Boolean(state.muted),
    textOverlays: state.textOverlays || [],
    music: state.music || null,
  };
}

export function validateEditorState(state = {}) {
  const errors = {};
  const duration = Number(state.duration || state.video?.duration || 0);

  if (!state.video) {
    errors.video = "A video is required.";
  }

  if (
    state.video?.size &&
    Number(state.video.size) > REEL_LIMITS.MAX_VIDEO_SIZE
  ) {
    errors.video = "The video is too large.";
  }

  if (duration > 0 && !isValidTrim(state.startTime, state.endTime, duration)) {
    errors.trim = "The selected video duration is invalid.";
  }

  if (!Object.values(VIDEO_FILTERS).includes(state.filter)) {
    errors.filter = "Invalid video filter.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export default {
  createEditorState,
  getTrimDuration,
  clampTrimTimes,
  isValidTrim,
  addTextOverlay,
  updateTextOverlay,
  removeTextOverlay,
  setEditorFilter,
  setEditorMusic,
  toggleEditorMute,
  getEditorPayload,
  validateEditorState,
};
