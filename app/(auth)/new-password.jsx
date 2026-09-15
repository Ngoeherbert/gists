// app/(auth)/new-password.jsx
// Set a new password after the reset code has been verified.

import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";
import spacing from "../../constants/spacing";
import typography from "../../constants/typography";
import useAppStore from "../../stores/appStore";
import useAuthStore from "../../stores/authStore";
import { passwordStrength, validatePassword, validatePasswordConfirm } from "../../utils/validators";
import { Button, Input, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";
import AuthHeader from "../../components/auth/AuthHeader";

const STRENGTH_META = [
  { label: "Too weak", color: colors.error },
  { label: "Weak", color: colors.error },
  { label: "Fair", color: colors.warning },
  { label: "Good", color: colors.info },
  { label: "Strong", color: colors.success },
];

export default function NewPasswordScreen() {
  const router = useRouter();
  const showToast = useAppStore((s) => s.showToast);
  const updateUser = useAuthStore((s) => s.updateUser);
  const clearPendingAuth = useAuthStore((s) => s.clearPendingAuth);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const strengthMeta = STRENGTH_META[strength] || STRENGTH_META[0];

  const handleSubmit = useCallback(async () => {
    const next = {
      password: validatePassword(password),
      confirm: validatePasswordConfirm(password, confirm),
    };
    setTouched({ password: true, confirm: true });
    setErrors(next);
    if (next.password || next.confirm) return;

    setIsSaving(true);
    // API call would go here; we simulate the round-trip.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);

    updateUser({ passwordUpdatedAt: Date.now() });
    clearPendingAuth();
    showToast("Password updated — please sign in", "success");
    router.replace("/(auth)/success");
  }, [password, confirm, updateUser, clearPendingAuth, router, showToast]);

  return (
    <Screen scroll>
      <AuthHeader
        title="Set a new password"
        subtitle="Choose something strong you haven't used before."
      />

      <Input
        label="New password"
        placeholder="At least 8 characters"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          if (touched.password) {
            setErrors((e) => ({ ...e, password: validatePassword(v) }));
          }
        }}
        onBlur={() => {
          setTouched((t) => ({ ...t, password: true }));
          setErrors((e) => ({ ...e, password: validatePassword(password) }));
        }}
        error={touched.password ? errors.password : null}
        leftIcon="lock-closed-outline"
        secureTextEntry
        autoComplete="new-password"
        autoFocus
      />

      {password ? (
        <View style={styles.strengthRow}>
          <View style={styles.meterTrack}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.meterSegment,
                  { backgroundColor: i < strength ? strengthMeta.color : colors.border },
                ]}
              />
            ))}
          </View>
          <Text variant="caption" style={[styles.strengthLabel, { color: strengthMeta.color }]}>
            {strengthMeta.label}
          </Text>
        </View>
      ) : null}

      <Input
        label="Confirm new password"
        placeholder="Repeat your password"
        value={confirm}
        onChangeText={(v) => {
          setConfirm(v);
          if (touched.confirm) {
            setErrors((e) => ({ ...e, confirm: validatePasswordConfirm(password, v) }));
          }
        }}
        onBlur={() => {
          setTouched((t) => ({ ...t, confirm: true }));
          setErrors((e) => ({ ...e, confirm: validatePasswordConfirm(password, confirm) }));
        }}
        error={touched.confirm ? errors.confirm : null}
        leftIcon="lock-closed-outline"
        secureTextEntry
        autoComplete="new-password"
        containerStyle={styles.field}
      />

      <Button
        title="Update password"
        size="large"
        fullWidth
        loading={isSaving}
        onPress={handleSubmit}
        style={styles.submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.md,
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  meterTrack: {
    flex: 1,
    flexDirection: "row",
    marginRight: spacing.sm,
  },
  meterSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: spacing.xxs,
  },
  strengthLabel: {
    fontSize: typography.size.xs,
    fontWeight: "600",
  },
  submit: {
    marginTop: spacing.xl,
  },
});
