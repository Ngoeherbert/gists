import { CHAT_TYPES, MESSAGE_TYPES, CHAT_LIMITS } from "./chatConstants";

export function validateChatId(chatId) {
  if (!chatId) {
    return "Chat ID is required.";
  }

  return null;
}

export function validateMessageId(messageId) {
  if (!messageId) {
    return "Message ID is required.";
  }

  return null;
}

export function validateChatType(type) {
  if (!Object.values(CHAT_TYPES).includes(type)) {
    return "Invalid chat type.";
  }

  return null;
}

export function validateMessageType(type) {
  if (!Object.values(MESSAGE_TYPES).includes(type)) {
    return "Invalid message type.";
  }

  return null;
}

export function validateMessageText(text) {
  const value = String(text || "").trim();

  if (!value) {
    return "Message cannot be empty.";
  }

  if (value.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
    return `Message cannot exceed ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} characters.`;
  }

  return null;
}

export function validateRecipientId(recipientId) {
  if (!recipientId) {
    return "Recipient is required.";
  }

  return null;
}

export function validateGroupMembers(members = []) {
  if (!Array.isArray(members)) {
    return "Members must be an array.";
  }

  if (members.length < 1) {
    return "At least one member is required.";
  }

  if (members.length > CHAT_LIMITS.MAX_GROUP_MEMBERS) {
    return `A group cannot have more than ${CHAT_LIMITS.MAX_GROUP_MEMBERS} members.`;
  }

  return null;
}

export function validateAttachment(file, type) {
  if (!file) {
    return "Attachment is required.";
  }

  if (type === MESSAGE_TYPES.IMAGE) {
    if (file.size && file.size > CHAT_LIMITS.MAX_IMAGE_SIZE) {
      return "Image is too large.";
    }
  }

  if (type === MESSAGE_TYPES.VIDEO) {
    if (file.size && file.size > CHAT_LIMITS.MAX_VIDEO_SIZE) {
      return "Video is too large.";
    }
  }

  if (
    type === MESSAGE_TYPES.FILE &&
    file.size &&
    file.size > CHAT_LIMITS.MAX_FILE_SIZE
  ) {
    return "File is too large.";
  }

  return null;
}

export function validateSendMessage(data = {}) {
  const errors = {};

  const chatError = validateChatId(data.chatId);

  if (chatError) {
    errors.chatId = chatError;
  }

  const typeError = validateMessageType(data.type || MESSAGE_TYPES.TEXT);

  if (typeError) {
    errors.type = typeError;
  }

  if (!data.file && !data.media && data.type === MESSAGE_TYPES.TEXT) {
    const textError = validateMessageText(data.text);

    if (textError) {
      errors.text = textError;
    }
  }

  if (data.file) {
    const attachmentError = validateAttachment(data.file, data.type);

    if (attachmentError) {
      errors.file = attachmentError;
    }
  }

  return errors;
}

export function validateCreateChat(data = {}) {
  const errors = {};

  if (!data.type) {
    errors.type = "Chat type is required.";
  } else {
    const typeError = validateChatType(data.type);

    if (typeError) {
      errors.type = typeError;
    }
  }

  if (data.type === CHAT_TYPES.DIRECT && !data.recipientId) {
    errors.recipientId = "Recipient is required.";
  }

  if (data.type === CHAT_TYPES.GROUP) {
    const memberError = validateGroupMembers(data.members);

    if (memberError) {
      errors.members = memberError;
    }
  }

  return errors;
}

export function hasChatValidationErrors(errors = {}) {
  return Object.keys(errors).length > 0;
}

export function isSendMessageValid(data = {}) {
  return !hasChatValidationErrors(validateSendMessage(data));
}

export function isCreateChatValid(data = {}) {
  return !hasChatValidationErrors(validateCreateChat(data));
}
