// apps/mobile/components/chats/MediaMessage.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function MediaMessage({
  uri,
  type = "image",
  isMine = false,
  onPress,
}) {
  if (!uri) return null;

  const isVideo = type === "video";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.container,
        isMine ? styles.mine : styles.their,
        pressed && styles.pressed,
      ]}
    >
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />

      {isVideo && (
        <View style={styles.play}>
          <Ionicons name="play" size={23} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 260,
    maxWidth: "100%",
    overflow: "hidden",
    borderRadius: 18,
  },
  mine: {
    borderBottomRightRadius: 5,
  },
  their: {
    borderBottomLeftRadius: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E9E9E9",
  },
  play: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 52,
    height: 52,
    marginLeft: -26,
    marginTop: -26,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 3,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  pressed: {
    opacity: 0.8,
  },
});
