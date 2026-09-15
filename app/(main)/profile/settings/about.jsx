// app/(main)/profile/settings/about.jsx
// About: app version, build info and legal links.

import React from "react";
import { StyleSheet, View } from "react-native";
import config from "../../../../constants/config";
import spacing from "../../../../constants/spacing";
import useAppTheme from "../../../../hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import layout from "../../../../constants/layout";
import { Header, Screen } from "../../../../components/common";
import { Card, Text } from "../../../../components/ui";
import SettingsRow from "../../../../components/profile/SettingsRow";

export default function AboutSettingsScreen() {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Header title="About" showBack />

      <Screen scroll padded={false}>
        <View style={styles.body}>
          <View style={styles.brand}>
            <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="sparkles" size={layout.iconSize.xxl} color={colors.white} />
            </View>
            <Text variant="title" style={styles.appName}>
              {config.app.displayName}
            </Text>
            <Text variant="bodySmall" color="secondary_text">
              Version {config.app.version}
            </Text>
          </View>

          <Card padding="none">
            <SettingsRow label="App version" value={config.app.version} showChevron={false} />
            <SettingsRow label="Build" value="development" showChevron={false} />
            <SettingsRow label="Scheme" value={config.app.scheme} showChevron={false} />
            <SettingsRow label="Environment" value={config.development.debug ? "debug" : "production"} showChevron={false} />
          </Card>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: spacing.screenHorizontal,
  },
  brand: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: layout.borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  appName: {
    marginBottom: spacing.xxs,
  },
});
