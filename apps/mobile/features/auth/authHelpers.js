import authConfig from "./authConfig";

export function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

export function normalizePhone(phone = "") {
  return String(phone)
    .trim()
    .replace(/[\s()-]/g, "");
}

export function normalizeUsername(username = "") {
  return String(username).trim().replace(/^@/, "").toLowerCase();
}

export function normalizeName(name = "") {
  return String(name).trim().replace(/\s+/g, " ");
}

export function formatUsername(username = "") {
  const normalized = normalizeUsername(username);

  return normalized ? `@${normalized}` : "";
}

export function maskEmail(email = "") {
  const normalized = normalizeEmail(email);

  if (!normalized.includes("@")) {
    return normalized;
  }

  const [local, domain] = normalized.split("@");

  if (local.length <= 2) {
    return `${local[0] || "*"}***@${domain}`;
  }

  return `${local.slice(0, 2)}***@${domain}`;
}

export function maskPhone(phone = "") {
  const normalized = normalizePhone(phone);

  if (normalized.length <= 4) {
    return normalized;
  }

  return `${"*".repeat(
    Math.max(0, normalized.length - 4),
  )}${normalized.slice(-4)}`;
}

export function getOtpDigits(otp = "") {
  return String(otp).replace(/\D/g, "").slice(0, authConfig.otp.length);
}

export function isOtpComplete(otp = "") {
  return getOtpDigits(otp).length === authConfig.otp.length;
}

export function getRemainingResendSeconds(expiresAt) {
  if (!expiresAt) {
    return 0;
  }

  const expiration =
    expiresAt instanceof Date
      ? expiresAt.getTime()
      : new Date(expiresAt).getTime();

  if (Number.isNaN(expiration)) {
    return 0;
  }

  return Math.max(0, Math.ceil((expiration - Date.now()) / 1000));
}

export function createResendExpiration() {
  return new Date(
    Date.now() + authConfig.otp.resendCooldownSeconds * 1000,
  ).toISOString();
}

export function getPasswordStrength(password = "") {
  const value = String(password);

  let score = 0;

  if (value.length >= authConfig.password.minLength) {
    score += 1;
  }

  if (/[a-z]/.test(value)) {
    score += 1;
  }

  if (/[A-Z]/.test(value)) {
    score += 1;
  }

  if (/\d/.test(value)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(value)) {
    score += 1;
  }

  if (score <= 1) {
    return "weak";
  }

  if (score <= 3) {
    return "medium";
  }

  return "strong";
}

export function createAuthPayload({
  email,
  phone,
  username,
  password,
  firstName,
  lastName,
  ...rest
} = {}) {
  const payload = {
    ...rest,
  };

  if (email) {
    payload.email = normalizeEmail(email);
  }

  if (phone) {
    payload.phone = normalizePhone(phone);
  }

  if (username) {
    payload.username = normalizeUsername(username);
  }

  if (password) {
    payload.password = password;
  }

  if (firstName) {
    payload.firstName = normalizeName(firstName);
  }

  if (lastName) {
    payload.lastName = normalizeName(lastName);
  }

  return payload;
}

export function extractUserFromAuthResponse(response) {
  if (!response) {
    return null;
  }

  return response.user || response.data?.user || response.profile || null;
}

export function extractTokenFromAuthResponse(response) {
  if (!response) {
    return null;
  }

  return (
    response.token ||
    response.accessToken ||
    response.data?.token ||
    response.data?.accessToken ||
    null
  );
}

export function extractRefreshToken(response) {
  if (!response) {
    return null;
  }

  return response.refreshToken || response.data?.refreshToken || null;
}

export default {
  normalizeEmail,
  normalizePhone,
  normalizeUsername,
  normalizeName,
  formatUsername,
  maskEmail,
  maskPhone,
  getOtpDigits,
  isOtpComplete,
  getRemainingResendSeconds,
  createResendExpiration,
  getPasswordStrength,
  createAuthPayload,
  extractUserFromAuthResponse,
  extractTokenFromAuthResponse,
  extractRefreshToken,
};
