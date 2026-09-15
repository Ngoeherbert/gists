// components/auth/AuthHeader.jsx
// Shared heading block for auth screens: back button, title, subtitle.

import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../constants/spacing";
import IconButton from "../ui/IconButton";
import Text from "../ui/Text";

export default function AuthHeader({
  title,
  subtitle,
  showBack = true,
  right = null,
  style,
}) {
  const router = useRouter();

  return (
    <View style={[styles.wrap, style]}>
      {(showBack || right) && (
        <View style={styles.topRow}>
          {showBack ? (
            <IconButton
              name="arrow-back"
              onPress={() =>
                router.canGoBack?.()
                  ? router.back()
                  : router.replace("/welcome")
              }
            />
          ) : (
            <View />
          )}
          {right}
        </View>
      )}

      {title ? (
        <Text variant="heading" style={styles.title}>
          {title}
        </Text>
      ) : null}

      {subtitle ? (
        <Text variant="body" color="secondary_text" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xxl,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    maxWidth: 320,
  },
});
