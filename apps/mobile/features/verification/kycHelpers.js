import { KYC_STATUS, KYC_DOCUMENT_TYPES } from "./verificationConstants";

export function getKycId(kyc = {}) {
  return kyc.id || kyc.kycId || kyc.kyc_id || null;
}

export function getKycStatus(kyc = {}) {
  return kyc.status || KYC_STATUS.NOT_STARTED;
}

export function isKycPending(kyc = {}) {
  const status = getKycStatus(kyc);

  return status === KYC_STATUS.PENDING || status === KYC_STATUS.IN_REVIEW;
}

export function isKycApproved(kyc = {}) {
  return getKycStatus(kyc) === KYC_STATUS.APPROVED;
}

export function isKycRejected(kyc = {}) {
  return getKycStatus(kyc) === KYC_STATUS.REJECTED;
}

export function isKycExpired(kyc = {}) {
  return getKycStatus(kyc) === KYC_STATUS.EXPIRED;
}

export function getKycDocumentType(document = {}) {
  return (
    document.type || document.documentType || document.document_type || null
  );
}

export function getKycDocumentLabel(document = {}) {
  const type = getKycDocumentType(document);

  switch (type) {
    case KYC_DOCUMENT_TYPES.NATIONAL_ID:
      return "National ID";
    case KYC_DOCUMENT_TYPES.PASSPORT:
      return "Passport";
    case KYC_DOCUMENT_TYPES.DRIVERS_LICENSE:
      return "Driver's License";
    case KYC_DOCUMENT_TYPES.RESIDENCE_PERMIT:
      return "Residence Permit";
    default:
      return "Identity Document";
  }
}

export function getKycDocuments(kyc = {}) {
  return Array.isArray(kyc.documents) ? kyc.documents : [];
}

export function getKycDocumentCount(kyc = {}) {
  return getKycDocuments(kyc).length;
}

export function getKycSubmittedAt(kyc = {}) {
  return kyc.submittedAt || kyc.submitted_at || null;
}

export function getKycReviewedAt(kyc = {}) {
  return kyc.reviewedAt || kyc.reviewed_at || null;
}

export function getKycRejectionReason(kyc = {}) {
  return kyc.rejectionReason || kyc.rejection_reason || null;
}

export function normalizeKyc(kyc = {}) {
  return {
    id: getKycId(kyc),
    status: getKycStatus(kyc),
    documents: getKycDocuments(kyc),
    documentCount: getKycDocumentCount(kyc),
    submittedAt: getKycSubmittedAt(kyc),
    reviewedAt: getKycReviewedAt(kyc),
    rejectionReason: getKycRejectionReason(kyc),
    pending: isKycPending(kyc),
    approved: isKycApproved(kyc),
    rejected: isKycRejected(kyc),
    expired: isKycExpired(kyc),
  };
}

export default {
  getKycId,
  getKycStatus,
  isKycPending,
  isKycApproved,
  isKycRejected,
  isKycExpired,
  getKycDocumentType,
  getKycDocumentLabel,
  getKycDocuments,
  getKycDocumentCount,
  getKycSubmittedAt,
  getKycReviewedAt,
  getKycRejectionReason,
  normalizeKyc,
};
