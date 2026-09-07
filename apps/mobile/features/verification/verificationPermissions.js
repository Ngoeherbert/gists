import { VERIFICATION_STATUS, KYC_STATUS } from "./verificationConstants";

export function canStartVerification(verification = {}) {
  const status = verification.status || VERIFICATION_STATUS.NOT_STARTED;

  return (
    status === VERIFICATION_STATUS.NOT_STARTED ||
    status === VERIFICATION_STATUS.REJECTED ||
    status === VERIFICATION_STATUS.EXPIRED
  );
}

export function canSubmitVerification(verification = {}) {
  const status = verification.status || VERIFICATION_STATUS.NOT_STARTED;

  return (
    status === VERIFICATION_STATUS.NOT_STARTED ||
    status === VERIFICATION_STATUS.REJECTED
  );
}

export function canResubmitVerification(verification = {}) {
  return (
    verification.status === VERIFICATION_STATUS.REJECTED ||
    verification.status === VERIFICATION_STATUS.EXPIRED
  );
}

export function canCancelVerification(verification = {}) {
  return (
    verification.status === VERIFICATION_STATUS.PENDING ||
    verification.status === VERIFICATION_STATUS.IN_REVIEW
  );
}

export function canViewVerification() {
  return true;
}

export function canUpdateVerification(verification = {}) {
  const status = verification.status || VERIFICATION_STATUS.NOT_STARTED;

  return (
    status === VERIFICATION_STATUS.NOT_STARTED ||
    status === VERIFICATION_STATUS.REJECTED
  );
}

export function canStartKyc(kyc = {}) {
  const status = kyc.status || KYC_STATUS.NOT_STARTED;

  return (
    status === KYC_STATUS.NOT_STARTED ||
    status === KYC_STATUS.REJECTED ||
    status === KYC_STATUS.EXPIRED
  );
}

export function canSubmitKyc(kyc = {}) {
  const status = kyc.status || KYC_STATUS.NOT_STARTED;

  return status === KYC_STATUS.NOT_STARTED || status === KYC_STATUS.REJECTED;
}

export function canResubmitKyc(kyc = {}) {
  return (
    kyc.status === KYC_STATUS.REJECTED || kyc.status === KYC_STATUS.EXPIRED
  );
}

export function canWithdrawWithKyc(kyc = {}) {
  return kyc.status === KYC_STATUS.APPROVED;
}

export function canAccessVerifiedFeatures(profile = {}) {
  return Boolean(
    profile.verified ||
    profile.isVerified ||
    profile.verificationStatus === VERIFICATION_STATUS.VERIFIED,
  );
}

export function getVerificationPermissions({
  verification = {},
  kyc = {},
} = {}) {
  return {
    view: canViewVerification(verification),
    start: canStartVerification(verification),
    submit: canSubmitVerification(verification),
    resubmit: canResubmitVerification(verification),
    cancel: canCancelVerification(verification),
    update: canUpdateVerification(verification),
    startKyc: canStartKyc(kyc),
    submitKyc: canSubmitKyc(kyc),
    resubmitKyc: canResubmitKyc(kyc),
    withdrawWithKyc: canWithdrawWithKyc(kyc),
    verifiedFeatures: canAccessVerifiedFeatures(verification),
  };
}

export default {
  canStartVerification,
  canSubmitVerification,
  canResubmitVerification,
  canCancelVerification,
  canViewVerification,
  canUpdateVerification,
  canStartKyc,
  canSubmitKyc,
  canResubmitKyc,
  canWithdrawWithKyc,
  canAccessVerifiedFeatures,
  getVerificationPermissions,
};
