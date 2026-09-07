// apps/mobile/components/feeds/RepostButton.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

export default function RepostButton({ reposted = false, count = 0, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Ionicons name="repeat-outline" size={23} color="#111111" />

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
