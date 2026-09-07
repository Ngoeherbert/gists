// apps/mobile/components/calls/ParticipantView.jsx

import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ParticipantView({
  participant,
  muted = false,
  speaking = false,
  onPress,
  compact = false,
}) {
  const name = participant?.name || participant?.username || "Participant";

  const avatar =
    participant?.avatar || participant?.avatarUrl || participant?.photo;

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.compactContainer, speaking && styles.speakingBorder]}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.compactAvatar} />
        ) : (
          <View style={styles.compactFallback}>
            <Text style={styles.compactInitial}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {muted && (
          <View style={styles.mutedBadge}>
            <Ionicons name="mic-off" size={11} color="#fff" />
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, speaking && styles.speakingContainer]}
    >
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          {muted && (
            <Ionicons
              name="mic-off"
              size={15}
              color="#fff"
              style={styles.mic}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 220,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#222",
  },
  speakingContainer: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
  },
  initial: {
    color: "#fff",
    fontSize: 52,
    fontWeight: "700",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    flex: 1,
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  mic: {
    marginLeft: 6,
  },
  compactContainer: {
    width: 72,
    height: 72,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  speakingBorder: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  compactAvatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  compactFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
  },
  compactInitial: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  mutedBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
});
