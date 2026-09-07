// apps/mobile/components/feeds/CommentButton.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

export default function CommentButton({ count = 0, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Ionicons name="chatbubble-outline" size={22} color="#111111" />

      {count > 0 && (
        <Text style={styles.count}>{count > 999 ? "999+" : count}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 42,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    marginLeft: 5,
    color: "#222222",
    fontSize: 12,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.55,
  },
});
