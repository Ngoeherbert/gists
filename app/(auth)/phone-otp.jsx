// app/(auth)/phone-otp.jsx
// Verify a phone number. Same flow as email verification, different destination.

import React from "react";
import { useLocalSearchParams } from "expo-router";
import VerifyCodeScreen from "../../components/auth/VerifyCodeScreen";

export default function PhoneOtpScreen() {
  const { phone } = useLocalSearchParams();

  return (
    <VerifyCodeScreen
      title="Verify your number"
      subtitle={`Enter the 6-digit code we texted to ${phone || "your phone"}.`}
      destination={phone || "your phone"}
      buttonTitle="Verify number"
      onVerifiedRoute="/(auth)/complete-profile"
    />
  );
}
