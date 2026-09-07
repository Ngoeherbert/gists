import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ChatAvatar from "../chats/ChatAvatar";

export default function RoomInfo({ room = {} }) {
  const {
    name = "Gist Room",
    description,
    avatar,
    memberCount = 0,
    createdAt,
    category,
  } = room;

  return (
    <View style={styles.container}>
      <ChatAvatar uri={avatar} name={name} size={78} />

      <Text style={styles.name}>{name}</Text>

      {category ? (
        <View style={styles.category}>
          <Ionicons name="pricetag-outline" size={13} color="#666" />
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      ) : null}

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="people-outline" size={18} color="#555" />
          <Text style={styles.statText}>{memberCount} members</Text>
        </View>

        {createdAt ? (
          <View style={styles.stat}>
            <Ionicons name="calendar-outline" size={17} color="#555" />
            <Text style={styles.statText}>{createdAt}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 24,
  },

  name: {
    color: "#000",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },

  category: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  categoryText: {
    color: "#666",
    fontSize: 12,
    marginLeft: 4,
  },

  description: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 420,
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 18,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
  },

  statText: {
    color: "#555",
    fontSize: 12,
    marginLeft: 5,
  },
});
