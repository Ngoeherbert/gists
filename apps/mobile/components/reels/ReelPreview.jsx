// apps/mobile/components/reels/ReelPreview.jsx
import { StyleSheet, View } from "react-native";
import ReelVideo from "./ReelVideo";

export default function ReelPreview({
  media,
  currentTime = 0,
  duration = 0,
  playing = false,
  muted = true,
  onPress,
  onMute,
}) {
  const uri =
    media?.uri ||
    media?.url ||
    media?.videoUrl;

  if (!uri) return null;

  return (
    <View style={styles.container}>
      <ReelVideo
        uri={uri}
        active={playing}
        muted={muted}
        onPress={onPress}
        onMutePress={onMute}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 9 / 16,
    maxHeight: 620,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#000000",
  },
});