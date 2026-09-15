// app/(auth)/interests.jsx
// Pick topics to seed the feed. Selection lives in appStore.interests; at least
// three are required before finishing the funnel.

import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useAppStore from "../../stores/appStore";
import useAuthStore from "../../stores/authStore";
import { Button, Chip, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";
import AuthHeader from "../../components/auth/AuthHeader";

const MIN_SELECTION = 3;

const INTERESTS = [
  {
    id: "music",
    label: "Music",
    icon: "musical-notes-outline",
    accent: colors.primary,
  },
  {
    id: "sports",
    label: "Sports",
    icon: "football-outline",
    accent: colors.success,
  },
  {
    id: "tech",
    label: "Tech",
    icon: "hardware-chip-outline",
    accent: colors.accent,
  },
  {
    id: "travel",
    label: "Travel",
    icon: "airplane-outline",
    accent: colors.info,
  },
  {
    id: "food",
    label: "Food",
    icon: "fast-food-outline",
    accent: colors.warning,
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: "shirt-outline",
    accent: colors.secondary,
  },
  {
    id: "fitness",
    label: "Fitness",
    icon: "barbell-outline",
    accent: colors.success,
  },
  {
    id: "art",
    label: "Art",
    icon: "color-palette-outline",
    accent: colors.primaryLight,
  },
  { id: "film", label: "Film", icon: "film-outline", accent: colors.secondary },
  {
    id: "gaming",
    label: "Gaming",
    icon: "game-controller-outline",
    accent: colors.accent,
  },
  {
    id: "nature",
    label: "Nature",
    icon: "leaf-outline",
    accent: colors.success,
  },
  {
    id: "business",
    label: "Business",
    icon: "briefcase-outline",
    accent: colors.info,
  },
];

export default function InterestsScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const interests = useAppStore((s) => s.interests);
  const toggleInterest = useAppStore((s) => s.toggleInterest);
  const setInterests = useAppStore((s) => s.setInterests);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const showToast = useAppStore((s) => s.showToast);

  const [isSaving, setIsSaving] = useState(false);

  const selectedCount = interests.length;
  const canContinue = selectedCount >= MIN_SELECTION;

  const remaining = useMemo(
    () => Math.max(0, MIN_SELECTION - selectedCount),
    [selectedCount],
  );

  const handleFinish = useCallback(async () => {
    if (!canContinue) {
      showToast(`Pick at least ${MIN_SELECTION} interests`, "warning");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);

    await setOnboarded(true);
    showToast("You're all set — welcome to Gists!", "success");
    router.replace("/(main)/feeds");
  }, [canContinue, setOnboarded, router, showToast]);

  return (
    <Screen scroll>
      <AuthHeader
        title="What are you into?"
        subtitle={`Choose at least ${MIN_SELECTION} topics so we can personalise your feed.`}
        showBack={false}
      />

      <View style={styles.grid}>
        {INTERESTS.map((interest) => {
          const selected = interests.includes(interest.id);
          return (
            <Pressable
              key={interest.id}
              onPress={() => toggleInterest(interest.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[
                styles.tile,
                {
                  backgroundColor: selected
                    ? `${interest.accent}22`
                    : isDark
                      ? colors.surface
                      : theme.app.surface,
                  borderColor: selected
                    ? interest.accent
                    : isDark
                      ? colors.border
                      : theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name={interest.icon}
                size={layout.iconSize.lg}
                color={selected ? interest.accent : theme.text.secondary}
              />
              <Text
                variant="bodySmall"
                color={selected ? "default" : "secondary_text"}
                style={styles.tileLabel}
              >
                {interest.label}
              </Text>
              {selected ? (
                <View
                  style={[styles.check, { backgroundColor: interest.accent }]}
                >
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text
          variant="bodySmall"
          color="secondary_text"
          align="center"
          style={styles.count}
        >
          {selectedCount} selected
          {remaining > 0 ? ` — pick ${remaining} more` : ""}
        </Text>

        <Button
          title="Finish setup"
          icon="checkmark"
          iconPosition="right"
          size="large"
          fullWidth
          disabled={!canContinue}
          loading={isSaving}
          onPress={handleFinish}
        />

        <Button
          title="Clear selection"
          variant="ghost"
          fullWidth
          style={styles.clear}
          onPress={() => setInterests([])}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48%",
    borderRadius: layout.borderRadius.lg,
    borderWidth: layout.borderWidth.thin,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  tileLabel: {
    marginTop: spacing.sm,
  },
  check: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: spacing.md,
  },
  count: {
    marginBottom: spacing.md,
  },
});
