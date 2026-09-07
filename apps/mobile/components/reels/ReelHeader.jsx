// apps/mobile/components/reels/ReelHeader.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function ReelHeader({
  user,
  username,
  onUserPress,
  onMorePress,
}) {
  const name = user?.name || username || user?.username || "User";

  const avatar = user?.avatar || user?.photo || user?.profilePhoto;

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
            <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>

          {username && username !== name ? (
            <Text numberOfLines={1} style={styles.username}>
              @{String(username).replace(/^@/, "")}
            </Text>
          ) : null}
        </View>
      </Pressable>

      {onMorePress ? (
        <Pressable onPress={onMorePress} hitSlop={10} style={styles.more}>
          <Ionicons name="ellipsis-horizontal" size={23} color="#FFFFFF" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  placeholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E8E8",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  initial: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  info: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  username: {
    marginTop: 2,
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
  },
  more: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
