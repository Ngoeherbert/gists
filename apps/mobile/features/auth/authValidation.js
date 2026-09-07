import authConfig from "./authConfig";
import {
  normalizeEmail,
  normalizePhone,
  normalizeUsername,
} from "./authHelpers";

export function validateEmail(email = "") {
  const value = normalizeEmail(email);

  if (!value) {
    return "Email is required.";
  }

  if (value.length > authConfig.email.maxLength) {
    return "Email address is too long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return "Please enter a valid email address.";
  }

  return null;
}

export function validatePhone(phone = "") {
  const value = normalizePhone(phone);

  if (!value) {
    return "Phone number is required.";
  }

  if (!/^\+?\d+$/.test(value)) {
    return "Please enter a valid phone number.";
  }

  if (
    value.replace("+", "").length < authConfig.phone.minLength ||
    value.replace("+", "").length > authConfig.phone.maxLength
  ) {
    return "Please enter a valid phone number.";
  }

  return null;
}

export function validateUsername(username = "") {
  const value = normalizeUsername(username);

  if (!value) {
    return "Username is required.";
  }

  if (
    value.length < authConfig.username.minLength ||
    value.length > authConfig.username.maxLength
  ) {
    return `Username must be between ${authConfig.username.minLength} and ${authConfig.username.maxLength} characters.`;
  }

  if (!/^[a-z0-9._]+$/.test(value)) {
    return "Username can only contain letters, numbers, dots, and underscores.";
  }

  return null;
}

export function validatePassword(password = "") {
  const value = String(password);

  if (!value) {
    return "Password is required.";
  }

  if (value.length < authConfig.password.minLength) {
    return `Password must be at least ${authConfig.password.minLength} characters.`;
  }

  if (value.length > authConfig.password.maxLength) {
    return `Password must be ${authConfig.password.maxLength} characters or less.`;
  }

  return null;
}

export function validatePasswordConfirmation(
  password = "",
  confirmPassword = "",
) {
  const passwordError = validatePassword(password);

  if (passwordError) {
    return passwordError;
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}

export function validateOtp(otp = "") {
  const value = String(otp).replace(/\D/g, "");

  if (!value) {
    return "Verification code is required.";
  }

  if (value.length !== authConfig.otp.length) {
    return `Verification code must contain ${authConfig.otp.length} digits.`;
  }

  return null;
}

export function validateName(name = "", fieldName = "Name") {
  const value = String(name).trim();

  if (!value) {
    return `${fieldName} is required.`;
  }

  if (value.length < 2) {
    return `${fieldName} must be at least 2 characters.`;
  }

  if (value.length > 50) {
    return `${fieldName} is too long.`;
  }

  return null;
}

export function validateLoginForm(form = {}) {
  const errors = {};

  const identifier = String(form.identifier || "").trim();

  if (!identifier) {
    errors.identifier = "Email or phone number is required.";
  } else if (identifier.includes("@")) {
    const emailError = validateEmail(identifier);

    if (emailError) {
      errors.identifier = emailError;
    }
  } else {
    const phoneError = validatePhone(identifier);

    if (phoneError) {
      errors.identifier = phoneError;
    }
  }

  const passwordError = validatePassword(form.password);

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateSignupForm(form = {}) {
  const errors = {};

  const firstNameError = validateName(form.firstName, "First name");

  if (firstNameError) {
    errors.firstName = firstNameError;
  }

  const lastNameError = validateName(form.lastName, "Last name");

  if (lastNameError) {
    errors.lastName = lastNameError;
  }

  const usernameError = validateUsername(form.username);

  if (usernameError) {
    errors.username = usernameError;
  }

  const emailError = validateEmail(form.email);

  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(form.password);

  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validatePasswordConfirmation(
    form.password,
    form.confirmPassword,
  );

  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  if (form.phone) {
    const phoneError = validatePhone(form.phone);

    if (phoneError) {
      errors.phone = phoneError;
    }
  }

  return errors;
}

export function hasValidationErrors(errors = {}) {
  return Object.keys(errors).length > 0;
}

export default {
  validateEmail,
  validatePhone,
  validateUsername,
  validatePassword,
  validatePasswordConfirmation,
  validateOtp,
  validateName,
  validateLoginForm,
  validateSignupForm,
  hasValidationErrors,
};
