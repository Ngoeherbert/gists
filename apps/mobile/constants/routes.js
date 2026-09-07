const routes = {
  root: {
    index: "/",
    onboarding: "/(onboarding)",
    auth: "/(auth)",
    main: "/(main)",
  },

  onboarding: {
    splash: "/(onboarding)/splash",
    screen1: "/(onboarding)/screen-1",
    screen2: "/(onboarding)/screen-2",
    screen3: "/(onboarding)/screen-3",
    getStarted: "/(onboarding)/get-started",
  },

  auth: {
    welcome: "/(auth)/welcome",
    login: "/(auth)/login",
    signup: "/(auth)/signup",
    phone: "/(auth)/phone",
    phoneOtp: "/(auth)/phone-otp",
    email: "/(auth)/email",
    emailOtp: "/(auth)/email-otp",
    createPassword: "/(auth)/create-password",
    forgotPassword: "/(auth)/forgot-password",
    resetOtp: "/(auth)/reset-otp",
    newPassword: "/(auth)/new-password",
    success: "/(auth)/success",
  },

  main: {
    feeds: "/(main)/feeds",
    reels: "/(main)/reels",
    create: "/(main)/create",
    chats: "/(main)/chats",
    profile: "/(main)/profile",
  },

  chats: {
    list: "/(main)/chats",
    chat: (id) => `/(main)/chats/${id}`,
    room: (id) => `/(main)/chats/rooms/${id}`,
  },

  profile: {
    index: "/(main)/profile",
    user: (username) => `/profile/${username}`,
  },
};

export default routes;
