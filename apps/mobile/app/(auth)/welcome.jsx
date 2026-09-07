import { View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import OnboardingButton from "../../components/onboarding/OnboardingButton";

const logo = require("../../assets/icons/logo_light.png");

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Welcome to Gists</Text>

        <Text style={styles.description}>
          Connect with your people, share your moments, and start meaningful
          conversations.
        </Text>
      </View>

      <View style={styles.actions}>
        <OnboardingButton
          title="Create Account"
          onPress={() => router.push("/(auth)/signup")}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>

          <Text
            style={styles.loginLink}
            onPress={() => router.push("/(auth)/login")}
          >
            {" "}
            Log in
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 190,
    height: 190,
    marginBottom: 40,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    marginBottom: 16,
  },

  description: {
    maxWidth: 380,
    fontSize: 16,
    lineHeight: 25,
    color: "#666666",
    textAlign: "center",
  },

  actions: {
    width: "100%",
    alignItems: "center",
  },

  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  loginText: {
    fontSize: 14,
    color: "#777777",
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
  },
});
