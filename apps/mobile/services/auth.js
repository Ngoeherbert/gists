import { get, patch, post } from "./api";
import { getItem, removeItem, setItem } from "../utils/storage";

const AUTH_TOKEN_KEY = "gists_auth_token";
const REFRESH_TOKEN_KEY = "gists_refresh_token";
const USER_KEY = "gists_user";

export async function login(credentials) {
  const response = await post("/auth/login", credentials);

  if (response?.token) {
    await setItem(AUTH_TOKEN_KEY, response.token);
  }

  if (response?.refreshToken) {
    await setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }

  if (response?.user) {
    await setItem(USER_KEY, response.user);
  }

  return response;
}

export async function signup(data) {
  const response = await post("/auth/signup", data);

  if (response?.token) {
    await setItem(AUTH_TOKEN_KEY, response.token);
  }

  if (response?.refreshToken) {
    await setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }

  if (response?.user) {
    await setItem(USER_KEY, response.user);
  }

  return response;
}

export async function logout() {
  try {
    await post("/auth/logout");
  } catch (error) {
    // Local credentials should still be cleared.
  }

  await removeItem(AUTH_TOKEN_KEY);
  await removeItem(REFRESH_TOKEN_KEY);
  await removeItem(USER_KEY);

  return true;
}

export async function getCurrentUser() {
  return get("/auth/me");
}

export async function refreshToken() {
  const refreshTokenValue = await getItem(REFRESH_TOKEN_KEY);

  if (!refreshTokenValue) {
    throw new Error("No refresh token available");
  }

  const response = await post("/auth/refresh", {
    refreshToken: refreshTokenValue,
  });

  if (response?.token) {
    await setItem(AUTH_TOKEN_KEY, response.token);
  }

  if (response?.refreshToken) {
    await setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }

  return response;
}

export async function sendPhoneOtp(phone) {
  return post("/auth/phone/send-otp", { phone });
}

export async function verifyPhoneOtp(phone, otp) {
  return post("/auth/phone/verify-otp", {
    phone,
    otp,
  });
}

export async function sendEmailOtp(email) {
  return post("/auth/email/send-otp", { email });
}

export async function verifyEmailOtp(email, otp) {
  return post("/auth/email/verify-otp", {
    email,
    otp,
  });
}

export async function forgotPassword(identifier) {
  return post("/auth/forgot-password", {
    identifier,
  });
}

export async function verifyResetOtp(identifier, otp) {
  return post("/auth/reset-password/verify-otp", {
    identifier,
    otp,
  });
}

export async function resetPassword(identifier, otp, password) {
  return post("/auth/reset-password", {
    identifier,
    otp,
    password,
  });
}

export async function changePassword(currentPassword, newPassword) {
  return patch("/auth/password", {
    currentPassword,
    newPassword,
  });
}

export async function getStoredUser() {
  return getItem(USER_KEY);
}

export async function saveUser(user) {
  return setItem(USER_KEY, user);
}

export async function getStoredToken() {
  return getItem(AUTH_TOKEN_KEY);
}

export default {
  login,
  signup,
  logout,
  getCurrentUser,
  refreshToken,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendEmailOtp,
  verifyEmailOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  changePassword,
  getStoredUser,
  saveUser,
  getStoredToken,
};
