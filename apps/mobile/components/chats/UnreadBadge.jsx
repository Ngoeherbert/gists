// apps/mobile/components/chats/UnreadBadge.jsx
import { StyleSheet, Text, View } from "react-native";

export default function UnreadBadge({ count = 0, max = 99, style }) {
  if (!count || count < 1) return null;

  const displayCount = count > max ? `${max}+` : String(count);

  return (
    <View style={[styles.badge, displayCount.length > 2 && styles.wide, style]}>
      <Text style={styles.text}>{displayCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 21,
    height: 21,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
  wide: {
    minWidth: 28,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
