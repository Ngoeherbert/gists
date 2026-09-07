import { useState } from "react";
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

export default function CreatePasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValid = password.length >= 8;

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleContinue = () => {
    if (!passwordValid || !passwordsMatch) return;

    router.replace("/(auth)/success");
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
          {/* Logo */}
          <View style={styles.logoView}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>Create a password</Text>

            <Text style={styles.subtitle}>
              Create a strong password to keep your Gists account secure.
            </Text>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>

              <View
                style={[
                  styles.inputWrapper,
                  password.length > 0 &&
                    passwordValid &&
                    styles.inputWrapperValid,
                ]}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#A1A1AA"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  style={styles.input}
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.visibilityButton}
                  hitSlop={8}
                >
                  <Text style={styles.visibilityText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.requirement}>
                Password must contain at least 8 characters.
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>

              <View
                style={[
                  styles.inputWrapper,
                  confirmPassword.length > 0 &&
                    passwordsMatch &&
                    styles.inputWrapperValid,
                  confirmPassword.length > 0 &&
                    !passwordsMatch &&
                    styles.inputWrapperError,
                ]}
              >
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#A1A1AA"
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  style={styles.input}
                />

                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.visibilityButton}
                  hitSlop={8}
                >
                  <Text style={styles.visibilityText}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              {confirmPassword.length > 0 && !passwordsMatch && (
                <Text style={styles.error}>Passwords do not match.</Text>
              )}
            </View>

            {/* Continue */}
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
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
    justifyContent: "center",
  },

  /* Logo */
  logoView: {
    width: "100%",
    alignItems: "center",
    marginBottom: 26,
  },

  logo: {
    width: 90,
    height: 90,
  },

  /* Main */
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

  /* Fields */
  field: {
    width: "100%",
    marginBottom: 20,
  },

  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
    textAlign: "left",
    marginBottom: 9,
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
    paddingLeft: 18,
    paddingRight: 12,
  },

  inputWrapperValid: {
    borderColor: "#111111",
  },

  inputWrapperError: {
    borderColor: "#D33",
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    paddingVertical: 0,
    textAlign: "left",
  },

  visibilityButton: {
    height: 40,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  visibilityText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "600",
  },

  requirement: {
    width: "100%",
    fontSize: 12.5,
    lineHeight: 18,
    color: "#888888",
    textAlign: "left",
    marginTop: 8,
  },

  error: {
    width: "100%",
    fontSize: 12.5,
    lineHeight: 18,
    color: "#D33",
    textAlign: "left",
    marginTop: 8,
  },

  /* Button */
  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 18,
    marginTop: 4,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

});
