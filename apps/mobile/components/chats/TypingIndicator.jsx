// apps/mobile/components/chats/TypingIndicator.jsx
import { StyleSheet, Text, View } from "react-native";

export default function TypingIndicator({ name = "Someone" }) {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <Text style={styles.text}>{name} is typing</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 17,
    borderBottomLeftRadius: 5,
    backgroundColor: "#F0F0F0",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#777777",
  },
  text: {
    marginTop: 4,
    color: "#999999",
    fontSize: 10,
  },
});
