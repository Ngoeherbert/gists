// components/ui/EmptyState.jsx
// Placeholder shown when a list/feed has no content or a request failed.
// Doubles as an error state when `tone="error"`.

import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Button from "./Button";
import Text from "./Text";

export default function EmptyState({
  icon = "sparkles-outline",
  title,
  description,
  actionLabel,
  onAction,
  tone = "default", // "default" | "error"
  compact = false,
  style,
}) {
  const { theme } = useAppTheme();
  const iconColor =
    tone === "error" ? theme.status.error : theme.colors.primary;

  return (
    <View style={[compact ? styles.compact : styles.base, style]}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: `${iconColor}1A`,
            borderRadius: layout.borderRadius.round,
          },
        ]}
      >
        <Ionicons name={icon} size={layout.iconSize.xl} color={iconColor} />
      </View>

      {title ? (
        <Text variant="subtitle" align="center" style={styles.title}>
          {title}
        </Text>
      ) : null}

      {description ? (
        <Text
          variant="bodySmall"
          color="secondary_text"
          align="center"
          style={styles.description}
        >
          {description}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          variant="outline"
          size="medium"
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  compact: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    maxWidth: 300,
    color: colors.textSecondary,
  },
  action: {
    marginTop: spacing.xl,
  },
});
