// components/common/Screen.jsx
// Screen shell: themed background, safe-area padding, optional scroll and
// keyboard-avoidance. Every onboarding/auth screen composes from this so the
// layouts stay consistent and we don't repeat insets/StatusBar wiring.

import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";

export default function Screen({
  children,
  scroll = false,
  keyboardAvoiding = true,
  padded = true,
  center = false,
  edges = ["top", "bottom"],
  background,
  header = null,
  headerStyle,
  contentContainerStyle,
  style,
}) {
  const { theme, isDark } = useAppTheme();

  const bg = background || (isDark ? colors.background : theme.app.background);

  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={[
        { backgroundColor: bg },
        padded && styles.padded,
        center && styles.centered,
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flex,
        { backgroundColor: bg },
        padded && styles.padded,
        center && styles.centered,
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  const body = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {header ? (
        <View style={[styles.headerSlot, { backgroundColor: bg }, headerStyle]}>
          {header}
        </View>
      ) : null}
      {inner}
    </KeyboardAvoidingView>
  ) : (
    <>
      {header ? (
        <View style={[styles.headerSlot, { backgroundColor: bg }, headerStyle]}>
          {header}
        </View>
      ) : null}
      {inner}
    </>
  );

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: bg }, style]}
      edges={edges}
    >
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.screenVertical,
  },
  centered: {
    flexGrow: 1,
    justifyContent: "center",
  },
  headerSlot: {},
});
