import {
  VERIFICATION_STATUS,
  VERIFICATION_TYPES,
  KYC_STATUS,
} from "./verificationConstants";

export function isValidVerificationId(id) {
  return typeof id === "string" && id.trim().length > 0;
}

export function isValidVerificationType(type) {
  return Object.values(VERIFICATION_TYPES).includes(type);
}

export function isValidVerificationStatus(status) {
  return Object.values(VERIFICATION_STATUS).includes(status);
}

export function isValidKycStatus(status) {
  return Object.values(KYC_STATUS).includes(status);
}

export function getVerificationStatusLabel(status) {
  switch (status) {
    case VERIFICATION_STATUS.NOT_STARTED:
      return "Not Started";
    case VERIFICATION_STATUS.PENDING:
      return "Pending";
    case VERIFICATION_STATUS.IN_REVIEW:
      return "In Review";
    case VERIFICATION_STATUS.VERIFIED:
      return "Verified";
    case VERIFICATION_STATUS.REJECTED:
      return "Rejected";
    case VERIFICATION_STATUS.EXPIRED:
      return "Expired";
    case VERIFICATION_STATUS.SUSPENDED:
      return "Suspended";
    default:
      return "Unknown";
  }
}

export function getKycStatusLabel(status) {
  switch (status) {
    case KYC_STATUS.NOT_STARTED:
      return "Not Started";
    case KYC_STATUS.PENDING:
      return "Pending";
    case KYC_STATUS.IN_REVIEW:
      return "In Review";
    case KYC_STATUS.APPROVED:
      return "Approved";
    case KYC_STATUS.REJECTED:
      return "Rejected";
    case KYC_STATUS.EXPIRED:
      return "Expired";
    default:
      return "Unknown";
  }
}

export function getVerificationTypeLabel(type) {
  switch (type) {
    case VERIFICATION_TYPES.IDENTITY:
      return "Identity";
    case VERIFICATION_TYPES.PHONE:
      return "Phone";
    case VERIFICATION_TYPES.EMAIL:
      return "Email";
    case VERIFICATION_TYPES.CREATOR:
      return "Creator";
    case VERIFICATION_TYPES.BUSINESS:
      return "Business";
    default:
      return "Verification";
  }
}

export function normalizeVerificationId(id) {
  if (id === null || id === undefined) return null;

  const value = String(id).trim();
  return value || null;
}

export function normalizeVerificationStatus(status) {
  if (!status) return VERIFICATION_STATUS.NOT_STARTED;

  const normalized = String(status).toLowerCase().trim();

  return isValidVerificationStatus(normalized)
    ? normalized
    : VERIFICATION_STATUS.NOT_STARTED;
}

export function buildVerificationPayload(data = {}) {
  return {
    type: data.type,
    documents: Array.isArray(data.documents) ? data.documents : [],
    note: data.note?.trim() || undefined,
  };
}

export function buildKycPayload(data = {}) {
  return {
    documentType: data.documentType || data.document_type,
    documents: Array.isArray(data.documents) ? data.documents : [],
  };
}

export function mergeVerification(verification = {}, updates = {}) {
  return {
    ...verification,
    ...updates,
  };
}

export function isVerificationComplete(verification = {}) {
  return verification.status === VERIFICATION_STATUS.VERIFIED;
}

export function getVerificationProgress(verification = {}) {
  const status = verification.status;

  switch (status) {
    case VERIFICATION_STATUS.NOT_STARTED:
      return 0;
    case VERIFICATION_STATUS.PENDING:
      return 50;
    case VERIFICATION_STATUS.IN_REVIEW:
      return 75;
    case VERIFICATION_STATUS.VERIFIED:
      return 100;
    case VERIFICATION_STATUS.REJECTED:
    case VERIFICATION_STATUS.EXPIRED:
    case VERIFICATION_STATUS.SUSPENDED:
      return 0;
    default:
      return 0;
  }
}

export default {
  isValidVerificationId,
  isValidVerificationType,
  isValidVerificationStatus,
  isValidKycStatus,
  getVerificationStatusLabel,
  getKycStatusLabel,
  getVerificationTypeLabel,
  normalizeVerificationId,
  normalizeVerificationStatus,
  buildVerificationPayload,
  buildKycPayload,
  mergeVerification,
  isVerificationComplete,
  getVerificationProgress,
};
