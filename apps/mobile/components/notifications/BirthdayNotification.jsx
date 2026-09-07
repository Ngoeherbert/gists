import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../common/Avatar";

export default function BirthdayNotification({
  user,
  message,
  timestamp,
  onPress,
}) {
  const username = user?.name || user?.username || "Someone";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.avatarWrapper}>
        <Avatar
          uri={user?.avatar || user?.avatarUrl}
          name={username}
          size={48}
        />

        <View style={styles.birthdayIcon}>
          <Ionicons name="gift" size={13} color="#fff" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Happy Birthday! 🎂</Text>

        <Text style={styles.message} numberOfLines={2}>
          {message || `Wish ${username} a happy birthday!`}
        </Text>

        {timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
      </View>

      {onPress ? (
        <Ionicons name="chevron-forward" size={19} color="#999" />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 76,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },

  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },

  birthdayIcon: {
    position: "absolute",
    right: -3,
    bottom: -2,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#000",
    fontSize: 14,
    fontWeight: "800",
  },

  message: {
    color: "#666",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  timestamp: {
    color: "#999",
    fontSize: 10,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.7,
  },
});
