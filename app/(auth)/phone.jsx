// app/(auth)/phone.jsx
// Alternate signup path: collect a phone number and send an SMS code.

import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../constants/spacing";
import useAuthStore from "../../stores/authStore";
import useAppStore from "../../stores/appStore";
import { validatePhone } from "../../utils/validators";
import { Button, Input, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";
import AuthHeader from "../../components/auth/AuthHeader";

export default function PhoneScreen() {
  const router = useRouter();
  const startOtp = useAuthStore((s) => s.startOtp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useAppStore((s) => s.showToast);

  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  const handleContinue = useCallback(() => {
    const message = validatePhone(phone);
    setError(message);
    if (message) return;

    const clean = phone.replace(/[\s-]/g, "");
    startOtp({ type: "phone", value: clean, channel: "sms" });
    showToast(`Code sent to ${clean}`, "info");
    router.push({ pathname: "/(auth)/phone-otp", params: { phone: clean } });
  }, [phone, startOtp, router, showToast]);

  return (
    <Screen scroll>
      <AuthHeader
        title="What's your number?"
        subtitle="We'll text you a 6-digit code to verify it's really you."
      />

      <Input
        label="Phone number"
        placeholder="+1 555 000 1234"
        value={phone}
        onChangeText={(v) => {
          setPhone(v);
          if (error) setError(validatePhone(v));
        }}
        error={error}
        leftIcon="call-outline"
        keyboardType="phone-pad"
        autoComplete="tel"
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
        style={styles.submit}
      />

      <Text variant="caption" color="tertiary" align="center" style={styles.note}>
        Standard message rates may apply.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  submit: {
    marginTop: spacing.xl,
  },
  note: {
    marginTop: spacing.lg,
  },
});
