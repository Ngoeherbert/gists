// apps/mobile/components/reels/ReelVideo.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function ReelVideo({
  uri,
  active = false,
  muted = true,
  onPress,
  onMutePress,
  resizeMode = "cover",
}) {
  if (!uri) {
    return (
      <View style={styles.empty}>
        <Ionicons name="videocam-outline" size={42} color="#777777" />
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri }} resizeMode={resizeMode} style={styles.video} />

      {!active ? (
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={25} color="#FFFFFF" />
          </View>
        </View>
      ) : null}

      {onMutePress ? (
        <Pressable
          onPress={(event) => {
            event.stopPropagation?.();
            onMutePress?.();
          }}
          hitSlop={8}
          style={styles.muteButton}
        >
          <Ionicons
            name={muted ? "volume-mute" : "volume-high"}
            size={18}
            color="#FFFFFF"
          />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    paddingLeft: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  muteButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
});
