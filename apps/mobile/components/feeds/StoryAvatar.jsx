// apps/mobile/components/feeds/StoryAvatar.jsx
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function StoryAvatar({
  uri,
  name,
  size = 64,
  viewed = false,
  isOwn = false,
  onPress,
}) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "+";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.container,
        { width: size + 8 },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.ring,
          {
            width: size + 6,
            height: size + 6,
            borderRadius: (size + 6) / 2,
          },
          viewed && styles.viewedRing,
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
          >
            <Text style={[styles.initial, { fontSize: size * 0.3 }]}>
              {initial}
            </Text>
          </View>
        )}
      </View>

      {isOwn && (
        <View style={styles.addButton}>
          <Text style={styles.addText}>+</Text>
        </View>
      )}

      <Text numberOfLines={1} style={styles.name}>
        {isOwn ? "Your story" : name || "Story"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 12,
  },
  ring: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#111111",
    backgroundColor: "#FFFFFF",
  },
  viewedRing: {
    borderColor: "#D6D6D6",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E9E9",
  },
  initial: {
    color: "#111111",
    fontWeight: "700",
  },
  addButton: {
    position: "absolute",
    right: -1,
    top: 44,
    width: 21,
    height: 21,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  addText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 17,
    fontWeight: "700",
  },
  name: {
    maxWidth: 74,
    marginTop: 5,
    color: "#222222",
    fontSize: 11,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.65,
  },
});
