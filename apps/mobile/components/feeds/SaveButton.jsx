// apps/mobile/components/feeds/SaveButton.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

export default function SaveButton({ saved = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={7}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons
        name={saved ? "bookmark" : "bookmark-outline"}
        size={22}
        color="#111111"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.55,
  },
});
