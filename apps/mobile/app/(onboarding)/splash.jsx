import { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import {useAuthStore} from "../../stores/authStore";

const logo = require("../../assets/icons/logo_light.png");

export default function SplashScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(main)/feeds");
      } else {
        router.replace("/(onboarding)/screen-1");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 180,
    height: 180,
  },
});
