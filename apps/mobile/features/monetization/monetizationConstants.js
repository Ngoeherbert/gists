export const MONETIZATION_STATUS = {
  INACTIVE: "inactive",
  PENDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "suspended",
  REJECTED: "rejected",
};

export const MONETIZATION_TYPES = {
  SUBSCRIPTION: "subscription",
  GIFT: "gift",
  TIP: "tip",
  CREATOR: "creator",
  AD_REVENUE: "ad_revenue",
};

export const TRANSACTION_TYPES = {
  EARNING: "earning",
  WITHDRAWAL: "withdrawal",
  GIFT: "gift",
  SUBSCRIPTION: "subscription",
  REFUND: "refund",
  FEE: "fee",
};

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

export const WITHDRAWAL_METHODS = {
  MOBILE_MONEY: "mobile_money",
  BANK: "bank",
};

export const WITHDRAWAL_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
};

export const MONETIZATION_ERRORS = {
  NOT_ELIGIBLE: "NOT_ELIGIBLE",
  KYC_REQUIRED: "KYC_REQUIRED",
  KYC_PENDING: "KYC_PENDING",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  INVALID_AMOUNT: "INVALID_AMOUNT",
  INVALID_METHOD: "INVALID_METHOD",
  WITHDRAWAL_FAILED: "WITHDRAWAL_FAILED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
};

export const MONETIZATION_LIMITS = {
  MIN_WITHDRAWAL: 1000,
  MAX_WITHDRAWAL: 1000000,
  MAX_GIFT_VALUE: 100000,
  MAX_SUBSCRIPTION_PRICE: 1000000,
};

export const CREATOR_LEVELS = {
  NEW: "new",
  RISING: "rising",
  ESTABLISHED: "established",
  TOP: "top",
};

export default {
  MONETIZATION_STATUS,
  MONETIZATION_TYPES,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  WITHDRAWAL_METHODS,
  WITHDRAWAL_STATUS,
  MONETIZATION_ERRORS,
  MONETIZATION_LIMITS,
  CREATOR_LEVELS,
};
