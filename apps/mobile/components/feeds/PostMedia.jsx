// apps/mobile/components/feeds/PostMedia.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function PostMedia({
  uri,
  type = "image",
  aspectRatio = 1,
  onPress,
  muted = false,
  onMutePress,
}) {
  if (!uri) return null;

  const isVideo = type === "video";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.container,
        {
          aspectRatio:
            Number(aspectRatio) > 0 ? Number(aspectRatio) : 1,
        },
      ]}
    >
      <Image
        source={{ uri }}
        resizeMode="cover"
        style={styles.media}
      />

      {isVideo && (
        <View style={styles.playButton}>
          <Ionicons name="play" size={18} color="#FFFFFF" />
        </View>
      )}

      {isVideo && onMutePress && (
        <Pressable
          onPress={onMutePress}
          hitSlop={8}
          style={styles.muteButton}
        >
          <Ionicons
            name={muted ? "volume-mute" : "volume-high"}
            size={18}
            color="#FFFFFF"
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#EEEEEE",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    left: 14,
    top: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  muteButton: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
});