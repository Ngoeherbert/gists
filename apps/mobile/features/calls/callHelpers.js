import { CALL_DEFAULTS, CALL_STATUS, CALL_TYPES } from "./callConstants";

export function isVoiceCall(type) {
  return type === CALL_TYPES.VOICE;
}

export function isVideoCall(type) {
  return type === CALL_TYPES.VIDEO;
}

export function isActiveCall(status) {
  return status === CALL_STATUS.ACTIVE;
}

export function isConnectingCall(status) {
  return status === CALL_STATUS.CONNECTING || status === CALL_STATUS.RINGING;
}

export function isFinishedCall(status) {
  return [
    CALL_STATUS.ENDED,
    CALL_STATUS.MISSED,
    CALL_STATUS.DECLINED,
    CALL_STATUS.FAILED,
    CALL_STATUS.CANCELLED,
  ].includes(status);
}

export function createCallState(overrides = {}) {
  return {
    type: CALL_DEFAULTS.TYPE,
    status: CALL_STATUS.IDLE,
    isMuted: CALL_DEFAULTS.MUTE,
    isCameraEnabled: CALL_DEFAULTS.CAMERA_ENABLED,
    isSpeakerEnabled: CALL_DEFAULTS.SPEAKER_ENABLED,
    isFrontCamera: CALL_DEFAULTS.FRONT_CAMERA,
    startedAt: null,
    endedAt: null,
    ...overrides,
  };
}

export function normalizeCall(call) {
  if (!call) {
    return null;
  }

  return {
    ...call,
    id: call.id || call._id || null,
    type: call.type || CALL_TYPES.VOICE,
    status: call.status || CALL_STATUS.IDLE,
    participants: Array.isArray(call.participants) ? call.participants : [],
  };
}

export function getCallParticipantCount(call) {
  if (!call?.participants) {
    return 0;
  }

  return Array.isArray(call.participants) ? call.participants.length : 0;
}

export function getOtherParticipants(call, currentUserId) {
  if (!Array.isArray(call?.participants)) {
    return [];
  }

  return call.participants.filter(
    (participant) =>
      participant?.id !== currentUserId &&
      participant?.userId !== currentUserId,
  );
}

export function getCallDuration(startedAt, endedAt = Date.now()) {
  if (!startedAt) {
    return 0;
  }

  const start =
    startedAt instanceof Date
      ? startedAt.getTime()
      : new Date(startedAt).getTime();

  const end =
    endedAt instanceof Date ? endedAt.getTime() : new Date(endedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 0;
  }

  return Math.max(0, Math.floor((end - start) / 1000));
}

export function formatCallDuration(seconds = 0) {
  const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    String(minutes).padStart(2, "0"),
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

export function getCallDisplayName(call) {
  if (!call) {
    return "Call";
  }

  return (
    call.name ||
    call.title ||
    call.participant?.displayName ||
    call.participant?.username ||
    "Call"
  );
}

export function getCallStatusLabel(status) {
  const labels = {
    [CALL_STATUS.IDLE]: "Ready",
    [CALL_STATUS.CONNECTING]: "Connecting",
    [CALL_STATUS.RINGING]: "Ringing",
    [CALL_STATUS.ACTIVE]: "Active",
    [CALL_STATUS.ENDED]: "Ended",
    [CALL_STATUS.MISSED]: "Missed",
    [CALL_STATUS.DECLINED]: "Declined",
    [CALL_STATUS.FAILED]: "Failed",
    [CALL_STATUS.CANCELLED]: "Cancelled",
  };

  return labels[status] || "Unknown";
}

export default {
  isVoiceCall,
  isVideoCall,
  isActiveCall,
  isConnectingCall,
  isFinishedCall,
  createCallState,
  normalizeCall,
  getCallParticipantCount,
  getOtherParticipants,
  getCallDuration,
  formatCallDuration,
  getCallDisplayName,
  getCallStatusLabel,
};
