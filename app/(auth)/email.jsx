// app/(auth)/email.jsx
// Collect the account email before sending a one-time code. Used both for
// password reset and for email verification during signup.

import React, { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import spacing from "../../constants/spacing";
import useAuthStore from "../../stores/authStore";
import useAppStore from "../../stores/appStore";
import { validateEmail } from "../../utils/validators";
import { Button, Input, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";
import AuthHeader from "../../components/auth/AuthHeader";

export default function EmailScreen() {
  const router = useRouter();
  const startOtp = useAuthStore((s) => s.startOtp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useAppStore((s) => s.showToast);

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleContinue = useCallback(() => {
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    const clean = email.trim().toLowerCase();
    startOtp({ type: "email", value: clean, channel: "email" });
    showToast(`Code sent to ${clean}`, "info");
    router.navigate({ pathname: "/(auth)/email-otp", params: { email: clean } });
  }, [email, startOtp, router, showToast]);

  return (
    <Screen scroll>
      <AuthHeader
        title="What's your email?"
        subtitle="We'll send you a 6-digit code to confirm it's really you."
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
        onSubmitEditing={handleContinue}
      />

      <Button
        title="Send code"
        size="large"
        fullWidth
        loading={isLoading}
        onPress={handleContinue}
        style={{ marginTop: spacing.xl }}
      />

      <Text variant="caption" color="tertiary" align="center" style={{ marginTop: spacing.lg }}>
        Check your spam folder if it doesn't arrive within a minute.
      </Text>
    </Screen>
  );
}
