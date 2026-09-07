import { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

const logo = require("../../assets/icons/logo_light.png");

export default function EmailScreen() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);

  const isValidEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const handleEmailChange = (value) => {
    setEmail(value.trimStart());
  };

  const handleContinue = () => {
    if (!isValidEmail) return;

    router.push({
      pathname: "/(auth)/email-otp",
      params: {
        email: email.trim(),
      },
    });
  };

  const handlePhone = () => {
    router.push("/(auth)/phone");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.content}>
          <View style={styles.logoView}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title}>Add your email</Text>

            <Text style={styles.subtitle}>
              Add an email address to secure your Gists account and make signing
              in easier.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Email address</Text>

              <View
                style={[
                  styles.inputWrapper,
                  focused && styles.inputWrapperFocused,
                  isValidEmail && styles.inputWrapperValid,
                ]}
              >
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="you@example.com"
                  placeholderTextColor="#A1A1AA"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  style={styles.input}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />

                {isValidEmail && (
                  <View style={styles.validIcon}>
                    <Text style={styles.validIconText}>✓</Text>
                  </View>
                )}
              </View>

              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>Send verification code</Text>

              </Pressable>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />

              <Text style={styles.or}>OR</Text>

              <View style={styles.divider} />
            </View>

            <Pressable
              onPress={handlePhone}
              style={({ pressed }) => [
                styles.alternativeButton,
                pressed && styles.alternativePressed,
              ]}
            >
              <View style={styles.phoneIconContainer}>
                <Text style={styles.phoneIcon}>☎</Text>
              </View>

              <Text style={styles.alternativeText}>Continue with phone</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{" "}
              <Text style={styles.footerLink}>Terms</Text> and{" "}
              <Text style={styles.footerLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  content: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },

  logoView: {
    width: "100%",
    alignItems: "center",
    marginBottom: 26,
  },

  logo: {
    width: 90,
    height: 90,
  },

  mainContent: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    width: "100%",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    letterSpacing: -0.6,
  },

  subtitle: {
    width: "100%",
    maxWidth: 400,
    fontSize: 15,
    lineHeight: 23,
    color: "#777777",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 8,
  },

  inputWrapper: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  inputWrapperFocused: {
    borderColor: "#111111",
  },

  inputWrapperValid: {
    borderColor: "#111111",
  },

  input: {
    flex: 1,
    height: "100%",
    padding: 0,
    fontSize: 16,
    color: "#111111",
  },

  validIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  validIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 18,
    marginTop: 24,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  dividerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },

  or: {
    marginHorizontal: 12,
    color: "#A1A1AA",
    fontSize: 12,
    fontWeight: "600",
  },

  alternativeButton: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  alternativePressed: {
    opacity: 0.7,
  },

  phoneIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  phoneIcon: {
    fontSize: 17,
    color: "#111111",
  },

  alternativeText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    width: "100%",
    marginTop: 28,
    alignItems: "center",
  },

  footerText: {
    maxWidth: 360,
    color: "#A1A1AA",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  footerLink: {
    color: "#555555",
    fontWeight: "600",
  },
});
