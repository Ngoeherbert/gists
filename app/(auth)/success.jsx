// app/(auth)/success.jsx
// Generic success confirmation used after password reset (and reusable for
// other "done" moments in the funnel).

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import { Button, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";

export default function SuccessScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const params = useLocalSearchParams();

  const title = params.title || "All done!";
  const message =
    params.message || "Your password has been updated. Sign in with your new credentials.";

  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 10 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <Screen center>
      <Animated.View style={[styles.iconWrap, { opacity, transform: [{ scale }] }]}>
        <View style={[styles.icon, { backgroundColor: `${theme.status.success}22` }]}>
          <Ionicons name="checkmark-circle" size={layout.iconSize.xxl} color={theme.status.success} />
        </View>
      </Animated.View>

      <Text variant="heading" align="center" style={styles.title}>
        {title}
      </Text>

      <Text variant="body" color="secondary_text" align="center" style={styles.message}>
        {message}
      </Text>

      <Button
        title="Continue to sign in"
        size="large"
        fullWidth
        onPress={() => router.replace("/(auth)/login")}
        style={styles.submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    marginBottom: spacing.xl,
  },
  icon: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: spacing.sm,
  },
  message: {
    maxWidth: 320,
    marginBottom: spacing.xxl,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
