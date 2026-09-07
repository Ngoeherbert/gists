// apps/mobile/components/create/MediaPicker.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MediaPicker({
  onPickImage,
  onPickVideo,
  onPickMedia,
  multiple = false,
}) {
  return (
    <View style={styles.container}>
      {onPickMedia ? (
        <Pressable
          onPress={() => onPickMedia?.({ multiple })}
          style={({ pressed }) => [styles.option, pressed && styles.pressed]}
        >
          <Ionicons name="images-outline" size={30} color="#111111" />
          <Text style={styles.label}>Gallery</Text>
        </Pressable>
      ) : null}

      {onPickImage ? (
        <Pressable
          onPress={onPickImage}
          style={({ pressed }) => [styles.option, pressed && styles.pressed]}
        >
          <Ionicons name="image-outline" size={30} color="#111111" />
          <Text style={styles.label}>Photo</Text>
        </Pressable>
      ) : null}

      {onPickVideo ? (
        <Pressable
          onPress={onPickVideo}
          style={({ pressed }) => [styles.option, pressed && styles.pressed]}
        >
          <Ionicons name="videocam-outline" size={30} color="#111111" />
          <Text style={styles.label}>Video</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    minHeight: 92,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  label: {
    marginTop: 8,
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.65,
  },
});
