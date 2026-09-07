import {
  MONETIZATION_TYPES,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  WITHDRAWAL_METHODS,
} from "./monetizationConstants";

export function isValidMonetizationType(type) {
  return Object.values(MONETIZATION_TYPES).includes(type);
}

export function isValidTransactionType(type) {
  return Object.values(TRANSACTION_TYPES).includes(type);
}

export function isValidTransactionStatus(status) {
  return Object.values(TRANSACTION_STATUS).includes(status);
}

export function isValidWithdrawalMethod(method) {
  return Object.values(WITHDRAWAL_METHODS).includes(method);
}

export function getMonetizationTypeLabel(type) {
  const labels = {
    [MONETIZATION_TYPES.SUBSCRIPTION]: "Subscription",
    [MONETIZATION_TYPES.GIFT]: "Gift",
    [MONETIZATION_TYPES.TIP]: "Tip",
    [MONETIZATION_TYPES.CREATOR]: "Creator",
    [MONETIZATION_TYPES.AD_REVENUE]: "Ad revenue",
  };

  return labels[type] || "Monetization";
}

export function getTransactionTypeLabel(type) {
  const labels = {
    [TRANSACTION_TYPES.EARNING]: "Earning",
    [TRANSACTION_TYPES.WITHDRAWAL]: "Withdrawal",
    [TRANSACTION_TYPES.GIFT]: "Gift",
    [TRANSACTION_TYPES.SUBSCRIPTION]: "Subscription",
    [TRANSACTION_TYPES.REFUND]: "Refund",
    [TRANSACTION_TYPES.FEE]: "Fee",
  };

  return labels[type] || "Transaction";
}

export function calculatePlatformFee(amount, percentage = 0) {
  const value = Number(amount) || 0;
  const rate = Math.max(0, Number(percentage) || 0);

  return value * (rate / 100);
}

export function calculateNetAmount(amount, percentage = 0) {
  const value = Number(amount) || 0;

  return value - calculatePlatformFee(value, percentage);
}

export function calculateGrossAmount(netAmount, percentage = 0) {
  const net = Number(netAmount) || 0;
  const rate = Number(percentage) || 0;

  if (rate >= 100) return 0;

  return net / (1 - rate / 100);
}

export function roundMoney(amount, decimals = 0) {
  const value = Number(amount) || 0;
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}

export function buildWithdrawalPayload({
  amount,
  method,
  accountNumber,
  accountName,
  currency = "XAF",
} = {}) {
  return {
    amount: Number(amount) || 0,
    method,
    accountNumber,
    accountName,
    currency,
  };
}

export function buildGiftPayload({
  recipientId,
  giftId,
  quantity = 1,
  message = "",
} = {}) {
  return {
    recipientId,
    giftId,
    quantity: Math.max(1, Number(quantity) || 1),
    message: String(message || "").trim(),
  };
}

export function buildSubscriptionPayload({ creatorId, planId } = {}) {
  return {
    creatorId,
    planId,
  };
}

export default {
  isValidMonetizationType,
  isValidTransactionType,
  isValidTransactionStatus,
  isValidWithdrawalMethod,
  getMonetizationTypeLabel,
  getTransactionTypeLabel,
  calculatePlatformFee,
  calculateNetAmount,
  calculateGrossAmount,
  roundMoney,
  buildWithdrawalPayload,
  buildGiftPayload,
  buildSubscriptionPayload,
};
