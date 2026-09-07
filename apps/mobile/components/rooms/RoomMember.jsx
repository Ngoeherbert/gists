import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ChatAvatar from "../chats/ChatAvatar";
import OnlineIndicator from "../chats/OnlineIndicator";

export default function RoomMember({
  member = {},
  onPress,
  onMore,
  showMore = false,
}) {
  const {
    id,
    name = "Gist User",
    username = "gistuser",
    avatar,
    role,
    online = false,
  } = member;

  const content = (
    <>
      <View style={styles.avatarContainer}>
        <ChatAvatar uri={avatar} name={name} size={48} />

        {online && <OnlineIndicator size={12} />}
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          {role === "admin" && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>Admin</Text>
            </View>
          )}

          {role === "moderator" && (
            <View style={styles.moderatorBadge}>
              <Text style={styles.moderatorText}>Mod</Text>
            </View>
          )}
        </View>

        <Text style={styles.username} numberOfLines={1}>
          @{username.replace(/^@/, "")}
        </Text>
      </View>

      {showMore && (
        <Pressable
          onPress={() => onMore?.(member)}
          style={styles.moreButton}
          accessibilityRole="button"
          accessibilityLabel={`Options for ${name}`}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={() => onPress(id || member)}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Open ${name}`}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },

  avatarContainer: {
    position: "relative",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    color: "#000",
    fontSize: 14,
    fontWeight: "750",
    maxWidth: "70%",
  },

  username: {
    color: "#777",
    fontSize: 12,
    marginTop: 3,
  },

  adminBadge: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 7,
  },

  adminText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },

  moderatorBadge: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 7,
  },

  moderatorText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "800",
  },

  moreButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.65,
  },
});
