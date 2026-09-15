// app/(auth)/email-otp.jsx
// Verify the email address during signup. Sends the user to profile setup on success.

import React from "react";
import { useLocalSearchParams } from "expo-router";
import VerifyCodeScreen from "../../components/auth/VerifyCodeScreen";

export default function EmailOtpScreen() {
  const { email } = useLocalSearchParams();

  return (
    <VerifyCodeScreen
      title="Verify your email"
      subtitle={`Enter the 6-digit code we sent to ${email || "your email"}.`}
      destination={email || "your email"}
      buttonTitle="Verify email"
      onVerifiedRoute="/(auth)/complete-profile"
    />
  );
}
