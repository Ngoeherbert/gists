import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import ChatAvatar from "../chats/ChatAvatar";

export default function RoomMessage({
  message = {},
  isMine = false,
  onPress,
  onLongPress,
  showAvatar = true,
  showSender = true,
}) {
  const {
    text = "",
    sender,
    senderName = "Gist User",
    senderAvatar,
    timestamp,
    mediaUrl,
  } = message;

  const name = sender?.name || senderName;
  const avatar = sender?.avatar || senderAvatar;

  const content = (
    <>
      {!isMine && showAvatar && (
        <ChatAvatar uri={avatar} name={name} size={32} />
      )}

      <View
        style={[
          styles.content,
          isMine ? styles.mineContent : styles.otherContent,
        ]}
      >
        {!isMine && showSender && <Text style={styles.senderName}>{name}</Text>}

        {mediaUrl ? (
          <Image source={{ uri: mediaUrl }} style={styles.media} />
        ) : null}

        {text ? (
          <Text style={[styles.message, isMine && styles.mineMessage]}>
            {text}
          </Text>
        ) : null}

        {timestamp ? (
          <Text style={[styles.timestamp, isMine && styles.mineTimestamp]}>
            {timestamp}
          </Text>
        ) : null}
      </View>
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.row,
        isMine ? styles.mineRow : styles.otherRow,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "flex-end",
  },

  mineRow: {
    justifyContent: "flex-end",
  },

  otherRow: {
    justifyContent: "flex-start",
  },

  content: {
    maxWidth: "76%",
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  mineContent: {
    backgroundColor: "#000",
    borderBottomRightRadius: 5,
    marginLeft: 8,
  },

  otherContent: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
    marginLeft: 8,
  },

  senderName: {
    color: "#555",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 3,
  },

  message: {
    color: "#111",
    fontSize: 14,
    lineHeight: 20,
  },

  mineMessage: {
    color: "#fff",
  },

  timestamp: {
    color: "#888",
    fontSize: 9,
    marginTop: 4,
    alignSelf: "flex-end",
  },

  mineTimestamp: {
    color: "#BDBDBD",
  },

  media: {
    width: 210,
    height: 150,
    borderRadius: 12,
    marginBottom: 6,
    resizeMode: "cover",
  },

  pressed: {
    opacity: 0.8,
  },
});
