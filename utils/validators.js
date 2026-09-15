// utils/validators.js
// Form validation helpers shared by the auth screens. Each returns an error
// string (falsy when valid) so callers can do `errors.email = validateEmail(x)`.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// E.164-ish: optional +, 8-15 digits, spaces/dashes allowed in input.
export const PHONE_RE = /^\+?[0-9][0-9\s-]{6,14}$/;

export function validateEmail(value) {
  if (!value || !value.trim()) return "Email is required";
  if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address";
  return null;
}

export function validatePhone(value) {
  if (!value || !value.trim()) return "Phone number is required";
  if (!PHONE_RE.test(value.trim())) return "Enter a valid phone number";
  return null;
}

export function validateRequired(value, label = "This field") {
  if (!value || !String(value).trim()) return `${label} is required`;
  return null;
}

export function validatePassword(value, { min = 8 } = {}) {
  if (!value) return "Password is required";
  if (value.length < min) return `Use at least ${min} characters`;
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return "Include at least one letter and one number";
  }
  return null;
}

export function validatePasswordConfirm(password, confirm) {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return null;
}

export function validateName(value) {
  if (!value || !value.trim()) return "Name is required";
  if (value.trim().length < 2) return "Name is too short";
  return null;
}

export function validateUsername(value) {
  if (!value || !value.trim()) return "Username is required";
  if (!/^[a-z0-9._]{3,24}$/i.test(value.trim())) {
    return "3-24 letters, numbers, dots or underscores";
  }
  return null;
}

export function validateOtp(value, length = 6) {
  if (!value) return "Enter the code";
  if (value.length < length) return `Enter all ${length} digits`;
  return null;
}

// Password strength 0..4 used by the signup meter.
export function passwordStrength(value = "") {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}
