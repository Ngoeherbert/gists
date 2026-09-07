import {
  MONETIZATION_LIMITS,
  WITHDRAWAL_METHODS,
} from "./monetizationConstants";
import { isValidWithdrawalMethod } from "./monetizationUtils";

export function validateAmount(amount, min = 0, max = Infinity) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "Amount must be a valid number.";
  }

  if (value <= 0) {
    return "Amount must be greater than zero.";
  }

  if (value < min) {
    return `Minimum amount is ${min}.`;
  }

  if (value > max) {
    return `Maximum amount is ${max}.`;
  }

  return null;
}

export function validateWithdrawalAmount(amount) {
  return validateAmount(
    amount,
    MONETIZATION_LIMITS.MIN_WITHDRAWAL,
    MONETIZATION_LIMITS.MAX_WITHDRAWAL,
  );
}

export function validateGiftAmount(amount) {
  return validateAmount(amount, 1, MONETIZATION_LIMITS.MAX_GIFT_VALUE);
}

export function validateGiftQuantity(quantity) {
  const value = Number(quantity);

  if (!Number.isInteger(value) || value < 1) {
    return "Gift quantity must be a positive whole number.";
  }

  if (value > 100) {
    return "Gift quantity cannot exceed 100.";
  }

  return null;
}

export function validateWithdrawalMethod(method) {
  if (!isValidWithdrawalMethod(method)) {
    return "Invalid withdrawal method.";
  }

  return null;
}

export function validateWithdrawalAccount(method, accountNumber) {
  if (!accountNumber) {
    return "Account number is required.";
  }

  const value = String(accountNumber).trim();

  if (method === WITHDRAWAL_METHODS.MOBILE_MONEY) {
    if (!/^\+?[0-9]{7,15}$/.test(value)) {
      return "Enter a valid mobile money number.";
    }
  }

  if (method === WITHDRAWAL_METHODS.BANK) {
    if (value.length < 5) {
      return "Enter a valid bank account number.";
    }
  }

  return null;
}

export function validateGiftPayload(data = {}) {
  const errors = {};

  if (!data.recipientId) {
    errors.recipientId = "Recipient is required.";
  }

  if (!data.giftId) {
    errors.giftId = "Gift is required.";
  }

  const quantityError = validateGiftQuantity(data.quantity || 1);

  if (quantityError) {
    errors.quantity = quantityError;
  }

  return errors;
}

export function validateWithdrawalPayload(data = {}) {
  const errors = {};

  const amountError = validateWithdrawalAmount(data.amount);

  if (amountError) {
    errors.amount = amountError;
  }

  const methodError = validateWithdrawalMethod(data.method);

  if (methodError) {
    errors.method = methodError;
  }

  const accountError = validateWithdrawalAccount(
    data.method,
    data.accountNumber,
  );

  if (accountError) {
    errors.accountNumber = accountError;
  }

  return errors;
}

export function hasValidationErrors(errors = {}) {
  return Object.keys(errors).length > 0;
}

export function isWithdrawalValid(data = {}) {
  return !hasValidationErrors(validateWithdrawalPayload(data));
}

export function isGiftValid(data = {}) {
  return !hasValidationErrors(validateGiftPayload(data));
}

export default {
  validateAmount,
  validateWithdrawalAmount,
  validateGiftAmount,
  validateGiftQuantity,
  validateWithdrawalMethod,
  validateWithdrawalAccount,
  validateGiftPayload,
  validateWithdrawalPayload,
  hasValidationErrors,
  isWithdrawalValid,
  isGiftValid,
};
