// apps/mobile/components/reels/ReelMusic.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ReelMusic({ music, onPress }) {
  if (!music) return null;

  const title = music.title || music.name || music.songName || "Original audio";

  const artist = music.artist || music.artistName || music.author;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Ionicons name="musical-notes" size={16} color="#FFFFFF" />
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        {artist ? (
          <Text numberOfLines={1} style={styles.artist}>
            {artist}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "90%",
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  artist: {
    marginTop: 2,
    color: "rgba(255,255,255,0.75)",
    fontSize: 10,
  },
  pressed: {
    opacity: 0.65,
  },
});
