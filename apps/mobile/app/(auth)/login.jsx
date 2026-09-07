/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

const logo = require("../../assets/icons/logo_light.png");

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Authentication will be connected to the server later.
    router.replace("/(main)/feeds");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoView}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>Welcome back</Text>

            <Text style={styles.subtitle}>
              Log in to continue to your Gists.
            </Text>

            {/* Identifier */}
            <Text style={styles.label}>Email or phone number</Text>

            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Email or phone number"
              placeholderTextColor="#999999"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#999999"
              secureTextEntry
              style={styles.input}
            />

            {/* Forgot Password */}
            <Pressable
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.forgotContainer}
            >
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>

            {/* Login */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.or}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google */}
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialText}>Continue with Google</Text>
            </Pressable>

            {/* Apple */}
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialText}>Continue with Apple</Text>
            </Pressable>

            {/* Sign Up */}
            <View style={styles.signupRow}>
              <Text style={styles.muted}>Don't have an account?</Text>

              <Pressable
                onPress={() => router.push("/(auth)/signup")}
                hitSlop={8}
              >
                <Text style={styles.link}> Sign Up</Text>
              </Pressable>
            </View>
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
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  /* Logo */
  logoView: {
    width: "100%",
    alignItems: "center",
    paddingTop: 100,
  },

  logo: {
    width: 90,
    height: 90,
  },

  /* Main Content */
  mainContent: {
    width: "100%",
    alignItems: "center",
    marginTop: 35,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#777777",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111111",
    marginBottom: 18,
  },

  /* Forgot Password */
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 24,
  },

  forgot: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Login Button */
  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  /* Divider */
  dividerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },

  or: {
    marginHorizontal: 14,
    color: "#999999",
    fontSize: 12,
    fontWeight: "600",
  },

  /* Social Buttons */
  socialButton: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  socialText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Sign Up */
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  muted: {
    color: "#777777",
    fontSize: 14,
  },

  link: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },
});
