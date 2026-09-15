// app/(auth)/welcome.jsx
// Entry screen of the auth funnel: brand mark plus the primary Sign up / Sign in
// calls to action.

import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import { Button, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <Screen>
      <View style={styles.body}>
        <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="sparkles" size={layout.iconSize.xxl} color={colors.white} />
        </View>

        <Text variant="heading" align="center" style={styles.title}>
          Welcome to Gists
        </Text>

        <Text variant="body" color="secondary_text" align="center" style={styles.subtitle}>
          Create an account to share your world, or sign in to pick up where you left off.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Create account"
          size="large"
          fullWidth
          onPress={() => router.navigate("/(auth)/signup")}
        />
        <Button
          title="I already have an account"
          variant="outline"
          size="large"
          fullWidth
          style={styles.secondary}
          onPress={() => router.navigate("/(auth)/login")}
        />

        <Text variant="caption" color="tertiary" align="center" style={styles.legal}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: layout.borderRadius.xxl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    marginBottom: spacing.md,
  },
  subtitle: {
    maxWidth: 320,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
  secondary: {
    marginTop: spacing.sm,
  },
  legal: {
    marginTop: spacing.lg,
    maxWidth: 300,
    alignSelf: "center",
  },
});
