// apps/mobile/components/feeds/PostHeader.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function PostHeader({
  user,
  timestamp,
  location,
  verified = false,
  onUserPress,
  onMenuPress,
}) {
  const name = user?.name || user?.username || "User";
  const avatar = user?.avatar || user?.photo || user?.profilePhoto;
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onUserPress}
        disabled={!onUserPress}
        style={styles.identity}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.initial}>{initial}</Text>
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>
              {name}
            </Text>

            {verified && (
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#111111"
                style={styles.verified}
              />
            )}
          </View>

          <View style={styles.metaRow}>
            {timestamp ? <Text style={styles.meta}>{timestamp}</Text> : null}

            {location ? (
              <>
                <Text style={styles.dot}>•</Text>
                <Text numberOfLines={1} style={styles.meta}>
                  {location}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </Pressable>

      {onMenuPress && (
        <Pressable onPress={onMenuPress} hitSlop={10} style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#111111" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 62,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  identity: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEEEEE",
  },
  placeholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E8E8",
  },
  initial: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },
  info: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    maxWidth: "90%",
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  verified: {
    marginLeft: 4,
  },
  metaRow: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  meta: {
    maxWidth: 160,
    color: "#888888",
    fontSize: 11,
  },
  dot: {
    marginHorizontal: 5,
    color: "#AAAAAA",
    fontSize: 10,
  },
  menuButton: {
    width: 40,
    height: 42,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
