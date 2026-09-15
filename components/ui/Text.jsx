// components/ui/Text.jsx
// Typography primitive. Maps a `variant` to constants/typography styles and a
// `color` token to the active theme, so screens never hand-roll font styles.

import React from "react";
import { Text as RNText } from "react-native";
import typography from "../../constants/typography";
import useAppTheme from "../../hooks/useAppTheme";

const VARIANT_STYLES = {
  hero: typography.styles.hero,
  display: typography.styles.display,
  heading: typography.styles.heading,
  title: typography.styles.title,
  subtitle: typography.styles.subtitle,
  body: typography.styles.body,
  bodyMedium: typography.styles.bodyMedium,
  bodyBold: typography.styles.bodyBold,
  bodySmall: typography.styles.bodySmall,
  caption: typography.styles.caption,
};

// Named color tokens resolved against the active theme.
const COLOR_TOKENS = {
  primary: (t) => t.colors.primary,
  secondary: (t) => t.colors.notification,
  success: (t) => t.status.success,
  warning: (t) => t.status.warning,
  error: (t) => t.status.error,
  info: (t) => t.status.info,
  default: (t) => t.text.primary,
  secondary_text: (t) => t.text.secondary,
  tertiary: (t) => t.text.tertiary,
  muted: (t) => t.text.muted,
  inverse: (t) => (t.dark ? "#0B0B0F" : "#FFFFFF"),
};

const Text = React.forwardRef(function Text(
  { variant = "body", color = "default", align, style, children, ...rest },
  ref,
) {
  const { theme } = useAppTheme();
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.body;
  const resolver = COLOR_TOKENS[color];
  const textColor = resolver ? resolver(theme) : color; // raw hex also allowed

  return (
    <RNText
      ref={ref}
      style={[
        variantStyle,
        { color: textColor },
        align && { textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
});

export default Text;
