export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

export function isEmail(value) {
  if (!isRequired(value)) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function isPhoneNumber(value) {
  if (!isRequired(value)) return false;

  const phone = String(value).replace(/[\s()-]/g, "");

  return /^\+?[0-9]{7,15}$/.test(phone);
}

export function isUsername(value) {
  if (!isRequired(value)) return false;

  return /^[a-zA-Z0-9_]{3,30}$/.test(String(value).trim());
}

export function isPassword(value) {
  if (!isRequired(value)) return false;

  return String(value).length >= 8;
}

export function isStrongPassword(value) {
  if (!isRequired(value)) return false;

  const password = String(value);

  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function passwordsMatch(password, confirmation) {
  return (
    isRequired(password) &&
    isRequired(confirmation) &&
    password === confirmation
  );
}

export function isValidUrl(value) {
  if (!isRequired(value)) return false;

  try {
    new URL(String(value));
    return true;
  } catch {
    return false;
  }
}

export function isValidOtp(value, length = 6) {
  if (!isRequired(value)) return false;

  return new RegExp(`^\\d{${length}}$`).test(String(value).trim());
}

export function isValidLength(value, min = 0, max = Infinity) {
  if (!isRequired(value)) return false;

  const length = String(value).trim().length;

  return length >= min && length <= max;
}

export function validateEmail(value) {
  if (!isRequired(value)) {
    return "Email is required";
  }

  if (!isEmail(value)) {
    return "Enter a valid email address";
  }

  return null;
}

export function validatePassword(value) {
  if (!isRequired(value)) {
    return "Password is required";
  }

  if (!isPassword(value)) {
    return "Password must be at least 8 characters";
  }

  return null;
}

export function validateUsername(value) {
  if (!isRequired(value)) {
    return "Username is required";
  }

  if (!isUsername(value)) {
    return "Username must be 3–30 characters and use only letters, numbers, or underscores";
  }

  return null;
}

export default {
  isRequired,
  isEmail,
  isPhoneNumber,
  isUsername,
  isPassword,
  isStrongPassword,
  passwordsMatch,
  isValidUrl,
  isValidOtp,
  isValidLength,
  validateEmail,
  validatePassword,
  validateUsername,
};
