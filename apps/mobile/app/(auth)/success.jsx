/* eslint-disable react/no-unescaped-entities */

import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";


export default function SuccessScreen() {
  const handleContinue = () => {
    router.replace("/(main)/feeds");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>You're all set!</Text>

        <Text style={styles.description}>
          Your Gists account has been created successfully. Welcome to Gists!
        </Text>

        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Start Using Gists</Text>
        </Pressable>
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
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },

  check: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "700",
  },

  title: {
    width: "100%",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    letterSpacing: -0.7,
    marginBottom: 12,
  },

  description: {
    width: "100%",
    maxWidth: 380,
    fontSize: 15,
    lineHeight: 24,
    color: "#777777",
    textAlign: "center",
    marginBottom: 34,
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
});