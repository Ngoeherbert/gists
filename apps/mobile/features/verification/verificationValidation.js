import {
  VERIFICATION_TYPES,
  VERIFICATION_STATUS,
  KYC_DOCUMENT_TYPES,
  VERIFICATION_LIMITS,
} from "./verificationConstants";

export function validateVerificationId(id) {
  if (!id || typeof id !== "string") {
    return "Verification ID is required.";
  }

  if (!id.trim()) {
    return "Verification ID is required.";
  }

  return null;
}

export function validateVerificationType(type) {
  if (!Object.values(VERIFICATION_TYPES).includes(type)) {
    return "Invalid verification type.";
  }

  return null;
}

export function validateVerificationStatus(status) {
  if (!Object.values(VERIFICATION_STATUS).includes(status)) {
    return "Invalid verification status.";
  }

  return null;
}

export function validateDocumentType(type) {
  if (!Object.values(KYC_DOCUMENT_TYPES).includes(type)) {
    return "Invalid document type.";
  }

  return null;
}

export function validateDocument(document) {
  if (!document) {
    return "A verification document is required.";
  }

  const size = document.fileSize || document.size;

  if (
    typeof size === "number" &&
    size > VERIFICATION_LIMITS.MAX_DOCUMENT_SIZE
  ) {
    return "Document size exceeds the allowed limit.";
  }

  return null;
}

export function validateDocuments(documents = []) {
  if (!Array.isArray(documents) || documents.length === 0) {
    return "At least one verification document is required.";
  }

  if (documents.length > VERIFICATION_LIMITS.MAX_DOCUMENTS) {
    return `You can submit a maximum of ${VERIFICATION_LIMITS.MAX_DOCUMENTS} documents.`;
  }

  for (const document of documents) {
    const error = validateDocument(document);

    if (error) return error;
  }

  return null;
}

export function validateVerificationNote(note = "") {
  if (typeof note !== "string") {
    return "Verification note must be text.";
  }

  if (note.length > VERIFICATION_LIMITS.MAX_NOTE_LENGTH) {
    return `Verification note cannot exceed ${VERIFICATION_LIMITS.MAX_NOTE_LENGTH} characters.`;
  }

  return null;
}

export function validateCreateVerification(data = {}) {
  const typeError = validateVerificationType(data.type);

  if (typeError) return typeError;

  const documentsError = validateDocuments(data.documents);

  if (documentsError) return documentsError;

  if (data.note !== undefined) {
    const noteError = validateVerificationNote(data.note);

    if (noteError) return noteError;
  }

  return null;
}

export function validateUpdateVerification(data = {}) {
  if (data.type !== undefined) {
    const typeError = validateVerificationType(data.type);

    if (typeError) return typeError;
  }

  if (data.documents !== undefined) {
    const documentsError = validateDocuments(data.documents);

    if (documentsError) return documentsError;
  }

  if (data.note !== undefined) {
    const noteError = validateVerificationNote(data.note);

    if (noteError) return noteError;
  }

  return null;
}

export function validateKycSubmission(data = {}) {
  const documentTypeError = validateDocumentType(data.documentType);

  if (documentTypeError) return documentTypeError;

  return validateDocuments(data.documents);
}

export function hasVerificationValidationError(error) {
  return typeof error === "string" && error.length > 0;
}

export function isVerificationValid(data = {}) {
  return !validateCreateVerification(data);
}

export function isKycSubmissionValid(data = {}) {
  return !validateKycSubmission(data);
}

export default {
  validateVerificationId,
  validateVerificationType,
  validateVerificationStatus,
  validateDocumentType,
  validateDocument,
  validateDocuments,
  validateVerificationNote,
  validateCreateVerification,
  validateUpdateVerification,
  validateKycSubmission,
  hasVerificationValidationError,
  isVerificationValid,
  isKycSubmissionValid,
};
