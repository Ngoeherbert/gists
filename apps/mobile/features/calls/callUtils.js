import { CALL_STATUS, CALL_TYPES } from "./callConstants";

export function isValidCallType(type) {
  return Object.values(CALL_TYPES).includes(type);
}

export function isValidCallStatus(status) {
  return Object.values(CALL_STATUS).includes(status);
}

export function getCallTypeLabel(type) {
  if (type === CALL_TYPES.VIDEO) {
    return "Video call";
  }

  return "Voice call";
}

export function getCallIconName(type) {
  if (type === CALL_TYPES.VIDEO) {
    return "video";
  }

  return "phone";
}

export function calculateCallDuration(startedAt, endedAt = Date.now()) {
  if (!startedAt) {
    return 0;
  }

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 0;
  }

  return Math.max(0, Math.floor((end - start) / 1000));
}

export function formatCallTime(seconds = 0) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));

  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const secondsLeft = value % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(secondsLeft).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(
    2,
    "0",
  )}`;
}

export function getCallDirection(call, currentUserId) {
  if (!call || !currentUserId) {
    return "unknown";
  }

  const callerId = call.callerId || call.caller?.id || call.fromUserId;

  return callerId === currentUserId ? "outgoing" : "incoming";
}

export function isIncomingCall(call, currentUserId) {
  return getCallDirection(call, currentUserId) === "incoming";
}

export function isOutgoingCall(call, currentUserId) {
  return getCallDirection(call, currentUserId) === "outgoing";
}

export function getCallHistoryLabel(call, currentUserId) {
  if (!call) {
    return "Call";
  }

  if (call.status === CALL_STATUS.MISSED) {
    return "Missed call";
  }

  if (call.status === CALL_STATUS.DECLINED) {
    return "Declined call";
  }

  if (isOutgoingCall(call, currentUserId)) {
    return "Outgoing call";
  }

  if (isIncomingCall(call, currentUserId)) {
    return "Incoming call";
  }

  return getCallTypeLabel(call.type);
}

export function createCallPayload({
  type = CALL_TYPES.VOICE,
  recipientId,
  participantIds = [],
  ...rest
} = {}) {
  return {
    ...rest,
    type,
    ...(recipientId ? { recipientId } : {}),
    ...(participantIds.length ? { participantIds } : {}),
  };
}

export default {
  isValidCallType,
  isValidCallStatus,
  getCallTypeLabel,
  getCallIconName,
  calculateCallDuration,
  formatCallTime,
  getCallDirection,
  isIncomingCall,
  isOutgoingCall,
  getCallHistoryLabel,
  createCallPayload,
};
