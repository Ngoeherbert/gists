// apps/mobile/components/create/CameraButton.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

export default function CameraButton({
  onPress,
  label = "Camera",
  size = 52,
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="camera-outline" size={24} color="#FFFFFF" />

      {label ? (
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
  label: {
    position: "absolute",
    top: "100%",
    marginTop: 5,
    color: "#222222",
    fontSize: 11,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});