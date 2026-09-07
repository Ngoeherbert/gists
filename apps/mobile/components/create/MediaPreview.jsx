// apps/mobile/components/create/MediaPreview.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function MediaPreview({
  media,
  onRemove,
  onPress,
  showRemove = true,
}) {
  if (!media) return null;

  const uri = media.uri || media.url;
  const type = media.type || media.mediaType || "image";
  const isVideo = type === "video";

  if (!uri) return null;

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.container}>
      <Image source={{ uri }} resizeMode="cover" style={styles.image} />

      {isVideo && (
        <View style={styles.play}>
          <Ionicons name="play" size={20} color="#FFFFFF" />
        </View>
      )}

      {showRemove && onRemove ? (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.remove}>
          <Ionicons name="close" size={19} color="#FFFFFF" />
        </Pressable>
      ) : null}

      {isVideo && (
        <View style={styles.videoLabel}>
          <Text style={styles.videoText}>Video</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#EEEEEE",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  play: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 48,
    height: 48,
    marginTop: -24,
    marginLeft: -24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  remove: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  videoLabel: {
    position: "absolute",
    left: 10,
    bottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  videoText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
