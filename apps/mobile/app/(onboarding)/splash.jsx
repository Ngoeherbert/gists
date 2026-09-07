import { View, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

const logo = require("../../assets/icons/logo_light.png");

export default function SplashScreen() {
  const handleImageLoad = () => {
    router.replace("/(onboarding)/screen-1");
  };

  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
        onLoad={handleImageLoad}
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
