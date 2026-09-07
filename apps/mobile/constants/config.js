const config = {
  appName: "Gists",
  appVersion: "1.0.0",

  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api",
    timeout: 15000,
  },

  storage: {
    authToken: "gists_auth_token",
    refreshToken: "gists_refresh_token",
    user: "gists_user",
    onboardingCompleted: "gists_onboarding_completed",
    settings: "gists_settings",
  },

  pagination: {
    page: 1,
    limit: 20,
    feedLimit: 20,
    notificationLimit: 20,
    messageLimit: 30,
  },

  upload: {
    maxImageSize: 10 * 1024 * 1024,
    maxVideoSize: 100 * 1024 * 1024,
    maxFileSize: 50 * 1024 * 1024,

    imageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],

    videoTypes: ["video/mp4", "video/quicktime", "video/webm"],
  },

  reels: {
    maxDuration: 90,
    defaultDuration: 30,
  },

  stories: {
    duration: 5000,
    maxDuration: 60 * 1000,
  },

  chat: {
    typingTimeout: 3000,
    maxMessageLength: 5000,
  },

  features: {
    ai: true,
    reels: true,
    stories: true,
    calls: true,
    rooms: true,
    monetization: true,
  },
};

export default config;
