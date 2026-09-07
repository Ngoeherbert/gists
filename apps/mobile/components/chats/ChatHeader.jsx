// apps/mobile/components/chats/ChatHeader.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ChatAvatar from "./ChatAvatar";

export default function ChatHeader({
  name,
  avatar,
  online = false,
  subtitle,
  isGroup = false,
  onBack,
  onInfo,
  onCall,
  onVideo,
}) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.iconButton}>
        <Ionicons name="arrow-back" size={24} color="#111111" />
      </Pressable>

      <ChatAvatar uri={avatar} name={name} size={42} online={online} />

      <View style={styles.identity}>
        <Text numberOfLines={1} style={styles.name}>
          {name || "Chat"}
        </Text>

        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle || (online ? "Online" : isGroup ? "Group chat" : "Offline")}
        </Text>
      </View>

      <View style={styles.actions}>
        {!isGroup && onCall && (
          <Pressable onPress={onCall} hitSlop={8} style={styles.action}>
            <Ionicons name="call-outline" size={21} color="#111111" />
          </Pressable>
        )}

        {!isGroup && onVideo && (
          <Pressable onPress={onVideo} hitSlop={8} style={styles.action}>
            <Ionicons name="videocam-outline" size={23} color="#111111" />
          </Pressable>
        )}

        {onInfo && (
          <Pressable onPress={onInfo} hitSlop={8} style={styles.action}>
            <Ionicons name="ellipsis-horizontal" size={23} color="#111111" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  iconButton: {
    width: 38,
    height: 42,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  identity: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  name: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 3,
    color: "#777777",
    fontSize: 12,
  },
  actions: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  action: {
    width: 38,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
});
