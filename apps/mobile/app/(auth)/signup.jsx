/* eslint-disable react/no-unescaped-entities */
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

const logo = require("../../assets/icons/logo_light.png");

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoView}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Create your account</Text>

          <Text style={styles.subtitle}>
            Choose how you'd like to register with Gists.
          </Text>

          {/* Phone */}
          <Pressable
            onPress={() => router.push("/(auth)/phone")}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Register with Phone</Text>
          </Pressable>

          {/* Email */}
          <Pressable
            onPress={() => router.push("/(auth)/email")}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Register with Email</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.or}>OR</Text>

            <View style={styles.divider} />
          </View>

          {/* Google */}
          <Pressable style={styles.socialButton}>
            <View style={styles.socialIcon}>
              <Text style={styles.googleIcon}>G</Text>
            </View>

            <Text style={styles.socialText}>Continue with Google</Text>
          </Pressable>

          {/* Apple */}
          <Pressable style={styles.socialButton}>
            <View style={styles.socialIcon}>
              <Text style={styles.appleIcon}>●</Text>
            </View>

            <Text style={styles.socialText}>Continue with Apple</Text>
          </Pressable>
        </View>

        {/* Already have an account */}
        <View style={styles.accountView}>
          <View style={styles.loginRow}>
            <Text style={styles.muted}>Already have an account?</Text>

            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              hitSlop={8}
            >
              <Text style={styles.link}> Log In</Text>
            </Pressable>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsView}>
          <Text style={styles.terms}>
            By continuing, you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingBottom: 28,
  },

  /* Logo */
  logoView: {
    width: "100%",
    alignItems: "center",
    paddingTop: 130,
  },

  logo: {
    width: 90,
    height: 90,
  },

  /* Main signup section */
  mainContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 32,
  },

  /* Primary button */
  primaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  /* Secondary button */
  secondaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#111111",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.8,
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

  /* Social buttons */
  socialButton: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 12,
  },

  socialIcon: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },

  appleIcon: {
    fontSize: 14,
    color: "#111111",
  },

  socialText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Account section */
  accountView: {
    width: "100%",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 18,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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

  /* Terms section */
  termsView: {
    width: "100%",
    alignItems: "center",
  },

  terms: {
    textAlign: "center",
    color: "#999999",
    fontSize: 11,
    lineHeight: 17,
    paddingHorizontal: 10,
  },

  termsLink: {
    color: "#555555",
    fontWeight: "600",
  },
});
