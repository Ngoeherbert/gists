// app/(auth)/login.jsx
// Sign in with email/password. On success the authStore flips to authenticated
// and the splash-style gate in the layout takes the user into (main).

import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../constants/spacing";
import useAuthStore from "../../stores/authStore";
import useAppStore from "../../stores/appStore";
import { validateEmail, validateRequired } from "../../utils/validators";
import { Button, Divider, Input, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";
import AuthHeader from "../../components/auth/AuthHeader";

export default function LoginScreen() {
  const router = useRouter();
  const showToast = useAppStore((s) => s.showToast);

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback(() => {
    const next = {
      email: validateEmail(email),
      password: validateRequired(password, "Password"),
    };
    setErrors(next);
    return !next.email && !next.password;
  }, [email, password]);

  const handleSubmit = useCallback(async () => {
    setTouched({ email: true, password: true });
    if (!validate()) return;

    // No API client is wired yet — the provider below is where it plugs in.
    const user = await login({ identifier: email.trim(), password });
    if (user) {
      showToast(`Welcome back, ${user.name || "friend"}`, "success");
      router.replace("/(main)/feeds");
    }
  }, [validate, login, email, password, router, showToast]);

  const blurField = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  return (
    <Screen scroll>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to continue sharing your gists."
      />

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          clearError();
          if (touched.email) setErrors((e) => ({ ...e, email: validateEmail(v) }));
        }}
        onBlur={blurField("email")}
        error={touched.email ? errors.email : null}
        leftIcon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
      />

      <Input
        label="Password"
        placeholder="Your password"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          clearError();
          if (touched.password) setErrors((e) => ({ ...e, password: validateRequired(v, "Password") }));
        }}
        onBlur={blurField("password")}
        error={touched.password ? errors.password : null}
        leftIcon="lock-closed-outline"
        secureTextEntry
        autoComplete="password"
        returnKeyType="done"
        containerStyle={styles.field}
      />

      <Button
        title="Forgot password?"
        variant="link"
        size="small"
        style={styles.forgot}
        onPress={() => router.push("/(auth)/forgot-password")}
      />

      {authError ? (
        <Text variant="bodySmall" color="error" style={styles.authError}>
          {authError}
        </Text>
      ) : null}

      <Button
        title="Sign in"
        size="large"
        fullWidth
        loading={isLoading}
        onPress={handleSubmit}
        style={styles.submit}
      />

      <Divider label="or" style={styles.divider} />

      <View style={styles.altRow}>
        <Text variant="bodySmall" color="secondary_text">
          Don't have an account?{" "}
        </Text>
        <Button
          title="Sign up"
          variant="link"
          size="small"
          onPress={() => router.push("/(auth)/signup")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.md,
  },
  forgot: {
    alignSelf: "flex-end",
  },
  authError: {
    marginBottom: spacing.sm,
  },
  submit: {
    marginTop: spacing.sm,
  },
  divider: {
    marginVertical: spacing.xl,
  },
  altRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
