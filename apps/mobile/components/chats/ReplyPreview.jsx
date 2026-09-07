// apps/mobile/components/chats/ReplyPreview.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ReplyPreview({ message, onCancel }) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons name="return-down-forward" size={18} color="#111111" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Replying to {message.senderName || "message"}
        </Text>

        <Text numberOfLines={1} style={styles.message}>
          {message.text || message.message || "Media message"}
        </Text>
      </View>

      {onCancel && (
        <Pressable onPress={onCancel} hitSlop={8} style={styles.close}>
          <Ionicons name="close" size={20} color="#555555" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    marginHorizontal: 12,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
  },
  icon: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginLeft: 4,
  },
  title: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "700",
  },
  message: {
    marginTop: 3,
    color: "#777777",
    fontSize: 12,
  },
  close: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
});
