import colors from "./colors";

export const darkTheme = {
  dark: true,

  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.secondary,
  },

  app: {
    background: colors.background,
    surface: colors.surface,
    card: colors.card,
    input: colors.chatInput,
  },

  text: {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    muted: colors.textMuted,
  },

  status: {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },

  social: {
    like: colors.like,
    comment: colors.comment,
    repost: colors.repost,
    share: colors.share,
    save: colors.save,
  },

  chat: {
    mine: colors.chatBubbleMine,
    other: colors.chatBubbleOther,
    input: colors.chatInput,
  },
};

export const lightTheme = {
  dark: false,

  colors: {
    primary: colors.primary,
    background: "#FFFFFF",
    card: "#F7F7FA",
    text: "#111118",
    border: "#E5E5EA",
    notification: colors.secondary,
  },

  app: {
    background: "#FFFFFF",
    surface: "#F7F7FA",
    card: "#FFFFFF",
    input: "#F1F1F5",
  },

  text: {
    primary: "#111118",
    secondary: "#5F5F6B",
    tertiary: "#8A8A96",
    muted: "#A5A5AF",
  },

  status: {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },

  social: {
    like: colors.like,
    comment: colors.comment,
    repost: colors.repost,
    share: colors.share,
    save: colors.save,
  },

  chat: {
    mine: colors.primary,
    other: "#F1F1F5",
    input: "#F1F1F5",
  },
};

export default darkTheme;
