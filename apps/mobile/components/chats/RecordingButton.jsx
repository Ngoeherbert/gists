// apps/mobile/components/chats/RecordingButton.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function RecordingButton({
  recording = false,
  duration = "0:00",
  onPress,
  onCancel,
  disabled = false,
}) {
  if (!recording) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={8}
        style={({ pressed }) => [
          styles.button,
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="mic-outline" size={24} color="#111111" />
      </Pressable>
    );
  }

  return (
    <View style={styles.recordingContainer}>
      {onCancel && (
        <Pressable onPress={onCancel} hitSlop={8} style={styles.cancel}>
          <Ionicons name="trash-outline" size={20} color="#D64545" />
        </Pressable>
      )}

      <View style={styles.live}>
        <View style={styles.recordDot} />
        <Text style={styles.duration}>{duration}</Text>
      </View>

      <Pressable onPress={onPress} hitSlop={8} style={styles.stopButton}>
        <Ionicons name="send" size={19} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.65,
  },
  recordingContainer: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancel: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  live: {
    minWidth: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  recordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D64545",
  },
  duration: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "600",
  },
  stopButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
});
