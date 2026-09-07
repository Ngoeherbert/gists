import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GameInvite({
  gameName = "Gist Game",
  inviterName = "Gist User",
  onAccept,
  onDecline,
  onPress,
}) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
        accessibilityRole={onPress ? "button" : undefined}
      >
        <View style={styles.icon}>
          <Ionicons name="game-controller" size={22} color="#000" />
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>Game invite</Text>
          <Text style={styles.message} numberOfLines={2}>
            {inviterName} invited you to play {gameName}.
          </Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={onDecline}
          style={styles.decline}
          accessibilityRole="button"
          accessibilityLabel="Decline game invite"
        >
          <Text style={styles.declineText}>Decline</Text>
        </Pressable>

        <Pressable
          onPress={onAccept}
          style={styles.accept}
          accessibilityRole="button"
          accessibilityLabel="Accept game invite"
        >
          <Text style={styles.acceptText}>Accept</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 18,
    padding: 14,
    marginVertical: 6,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    color: "#000",
    fontSize: 14,
    fontWeight: "800",
  },

  message: {
    color: "#666",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 13,
  },

  decline: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },

  declineText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
  },

  accept: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  acceptText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.65,
  },
});
