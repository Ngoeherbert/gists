// app/(auth)/reset-otp.jsx
// Verify the code sent during password reset, then continue to the new password.

import React from "react";
import { useLocalSearchParams } from "expo-router";
import VerifyCodeScreen from "../../components/auth/VerifyCodeScreen";

export default function ResetOtpScreen() {
  const { email } = useLocalSearchParams();

  return (
    <VerifyCodeScreen
      title="Check your inbox"
      subtitle={`We sent a reset code to ${email || "your email"}.`}
      destination={email || "your email"}
      buttonTitle="Continue"
      onVerifiedRoute="/(auth)/new-password"
    />
  );
}
