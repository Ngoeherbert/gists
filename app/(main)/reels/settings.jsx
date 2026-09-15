// app/(main)/reels/settings.jsx

// Per-reel options reached from the reel action rail: audience, download,
// comment controls, save / share / report and delete for own reels.

import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";

import useAppTheme from "../../../hooks/useAppTheme";
import useAppStore from "../../../stores/appStore";

import { Header, Screen } from "../../../components/common";
import { Card, Divider, Text } from "../../../components/ui";

export default function ReelSettingsScreen() {
  const router = useRouter();

  const { theme } = useAppTheme();
  const showToast = useAppStore((s) => s.showToast);

  const [allowComments, setAllowComments] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [saveToDevice, setSaveToDevice] = useState(false);

  return (
    <Screen
      scroll
      padded={false}
      header={<Header title="Reel options" showBack />}
    >
      <View style={styles.body}>
        <Card padding="none" style={styles.group}>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.rowLabel}>
              Allow comments
            </Text>

            <Switch
              value={allowComments}
              onValueChange={setAllowComments}
              trackColor={{
                true: theme.colors.primary,
                false: colors.border,
              }}
            />
          </View>

          <Divider />

          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.rowLabel}>
              Allow remix / duet
            </Text>

            <Switch
              value={allowDuet}
              onValueChange={setAllowDuet}
              trackColor={{
                true: theme.colors.primary,
                false: colors.border,
              }}
            />
          </View>

          <Divider />

          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.rowLabel}>
              Save to device
            </Text>

            <Switch
              value={saveToDevice}
              onValueChange={setSaveToDevice}
              trackColor={{
                true: theme.colors.primary,
                false: colors.border,
              }}
            />
          </View>
        </Card>

        <Card padding="none" style={styles.group}>
          <ActionRow
            icon="download-outline"
            label="Download reel"
            onPress={() => showToast("Download started", "info")}
          />

          <Divider />

          <ActionRow
            icon="paper-plane-outline"
            label="Share to…"
            onPress={() => showToast("Share sheet coming soon", "info")}
          />

          <Divider />

          <ActionRow
            icon="link-outline"
            label="Copy link"
            onPress={() => showToast("Link copied", "success")}
          />
        </Card>

        <Card padding="none" style={styles.group}>
          <ActionRow
            icon="flag-outline"
            label="Report"
            tone={theme.status.warning}
            onPress={() => showToast("Report submitted", "info")}
          />

          <Divider />

          <ActionRow
            icon="trash-outline"
            label="Delete reel"
            tone={theme.status.error}
            onPress={() => {
              showToast("Reel deleted", "success");
              router.back();
            }}
          />
        </Card>
      </View>
    </Screen>
  );
}

function ActionRow({ icon, label, tone, onPress }) {
  const { theme } = useAppTheme();

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Ionicons
        name={icon}
        size={layout.iconSize.md}
        color={tone || theme.text.secondary}
        style={styles.rowIcon}
      />

      <Text
        variant="bodyMedium"
        color={tone || "default"}
        style={styles.rowLabel}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.screenHorizontal,
  },

  group: {
    marginBottom: spacing.lg,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.cardPadding,
    paddingVertical: spacing.lg,
  },

  rowIcon: {
    marginRight: spacing.md,
  },

  rowLabel: {
    flex: 1,
  },
});
