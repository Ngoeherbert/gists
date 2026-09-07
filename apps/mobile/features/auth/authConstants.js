export const AUTH_METHODS = {
  EMAIL: "email",
  PHONE: "phone",
};

export const AUTH_STEPS = {
  WELCOME: "welcome",
  LOGIN: "login",
  SIGNUP: "signup",
  PHONE: "phone",
  PHONE_OTP: "phone-otp",
  EMAIL: "email",
  EMAIL_OTP: "email-otp",
  CREATE_PASSWORD: "create-password",
  FORGOT_PASSWORD: "forgot-password",
  RESET_OTP: "reset-otp",
  NEW_PASSWORD: "new-password",
  SUCCESS: "success",
};

export const OTP_TYPES = {
  PHONE_VERIFICATION: "phone_verification",
  EMAIL_VERIFICATION: "email_verification",
  PASSWORD_RESET: "password_reset",
};

export const AUTH_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export const AUTH_ERRORS = {
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PHONE: "Please enter a valid phone number.",
  INVALID_USERNAME: "Please enter a valid username.",
  INVALID_PASSWORD: "Please enter a valid password.",
  PASSWORD_MISMATCH: "Passwords do not match.",
  INVALID_OTP: "Please enter a valid verification code.",
  EMPTY_FIELD: "This field is required.",
  INVALID_CREDENTIALS: "Invalid email, phone number, or password.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your connection.",
};

export const AUTH_STORAGE_KEYS = {
  TOKEN: "gists_auth_token",
  REFRESH_TOKEN: "gists_refresh_token",
  USER: "gists_user",
};

export default {
  AUTH_METHODS,
  AUTH_STEPS,
  OTP_TYPES,
  AUTH_STATUS,
  AUTH_ERRORS,
  AUTH_STORAGE_KEYS,
};
