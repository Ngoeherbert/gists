// apps/mobile/components/chats/MessageBubble.jsx
import { StyleSheet, Text, View } from "react-native";

export default function MessageBubble({
  message,
  isMine = false,
  timestamp,
  status,
  reply,
  children,
}) {
  return (
    <View
      style={[
        styles.wrapper,
        isMine ? styles.mineWrapper : styles.theirWrapper,
      ]}
    >
      <View
        style={[styles.bubble, isMine ? styles.mineBubble : styles.theirBubble]}
      >
        {reply && (
          <View
            style={[
              styles.reply,
              isMine ? styles.mineReply : styles.theirReply,
            ]}
          >
            <Text
              numberOfLines={2}
              style={[styles.replyText, isMine && styles.mineReplyText]}
            >
              {reply.text || "Replied message"}
            </Text>
          </View>
        )}

        {children || (
          <Text
            style={[
              styles.message,
              isMine ? styles.mineText : styles.theirText,
            ]}
          >
            {message}
          </Text>
        )}

        {(timestamp || status) && (
          <View style={styles.meta}>
            {timestamp && (
              <Text style={[styles.timestamp, isMine && styles.mineMeta]}>
                {timestamp}
              </Text>
            )}

            {status && isMine && <Text style={styles.status}>{status}</Text>}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 7,
  },
  mineWrapper: {
    alignItems: "flex-end",
  },
  theirWrapper: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    minWidth: 50,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 7,
    borderRadius: 19,
  },
  mineBubble: {
    backgroundColor: "#111111",
    borderBottomRightRadius: 5,
  },
  theirBubble: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
  },
  message: {
    fontSize: 15,
    lineHeight: 21,
  },
  mineText: {
    color: "#FFFFFF",
  },
  theirText: {
    color: "#111111",
  },
  meta: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  timestamp: {
    color: "#888888",
    fontSize: 10,
  },
  mineMeta: {
    color: "#CFCFCF",
  },
  status: {
    color: "#CFCFCF",
    fontSize: 10,
    fontWeight: "600",
  },
  reply: {
    marginBottom: 7,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderLeftWidth: 3,
    borderRadius: 5,
    backgroundColor: "#E1E1E1",
  },
  theirReply: {
    borderLeftColor: "#111111",
  },
  mineReply: {
    borderLeftColor: "#FFFFFF",
    backgroundColor: "#292929",
  },
  replyText: {
    color: "#555555",
    fontSize: 11,
    lineHeight: 16,
  },
  mineReplyText: {
    color: "#E8E8E8",
  },
});
