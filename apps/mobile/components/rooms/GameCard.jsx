import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GameCard({
  title = "Gist Game",
  description,
  image,
  players,
  status = "available",
  onPress,
  onPlay,
}) {
  const statusLabel =
    {
      available: "Available",
      playing: "Playing",
      finished: "Finished",
    }[status] || status;

  return (
    <Pressable
      onPress={onPress || onPlay}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${title}`}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="game-controller" size={30} color="#000" />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.status}>
            <View
              style={[
                styles.statusDot,
                status === "playing" && styles.playingDot,
                status === "finished" && styles.finishedDot,
              ]}
            />
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          {players !== undefined && (
            <View style={styles.players}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.playersText}>
                {players} {players === 1 ? "player" : "players"}
              </Text>
            </View>
          )}

          <View style={styles.playButton}>
            <Ionicons name="play" size={14} color="#fff" />
            <Text style={styles.playText}>
              {status === "playing" ? "Join" : "Play"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
  },

  imagePlaceholder: {
    height: 130,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 14,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  title: {
    flex: 1,
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#20C66B",
    marginRight: 5,
  },

  playingDot: {
    backgroundColor: "#F5A623",
  },

  finishedDot: {
    backgroundColor: "#999",
  },

  statusText: {
    color: "#777",
    fontSize: 11,
    fontWeight: "600",
  },

  description: {
    color: "#666",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 7,
  },

  footer: {
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  players: {
    flexDirection: "row",
    alignItems: "center",
  },

  playersText: {
    color: "#666",
    fontSize: 12,
    marginLeft: 5,
  },

  playButton: {
    minWidth: 76,
    height: 34,
    paddingHorizontal: 13,
    borderRadius: 17,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  playText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
});
