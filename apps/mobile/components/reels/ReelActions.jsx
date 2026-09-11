// apps/mobile/components/reels/ReelActions.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

function ActionButton({ icon, activeIcon, active, count, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={7}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <Ionicons name={active ? activeIcon : icon} size={27} color="#FFFFFF" />

      {count > 0 ? (
        <Text style={styles.count}>{count > 999 ? "999+" : count}</Text>
      ) : null}
    </Pressable>
  );
}

export default function ReelActions({
  liked = false,
  likeCount = 0,
  commentCount = 0,
  reposted = false,
  repostCount = 0,
  saved = false,
  onLike,
  onComment,
  onRepost,
  onShare,
  onSave,
  onMore,
}) {
  return (
    <View style={styles.container}>
      <ActionButton
        icon="heart-outline"
        activeIcon="heart"
        active={liked}
        count={likeCount}
        onPress={onLike}
      />

      <ActionButton
        icon="chatbubble-outline"
        activeIcon="chatbubble"
        count={commentCount}
        onPress={onComment}
      />

      <ActionButton
        icon="repeat-outline"
        activeIcon="repeat"
        active={reposted}
        count={repostCount}
        onPress={onRepost}
      />

      <Pressable
        onPress={onShare}
        hitSlop={7}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Ionicons name="paper-plane-outline" size={27} color="#FFFFFF" />
      </Pressable>

      <Pressable
        onPress={onSave}
        hitSlop={7}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={27}
          color="#FFFFFF"
        />
      </Pressable>

      <Pressable
        onPress={onMore}
        hitSlop={7}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Ionicons name="ellipsis-horizontal" size={27} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    paddingRight: 2,
  },
  action: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(18,18,18,0.46)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  count: {
    marginTop: 2,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
