// app/(auth)/signup.jsx
// Create account: name, username, email, password + confirm. Validates locally
// then defers to authStore.register.

import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";
import config from "../../constants/config";
import spacing from "../../constants/spacing";
import typography from "../../constants/typography";
import useAuthStore from "../../stores/authStore";
import useAppStore from "../../stores/appStore";
import {
  passwordStrength,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
} from "../../utils/validators";
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

export default function SignupScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const showToast = useAppStore((s) => s.showToast);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const strength = useMemo(() => passwordStrength(form.password), [form.password]);
  const strengthMeta = STRENGTH_META[strength] || STRENGTH_META[0];

  const setField = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    clearError();
    if (touched[key]) {
      const message = validateField(key, value, { ...form, [key]: value });
      setErrors((e) => ({ ...e, [key]: message }));
    }
  };

  const blurField = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateField(key, form[key], form) }));
  };

  const handleSubmit = useCallback(async () => {
    const fields = ["name", "username", "email", "password", "confirm"];
    const nextErrors = {};
    fields.forEach((key) => {
      nextErrors[key] = validateField(key, form[key], form);
    });

    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const user = await register({
      payload: {
        name: form.name.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim(),
        password: form.password,
      },
    });

    if (user) {
      showToast("Account created — let's finish your profile", "success");
      router.replace("/(auth)/complete-profile");
    }
  }, [form, register, router, showToast]);

  return (
    <Screen scroll>
      <AuthHeader
        title="Create your account"
        subtitle="A few details and you're in. It only takes a minute."
      />

      <Input
        label="Full name"
        placeholder="Ada Lovelace"
        value={form.name}
        onChangeText={setField("name")}
        onBlur={blurField("name")}
        error={touched.name ? errors.name : null}
        leftIcon="person-outline"
        autoComplete="name"
        maxLength={60}
      />

      <Input
        label="Username"
        placeholder="ada.lovelace"
        value={form.username}
        onChangeText={setField("username")}
        onBlur={blurField("username")}
        error={touched.username ? errors.username : null}
        helperText={`Your profile will be gists.app/${form.username || "username"}`}
        leftIcon="at-outline"
        autoCapitalize="none"
        maxLength={24}
        containerStyle={styles.field}
      />

      <Input
        label="Email"
        placeholder="you@example.com"
        value={form.email}
        onChangeText={setField("email")}
        onBlur={blurField("email")}
        error={touched.email ? errors.email : null}
        leftIcon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        containerStyle={styles.field}
      />

      <Input
        label="Password"
        placeholder="At least 8 characters"
        value={form.password}
        onChangeText={setField("password")}
        onBlur={blurField("password")}
        error={touched.password ? errors.password : null}
        leftIcon="lock-closed-outline"
        secureTextEntry
        autoComplete="new-password"
        containerStyle={styles.field}
      />

      {form.password ? (
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
        label="Confirm password"
        placeholder="Repeat your password"
        value={form.confirm}
        onChangeText={setField("confirm")}
        onBlur={blurField("confirm")}
        error={touched.confirm ? errors.confirm : null}
        leftIcon="lock-closed-outline"
        secureTextEntry
        autoComplete="new-password"
        containerStyle={styles.field}
      />

      {authError ? (
        <Text variant="bodySmall" color="error" style={styles.authError}>
          {authError}
        </Text>
      ) : null}

      <Button
        title="Create account"
        size="large"
        fullWidth
        loading={isLoading}
        onPress={handleSubmit}
        style={styles.submit}
      />

      <View style={styles.altRow}>
        <Text variant="bodySmall" color="secondary_text">
          Already have an account?{" "}
        </Text>
        <Button
          title="Sign in"
          variant="link"
          size="small"
          onPress={() => router.replace("/(auth)/login")}
        />
      </View>
    </Screen>
  );
}

// Single source of truth for per-field validation used by both blur + submit.
function validateField(key, value, form) {
  switch (key) {
    case "name":
      return validateName(value);
    case "username":
      return validateUsername(value);
    case "email":
      return validateEmail(value);
    case "password":
      return validatePassword(value);
    case "confirm":
      return validatePasswordConfirm(form.password, value);
    default:
      return null;
  }
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
  authError: {
    marginTop: spacing.md,
  },
  submit: {
    marginTop: spacing.xl,
  },
  altRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
});
