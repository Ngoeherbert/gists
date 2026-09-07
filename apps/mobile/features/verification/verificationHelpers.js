import {
  VERIFICATION_STATUS,
  VERIFICATION_TYPES,
} from "./verificationConstants";

export function getVerificationId(verification = {}) {
  return (
    verification.id ||
    verification.verificationId ||
    verification.verification_id ||
    null
  );
}

export function getVerificationType(verification = {}) {
  return verification.type || VERIFICATION_TYPES.IDENTITY;
}

export function getVerificationStatus(verification = {}) {
  return verification.status || VERIFICATION_STATUS.NOT_STARTED;
}

export function isVerificationPending(verification = {}) {
  const status = getVerificationStatus(verification);

  return (
    status === VERIFICATION_STATUS.PENDING ||
    status === VERIFICATION_STATUS.IN_REVIEW
  );
}

export function isVerificationInReview(verification = {}) {
  return getVerificationStatus(verification) === VERIFICATION_STATUS.IN_REVIEW;
}

export function isVerified(verification = {}) {
  return getVerificationStatus(verification) === VERIFICATION_STATUS.VERIFIED;
}

export function isVerificationRejected(verification = {}) {
  return getVerificationStatus(verification) === VERIFICATION_STATUS.REJECTED;
}

export function isVerificationExpired(verification = {}) {
  return getVerificationStatus(verification) === VERIFICATION_STATUS.EXPIRED;
}

export function isVerificationSuspended(verification = {}) {
  return getVerificationStatus(verification) === VERIFICATION_STATUS.SUSPENDED;
}

export function getVerificationSubmittedAt(verification = {}) {
  return verification.submittedAt || verification.submitted_at || null;
}

export function getVerificationVerifiedAt(verification = {}) {
  return verification.verifiedAt || verification.verified_at || null;
}

export function getVerificationRejectionReason(verification = {}) {
  return verification.rejectionReason || verification.rejection_reason || null;
}

export function getVerificationDocuments(verification = {}) {
  return Array.isArray(verification.documents) ? verification.documents : [];
}

export function normalizeVerification(verification = {}) {
  return {
    id: getVerificationId(verification),
    type: getVerificationType(verification),
    status: getVerificationStatus(verification),
    documents: getVerificationDocuments(verification),
    submittedAt: getVerificationSubmittedAt(verification),
    verifiedAt: getVerificationVerifiedAt(verification),
    rejectionReason: getVerificationRejectionReason(verification),
    pending: isVerificationPending(verification),
    verified: isVerified(verification),
    rejected: isVerificationRejected(verification),
    expired: isVerificationExpired(verification),
    suspended: isVerificationSuspended(verification),
  };
}

export function getVerificationLabel(verification = {}) {
  switch (getVerificationType(verification)) {
    case VERIFICATION_TYPES.IDENTITY:
      return "Identity Verification";
    case VERIFICATION_TYPES.PHONE:
      return "Phone Verification";
    case VERIFICATION_TYPES.EMAIL:
      return "Email Verification";
    case VERIFICATION_TYPES.CREATOR:
      return "Creator Verification";
    case VERIFICATION_TYPES.BUSINESS:
      return "Business Verification";
    default:
      return "Verification";
  }
}

export function sortVerifications(verifications = []) {
  return [...verifications].sort((a, b) => {
    const dateA = new Date(getVerificationSubmittedAt(a) || 0).getTime();

    const dateB = new Date(getVerificationSubmittedAt(b) || 0).getTime();

    return dateB - dateA;
  });
}

export default {
  getVerificationId,
  getVerificationType,
  getVerificationStatus,
  isVerificationPending,
  isVerificationInReview,
  isVerified,
  isVerificationRejected,
  isVerificationExpired,
  isVerificationSuspended,
  getVerificationSubmittedAt,
  getVerificationVerifiedAt,
  getVerificationRejectionReason,
  getVerificationDocuments,
  normalizeVerification,
  getVerificationLabel,
  sortVerifications,
};
