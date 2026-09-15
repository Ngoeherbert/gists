// components/auth/VerifyCodeScreen.jsx
// Shared "enter the code we sent you" screen. Handles the OTP boxes, resend
// cooldown countdown and the verify call. email-otp / reset-otp / phone-otp are
// thin wrappers that only differ by copy and destination.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import useAuthStore from "../../stores/authStore";
import useAppStore from "../../stores/appStore";
import { validateOtp } from "../../utils/validators";
import { Button, Text } from "../ui";
import Screen from "../common/Screen";
import AuthHeader from "./AuthHeader";
import OTPInput from "./OTPInput";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

export default function VerifyCodeScreen({
  title = "Enter the code",
  subtitle,
  destination,
  buttonTitle = "Verify",
  onVerifiedRoute = "/(auth)/new-password",
  onResend,
}) {
  const router = useRouter();
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);
  const markOtpSent = useAuthStore((s) => s.markOtpSent);
  const showToast = useAppStore((s) => s.showToast);

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const timerRef = useRef(null);

  // Resend cooldown countdown.
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleVerify = useCallback(
    async (value = code) => {
      const message = validateOtp(value, OTP_LENGTH);
      setError(message);
      if (message) return;

      const result = await verifyOtp({ code: value });
      if (result !== null) {
        showToast("Code verified", "success");
        router.replace(onVerifiedRoute);
      } else {
        setError("That code doesn't look right. Try again.");
        setCode("");
      }
    },
    [code, verifyOtp, router, onVerifiedRoute, showToast],
  );

  const handleResend = useCallback(async () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setCode("");
    setError(null);
    await onResend?.();
    markOtpSent(RESEND_SECONDS);
    showToast(`New code sent to ${destination}`, "info");
  }, [secondsLeft, onResend, markOtpSent, destination, showToast]);

  const displayError = error || authError;

  return (
    <Screen scroll>
      <AuthHeader title={title} subtitle={subtitle} />

      <View style={styles.otpWrap}>
        <OTPInput
          length={OTP_LENGTH}
          value={code}
          error={Boolean(displayError)}
          disabled={isLoading}
          onChangeText={(v) => {
            setCode(v);
            if (error) setError(null);
          }}
          onComplete={handleVerify}
        />
      </View>

      {displayError ? (
        <Text
          variant="bodySmall"
          color="error"
          align="center"
          style={styles.error}
        >
          {displayError}
        </Text>
      ) : null}

      <Button
        title={buttonTitle}
        size="large"
        fullWidth
        loading={isLoading}
        disabled={code.length < OTP_LENGTH}
        onPress={() => handleVerify()}
        style={styles.submit}
      />

      <View style={styles.resendRow}>
        <Text variant="bodySmall" color="secondary_text">
          Didn't get the code?{" "}
        </Text>
        {secondsLeft > 0 ? (
          <Text variant="bodySmall" color="tertiary">
            Resend in {secondsLeft}s
          </Text>
        ) : (
          <Pressable onPress={handleResend} hitSlop={spacing.sm}>
            <Text variant="bodySmall" color="primary">
              Resend
            </Text>
          </Pressable>
        )}
      </View>

      <Button
        title="Change destination"
        variant="link"
        size="small"
        fullWidth
        style={styles.change}
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  otpWrap: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  error: {
    marginBottom: spacing.md,
  },
  submit: {
    marginTop: spacing.sm,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  change: {
    marginTop: spacing.sm,
  },
});
