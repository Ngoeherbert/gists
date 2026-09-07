import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Loader({
  size = "small",
  fullScreen = false,
  color = "#111111",
  style,
}) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
