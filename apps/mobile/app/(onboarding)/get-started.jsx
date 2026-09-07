import { View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import OnboardingButton from "../../components/onboarding/OnboardingButton";

const logo = require("../../assets/icons/logo_light.png");

export default function GetStartedScreen() {
  const handleGetStarted = () => {
    router.replace("/(auth)/welcome");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Welcome to Gists</Text>

        <Text style={styles.description}>
          Your people. Your conversations. Your world. Start your Gist journey
          today.
        </Text>
      </View>

      <View style={styles.bottom}>
        <OnboardingButton title="Get Started" onPress={handleGetStarted} />

        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
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
    paddingBottom: 32,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 48,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    marginBottom: 16,
  },

  description: {
    fontSize: 17,
    lineHeight: 26,
    color: "#666666",
    textAlign: "center",
    maxWidth: 380,
  },

  bottom: {
    width: "100%",
    alignItems: "center",
    gap: 18,
  },

  footer: {
    maxWidth: 360,
    fontSize: 12,
    lineHeight: 18,
    color: "#999999",
    textAlign: "center",
  },
});
