// apps/mobile/components/reels/ReelProgress.jsx
import { Pressable, StyleSheet, View } from "react-native";

export default function ReelProgress({ progress = 0, onSeek }) {
  const normalized = Math.max(0, Math.min(1, Number(progress) || 0));

  const handlePress = (event) => {
    if (!onSeek) return;

    const width =
      event?.nativeEvent?.locationX ?? event?.nativeEvent?.pageX ?? 0;

    onSeek(Math.max(0, Math.min(1, width)));
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${normalized * 100}%`,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 18,
    justifyContent: "center",
  },
  track: {
    width: "100%",
    height: 3,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  progress: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
});
