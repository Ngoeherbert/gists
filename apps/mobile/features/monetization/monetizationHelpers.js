import {
  MONETIZATION_STATUS,
  TRANSACTION_STATUS,
} from "./monetizationConstants";

export function isMonetizationActive(data) {
  return data?.status === MONETIZATION_STATUS.ACTIVE || Boolean(data?.isActive);
}

export function isMonetizationPending(data) {
  return data?.status === MONETIZATION_STATUS.PENDING;
}

export function isMonetizationSuspended(data) {
  return data?.status === MONETIZATION_STATUS.SUSPENDED;
}

export function isMonetizationRejected(data) {
  return data?.status === MONETIZATION_STATUS.REJECTED;
}

export function isTransactionComplete(transaction) {
  return transaction?.status === TRANSACTION_STATUS.COMPLETED;
}

export function isTransactionPending(transaction) {
  return [TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.PROCESSING].includes(
    transaction?.status,
  );
}

export function isTransactionFailed(transaction) {
  return [TRANSACTION_STATUS.FAILED, TRANSACTION_STATUS.CANCELLED].includes(
    transaction?.status,
  );
}

export function getMonetizationStatusLabel(status) {
  const labels = {
    [MONETIZATION_STATUS.INACTIVE]: "Inactive",
    [MONETIZATION_STATUS.PENDING]: "Pending",
    [MONETIZATION_STATUS.ACTIVE]: "Active",
    [MONETIZATION_STATUS.SUSPENDED]: "Suspended",
    [MONETIZATION_STATUS.REJECTED]: "Rejected",
  };

  return labels[status] || "Unknown";
}

export function getTransactionStatusLabel(status) {
  const labels = {
    [TRANSACTION_STATUS.PENDING]: "Pending",
    [TRANSACTION_STATUS.PROCESSING]: "Processing",
    [TRANSACTION_STATUS.COMPLETED]: "Completed",
    [TRANSACTION_STATUS.FAILED]: "Failed",
    [TRANSACTION_STATUS.CANCELLED]: "Cancelled",
    [TRANSACTION_STATUS.REFUNDED]: "Refunded",
  };

  return labels[status] || "Unknown";
}

export function getTransactionAmount(transaction) {
  return Number(transaction?.amount ?? transaction?.value ?? 0);
}

export function getTransactionDate(transaction) {
  return (
    transaction?.createdAt ||
    transaction?.date ||
    transaction?.timestamp ||
    null
  );
}

export function calculateNetEarnings(earnings = [], fees = []) {
  const totalEarnings = earnings.reduce(
    (total, item) => total + getTransactionAmount(item),
    0,
  );

  const totalFees = fees.reduce(
    (total, item) => total + getTransactionAmount(item),
    0,
  );

  return totalEarnings - totalFees;
}

export function getCreatorLevel(totalEarnings, thresholds = {}) {
  const amount = Number(totalEarnings) || 0;

  const { rising = 10000, established = 100000, top = 1000000 } = thresholds;

  if (amount >= top) return "top";
  if (amount >= established) return "established";
  if (amount >= rising) return "rising";

  return "new";
}

export default {
  isMonetizationActive,
  isMonetizationPending,
  isMonetizationSuspended,
  isMonetizationRejected,
  isTransactionComplete,
  isTransactionPending,
  isTransactionFailed,
  getMonetizationStatusLabel,
  getTransactionStatusLabel,
  getTransactionAmount,
  getTransactionDate,
  calculateNetEarnings,
  getCreatorLevel,
};
