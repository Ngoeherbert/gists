const config = {
  app: {
    name: "Gists",
    displayName: "Gists",
    version: "1.0.0",
    scheme: "gists",
  },

  navigation: {
    tabs: {
      feeds: "Feeds",
      reels: "Reel",
      create: "Create",
      chats: "Chats",
      profile: "Profile",
    },
  },

  limits: {
    maxBioLength: 160,
    maxPostTextLength: 5000,
    maxCommentLength: 2000,
    maxMessageLength: 5000,
    maxStoryTextLength: 1000,
    maxReelCaptionLength: 2200,
  },

  pagination: {
    defaultLimit: 20,
    commentsLimit: 20,
    messagesLimit: 30,
  },

  media: {
    maxImageSizeMB: 15,
    maxVideoSizeMB: 100,
    maxAudioSizeMB: 25,
  },

  features: {
    stories: true,
    reels: true,
    gistRooms: true,
    gistAI: true,
    calls: true,
    voiceNotes: true,
    games: true,
    multipleAccounts: true,
    biometrics: true,
    notifications: true,
  },

  development: {
    debug: __DEV__,
  },
};

export default config;
