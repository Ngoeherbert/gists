import { CALL_LIMITS, CALL_TYPES } from "./callConstants";
import { isValidCallType } from "./callUtils";

export function validateCallType(type) {
  if (!type) {
    return "Call type is required.";
  }

  if (!isValidCallType(type)) {
    return "Invalid call type.";
  }

  return null;
}

export function validateCallId(id) {
  if (!id) {
    return "Call ID is required.";
  }

  if (typeof id !== "string" && typeof id !== "number") {
    return "Invalid call ID.";
  }

  return null;
}

export function validateRecipientId(recipientId) {
  if (!recipientId) {
    return "Recipient is required.";
  }

  if (typeof recipientId !== "string" && typeof recipientId !== "number") {
    return "Invalid recipient.";
  }

  return null;
}

export function validateParticipantIds(participantIds = []) {
  if (!Array.isArray(participantIds)) {
    return "Participants must be a list.";
  }

  if (participantIds.length === 0) {
    return "At least one participant is required.";
  }

  if (participantIds.length > CALL_LIMITS.MAX_PARTICIPANTS) {
    return `A call cannot have more than ${CALL_LIMITS.MAX_PARTICIPANTS} participants.`;
  }

  const uniqueIds = new Set(participantIds.map(String));

  if (uniqueIds.size !== participantIds.length) {
    return "Duplicate participants are not allowed.";
  }

  return null;
}

export function validateStartCall({
  type = CALL_TYPES.VOICE,
  recipientId,
  participantIds,
} = {}) {
  const errors = {};

  const typeError = validateCallType(type);

  if (typeError) {
    errors.type = typeError;
  }

  if (recipientId) {
    const recipientError = validateRecipientId(recipientId);

    if (recipientError) {
      errors.recipientId = recipientError;
    }
  } else if (participantIds) {
    const participantsError = validateParticipantIds(participantIds);

    if (participantsError) {
      errors.participantIds = participantsError;
    }
  } else {
    errors.recipientId = "Recipient is required.";
  }

  return errors;
}

export function hasCallValidationErrors(errors = {}) {
  return Object.keys(errors).length > 0;
}

export function isCallStartValid(payload) {
  return !hasCallValidationErrors(validateStartCall(payload));
}

export default {
  validateCallType,
  validateCallId,
  validateRecipientId,
  validateParticipantIds,
  validateStartCall,
  hasCallValidationErrors,
  isCallStartValid,
};
