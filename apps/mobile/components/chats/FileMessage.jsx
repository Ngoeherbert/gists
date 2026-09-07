// apps/mobile/components/chats/FileMessage.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

function formatSize(bytes) {
  if (!bytes || bytes < 1) return "";

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileMessage({
  name = "File",
  size,
  extension,
  isMine = false,
  onPress,
}) {
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
      <View style={[styles.icon, isMine ? styles.mineIcon : styles.theirIcon]}>
        <Ionicons
          name="document-text-outline"
          size={25}
          color={isMine ? "#111111" : "#FFFFFF"}
        />
      </View>

      <View style={styles.content}>
        <Text
          numberOfLines={2}
          style={[styles.name, isMine ? styles.mineText : styles.theirText]}
        >
          {name}
        </Text>

        <Text
          style={[styles.meta, isMine ? styles.mineMeta : styles.theirMeta]}
        >
          {[extension?.toUpperCase(), formatSize(size)]
            .filter(Boolean)
            .join(" • ") || "Document"}
        </Text>
      </View>

      <Ionicons
        name="download-outline"
        size={21}
        color={isMine ? "#FFFFFF" : "#111111"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 270,
    maxWidth: "100%",
    minHeight: 70,
    padding: 9,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
  },
  mine: {
    backgroundColor: "#111111",
    borderBottomRightRadius: 5,
  },
  their: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
  },
  pressed: {
    opacity: 0.75,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mineIcon: {
    backgroundColor: "#FFFFFF",
  },
  theirIcon: {
    backgroundColor: "#111111",
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  mineText: {
    color: "#FFFFFF",
  },
  theirText: {
    color: "#111111",
  },
  meta: {
    marginTop: 3,
    fontSize: 10,
  },
  mineMeta: {
    color: "#CFCFCF",
  },
  theirMeta: {
    color: "#777777",
  },
});
