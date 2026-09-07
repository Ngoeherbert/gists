// apps/mobile/components/reels/ReelTimeline.jsx
import { StyleSheet, Text, View } from "react-native";
import ReelProgress from "./ReelProgress";

function formatTime(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(value / 60);
  const remaining = Math.floor(value % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function ReelTimeline({
  currentTime = 0,
  duration = 0,
  onSeek,
}) {
  const progress =
    duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;

  return (
    <View style={styles.container}>
      <ReelProgress
        progress={progress}
        onSeek={(value) => onSeek?.(value * duration)}
      />

      <View style={styles.times}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>

        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  times: {
    marginTop: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: "#777777",
    fontSize: 10,
    fontWeight: "600",
  },
});
