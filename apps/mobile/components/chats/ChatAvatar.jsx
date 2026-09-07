// apps/mobile/components/chats/ChatAvatar.jsx
import { Image, StyleSheet, Text, View } from "react-native";

export default function ChatAvatar({
  uri,
  name,
  size = 52,
  online = false,
  showOnline = true,
  style,
}) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  const indicatorSize = Math.max(10, Math.round(size * 0.24));

  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
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
          <Text
            style={[styles.initial, { fontSize: Math.max(14, size * 0.38) }]}
          >
            {initial}
          </Text>
        </View>
      )}

      {showOnline && online && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: indicatorSize,
              height: indicatorSize,
              borderRadius: indicatorSize / 2,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    backgroundColor: "#F1F1F1",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E8E8",
  },
  initial: {
    color: "#111111",
    fontWeight: "700",
  },
  onlineIndicator: {
    position: "absolute",
    right: -1,
    bottom: -1,
    backgroundColor: "#111111",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
