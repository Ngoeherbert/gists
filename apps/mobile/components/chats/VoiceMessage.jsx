// apps/mobile/components/chats/VoiceMessage.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function VoiceMessage({
  duration = "0:00",
  isMine = false,
  playing = false,
  progress = 0,
  onPress,
}) {
  const safeProgress = Math.min(1, Math.max(0, progress));

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, isMine ? styles.mine : styles.their]}
    >
      <View
        style={[styles.playButton, isMine ? styles.minePlay : styles.theirPlay]}
      >
        <Ionicons
          name={playing ? "pause" : "play"}
          size={18}
          color={isMine ? "#111111" : "#FFFFFF"}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.wave}>
          {Array.from({ length: 24 }).map((_, index) => {
            const height = 7 + ((index * 17) % 15);

            return (
              <View
                key={index}
                style={[
                  styles.bar,
                  {
                    height,
                    opacity: index / 24 <= safeProgress ? 1 : 0.35,
                  },
                ]}
              />
            );
          })}
        </View>

        <Text
          style={[styles.duration, isMine ? styles.mineText : styles.theirText]}
        >
          {duration}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 245,
    maxWidth: "100%",
    minHeight: 64,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
  },
  mine: {
    backgroundColor: "#111111",
    borderBottomRightRadius: 5,
  },
  their: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
  },
  playButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
  },
  minePlay: {
    backgroundColor: "#FFFFFF",
  },
  theirPlay: {
    backgroundColor: "#111111",
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  wave: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bar: {
    flex: 1,
    maxWidth: 4,
    borderRadius: 2,
    backgroundColor: "#777777",
  },
  duration: {
    marginTop: 3,
    fontSize: 10,
  },
  mineText: {
    color: "#CFCFCF",
  },
  theirText: {
    color: "#777777",
  },
});
