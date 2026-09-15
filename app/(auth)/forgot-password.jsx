// app/(auth)/forgot-password.jsx
// Password reset entry: collect the email (or phone) the account uses, then
// hand off to the OTP verification step.

import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../constants/spacing";
import useAuthStore from "../../stores/authStore";
import useAppStore from "../../stores/appStore";
import { validateEmail } from "../../utils/validators";
import { Button, Input, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";
import AuthHeader from "../../components/auth/AuthHeader";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const startOtp = useAuthStore((s) => s.startOtp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useAppStore((s) => s.showToast);

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(() => {
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    const clean = email.trim().toLowerCase();
    startOtp({ type: "email", value: clean, channel: "email" });
    showToast("Reset code sent", "success");
    router.navigate({ pathname: "/(auth)/reset-otp", params: { email: clean } });
  }, [email, startOtp, router, showToast]);

  return (
    <Screen scroll>
      <AuthHeader
        title="Forgot password?"
        subtitle="No worries — enter your email and we'll send a code to reset it."
      />

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          if (error) setError(validateEmail(v));
        }}
        error={error}
        leftIcon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoFocus
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
      />

      <Button
        title="Send reset code"
        size="large"
        fullWidth
        loading={isLoading}
        onPress={handleSubmit}
        style={styles.submit}
      />

      <Button
        title="Back to sign in"
        variant="link"
        fullWidth
        style={styles.back}
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  submit: {
    marginTop: spacing.xl,
  },
  back: {
    marginTop: spacing.sm,
  },
});
