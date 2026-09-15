// components/auth/OnboardingSlide.jsx
// One onboarding page: illustration, title, body, page dots and the
// Next/Skip controls. screen-1..3 are thin wrappers around this.

import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useAppStore from "../../stores/appStore";
import { Button, Text } from "../ui";
import Screen from "../common/Screen";
import OnboardingDots from "./OnboardingDots";

export default function OnboardingSlide({
  index = 0,
  total = 3,
  icon,
  title,
  description,
  accent,
}) {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setOnboardingSlide = useAppStore((s) => s.setOnboardingSlide);

  const isLast = index >= total - 1;
  const accentColor = accent || theme.colors.primary;

  const finish = () => {
    completeOnboarding();
    router.navigate("/(onboarding)/get-started");
  };

  const next = () => {
    setOnboardingSlide(index + 1);
    router.navigate(`/(onboarding)/screen-${index + 2}`);
  };

  return (
    <Screen>
      <View style={styles.skipRow}>
        <Button title="Skip" variant="link" size="small" onPress={finish} />
      </View>

      <View style={styles.body}>
        <View
          style={[
            styles.art,
            {
              backgroundColor: `${accentColor}1A`,
              borderColor: `${accentColor}44`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={layout.iconSize.huge}
            color={accentColor}
          />
        </View>

        <Text variant="heading" align="center" style={styles.title}>
          {title}
        </Text>

        <Text
          variant="body"
          color="secondary_text"
          align="center"
          style={styles.description}
        >
          {description}
        </Text>
      </View>

      <View style={styles.footer}>
        <OnboardingDots total={total} active={index} color={accentColor} />

        <Button
          title={isLast ? "Get started" : "Next"}
          icon="arrow-forward"
          iconPosition="right"
          fullWidth
          size="large"
          onPress={isLast ? finish : next}
        />

        {isLast ? null : (
          <Button
            title="Skip for now"
            variant="ghost"
            fullWidth
            style={styles.secondary}
            onPress={finish}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  skipRow: {
    alignItems: "flex-end",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  art: {
    width: 160,
    height: 160,
    borderRadius: layout.borderRadius.xxl,
    borderWidth: layout.borderWidth.thin,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.huge,
  },
  title: {
    marginBottom: spacing.md,
  },
  description: {
    maxWidth: 320,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});
