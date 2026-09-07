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
import { Ionicons } from "@expo/vector-icons";

const logo = require("../../assets/icons/logo_light.png");

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    router.push("/(auth)/reset-otp");
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
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>

          {/* Logo */}
          <View style={styles.logoView}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>Forgot password?</Text>

            <Text style={styles.subtitle}>
              Enter the email address or phone number linked to your Gists
              account. We'll send you a code to reset your password.
            </Text>

            {/* Identifier */}
            <Text style={styles.label}>Email or phone number</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email or phone number"
              placeholderTextColor="#999999"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            {/* Send Code */}
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.buttonText}>Send Code</Text>
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
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
    position: "relative",
  },

  /* Back Button */
  backButton: {
    position: "absolute",
    top: 40,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  /* Logo */
  logoView: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    width: 90,
    height: 90,
  },

  /* Main Content */
  mainContent: {
    width: "100%",
    alignItems: "center",
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
    marginBottom: 24,
  },

  /* Send Code */
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
});
