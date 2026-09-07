import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ChatAvatar from "../chats/ChatAvatar";

export default function RoomHeader({ room = {}, onBack, onInfo, onMore }) {
  const { name = "Gist Room", avatar, memberCount, onlineCount } = room;

  const subtitle =
    onlineCount !== undefined
      ? `${onlineCount} online`
      : memberCount !== undefined
        ? `${memberCount} members`
        : "Gist Room";

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>

      <Pressable
        onPress={onInfo}
        style={styles.center}
        accessibilityRole="button"
        accessibilityLabel={`Open ${name} information`}
      >
        <ChatAvatar uri={avatar} name={name} size={42} />

        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onMore}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Room options"
      >
        <Ionicons name="ellipsis-horizontal" size={23} color="#000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },

  textContainer: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    color: "#000",
    fontSize: 15,
    fontWeight: "800",
  },

  subtitle: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },
});
