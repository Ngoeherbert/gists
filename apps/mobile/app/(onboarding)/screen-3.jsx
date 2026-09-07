import { View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import OnboardingDots from "../../components/onboarding/OnboardingDots";
import OnboardingButton from "../../components/onboarding/OnboardingButton";

const logo = require("../../assets/icons/logo_light.png");

export default function OnboardingScreen3() {
  const handleNext = () => {
    router.push("/(onboarding)/get-started");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Everything in One Place</Text>

          <Text style={styles.description}>
            Chat with your Gisties, share posts and reels, discover new content,
            and keep your social world together with Gists.
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <OnboardingDots activeIndex={2} total={3} />

        <OnboardingButton title="Next" onPress={handleNext} />
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
    width: 180,
    height: 180,
    marginBottom: 48,
  },

  textContainer: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    marginBottom: 16,
  },

  description: {
    fontSize: 16,
    lineHeight: 25,
    color: "#666666",
    textAlign: "center",
    maxWidth: 380,
  },

  bottom: {
    width: "100%",
    alignItems: "center",
    gap: 24,
  },
});
