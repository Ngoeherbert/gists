export const USER_FIELDS = {
  ID: "id",
  USERNAME: "username",
  EMAIL: "email",
  PHONE: "phone",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  DISPLAY_NAME: "displayName",
  AVATAR: "avatar",
  BIO: "bio",
  VERIFIED: "verified",
  CREATED_AT: "createdAt",
};

export const LOGIN_FIELDS = {
  IDENTIFIER: "identifier",
  EMAIL: "email",
  PHONE: "phone",
  PASSWORD: "password",
};

export const SIGNUP_FIELDS = {
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  USERNAME: "username",
  EMAIL: "email",
  PHONE: "phone",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
};

export const OTP_FIELDS = {
  OTP: "otp",
  TYPE: "type",
  EMAIL: "email",
  PHONE: "phone",
};

export const PASSWORD_FIELDS = {
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
  CURRENT_PASSWORD: "currentPassword",
};

export function createEmptyLoginForm() {
  return {
    identifier: "",
    password: "",
  };
}

export function createEmptySignupForm() {
  return {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };
}

export function createEmptyOtpForm() {
  return {
    otp: "",
  };
}

export function createEmptyPasswordForm() {
  return {
    password: "",
    confirmPassword: "",
  };
}

export default {
  USER_FIELDS,
  LOGIN_FIELDS,
  SIGNUP_FIELDS,
  OTP_FIELDS,
  PASSWORD_FIELDS,
  createEmptyLoginForm,
  createEmptySignupForm,
  createEmptyOtpForm,
  createEmptyPasswordForm,
};
