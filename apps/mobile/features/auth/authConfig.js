const authConfig = {
  appName: "Gists",

  session: {
    tokenKey: "gists_auth_token",
    refreshTokenKey: "gists_refresh_token",
    userKey: "gists_user",
  },

  otp: {
    length: 6,
    expirationSeconds: 300,
    resendCooldownSeconds: 60,
    maxAttempts: 5,
  },

  password: {
    minLength: 8,
    maxLength: 128,
  },

  username: {
    minLength: 3,
    maxLength: 30,
  },

  phone: {
    minLength: 7,
    maxLength: 15,
  },

  email: {
    maxLength: 254,
  },

  features: {
    phoneAuth: true,
    emailAuth: true,
    passwordAuth: true,
    forgotPassword: true,
    socialLogin: false,
  },
};

export default authConfig;
