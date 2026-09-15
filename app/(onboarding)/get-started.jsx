// app/(onboarding)/get-started.jsx
// Final onboarding step: pick how the account will be used, then continue to
// the auth funnel. The choice is stored in appStore.signupRole.

import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useAppStore from "../../stores/appStore";
import { Button, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";

const ROLES = [
  {
    id: "creator",
    icon: "videocam-outline",
    title: "I'm a creator",
    description: "Post reels, stories and build an audience.",
    accent: colors.primary,
  },
  {
    id: "viewer",
    icon: "eye-outline",
    title: "Just here to explore",
    description: "Follow people and enjoy the feed.",
    accent: colors.accent,
  },
];

export default function GetStartedScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const signupRole = useAppStore((s) => s.signupRole);
  const setSignupRole = useAppStore((s) => s.setSignupRole);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const handleContinue = () => {
    completeOnboarding();
    router.navigate("/(auth)/welcome");
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="heading">How will you use Gists?</Text>
        <Text variant="body" color="secondary_text" style={styles.subtitle}>
          Pick one to personalise your experience. You can change this later.
        </Text>
      </View>

      <View style={styles.roles}>
        {ROLES.map((role) => {
          const selected = signupRole === role.id;
          return (
            <Button
              key={role.id}
              variant={selected ? "solid" : "outline"}
              tone="primary"
              fullWidth
              onPress={() => setSignupRole(role.id)}
              style={[
                styles.roleCard,
                selected && { borderColor: role.accent },
              ]}
            >
              <View style={styles.roleInner}>
                <View
                  style={[
                    styles.roleIcon,
                    { backgroundColor: `${role.accent}1A` },
                  ]}
                >
                  <Ionicons
                    name={role.icon}
                    size={layout.iconSize.lg}
                    color={role.accent}
                  />
                </View>
                <View style={styles.roleText}>
                  <Text variant="bodyMedium">{role.title}</Text>
                  <Text variant="bodySmall" color="secondary_text">
                    {role.description}
                  </Text>
                </View>
                {selected ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={layout.iconSize.md}
                    color={role.accent}
                  />
                ) : null}
              </View>
            </Button>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          icon="arrow-forward"
          iconPosition="right"
          size="large"
          fullWidth
          disabled={!signupRole}
          onPress={handleContinue}
        />
        <Button
          title="Sign in instead"
          variant="link"
          fullWidth
          style={styles.signin}
          onPress={() => router.navigate("/(auth)/login")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  roles: {
    flex: 1,
  },
  roleCard: {
    marginBottom: spacing.md,
    height: "auto",
    paddingVertical: spacing.lg,
    borderColor: colors.border,
  },
  roleInner: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  roleIcon: {
    width: 44,
    height: 44,
    borderRadius: layout.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  roleText: {
    flex: 1,
  },
  footer: {
    marginTop: spacing.xl,
  },
  signin: {
    marginTop: spacing.sm,
  },
});
