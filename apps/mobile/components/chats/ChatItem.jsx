// apps/mobile/components/chats/ChatItem.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ChatAvatar from "./ChatAvatar";
import UnreadBadge from "./UnreadBadge";

export default function ChatItem({
  id,
  name,
  avatar,
  message,
  timestamp,
  unreadCount = 0,
  online = false,
  muted = false,
  pinned = false,
  typing = false,
  isGroup = false,
  onPress,
  onLongPress,
}) {
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      onLongPress={() => onLongPress?.(id)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <ChatAvatar uri={avatar} name={name} size={54} online={online} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            numberOfLines={1}
            style={[styles.name, unreadCount > 0 && styles.unreadName]}
          >
            {name || "Unknown"}
          </Text>

          {timestamp ? (
            <Text
              style={[
                styles.timestamp,
                unreadCount > 0 && styles.unreadTimestamp,
              ]}
            >
              {timestamp}
            </Text>
          ) : null}
        </View>

        <View style={styles.bottomRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.message,
              unreadCount > 0 && styles.unreadMessage,
              typing && styles.typing,
            ]}
          >
            {typing ? "typing…" : message || "No messages yet"}
          </Text>

          <View style={styles.meta}>
            {pinned && (
              <Ionicons
                name="pin"
                size={14}
                color="#777777"
                style={styles.metaIcon}
              />
            )}

            {muted && (
              <Ionicons
                name="notifications-off"
                size={14}
                color="#777777"
                style={styles.metaIcon}
              />
            )}

            <UnreadBadge count={unreadCount} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 78,
    paddingHorizontal: 18,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  pressed: {
    opacity: 0.65,
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginLeft: 13,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  name: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },
  unreadName: {
    fontWeight: "800",
  },
  timestamp: {
    color: "#8A8A8A",
    fontSize: 11,
  },
  unreadTimestamp: {
    color: "#111111",
    fontWeight: "700",
  },
  bottomRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  message: {
    flex: 1,
    color: "#777777",
    fontSize: 13,
  },
  unreadMessage: {
    color: "#333333",
    fontWeight: "600",
  },
  typing: {
    color: "#111111",
    fontWeight: "600",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    marginLeft: 6,
  },
});
