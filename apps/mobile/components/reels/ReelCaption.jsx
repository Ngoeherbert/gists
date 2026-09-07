// apps/mobile/components/reels/ReelCaption.jsx
import { StyleSheet, Text, View } from "react-native";

export default function ReelCaption({ username, caption, maxLines = 3 }) {
  if (!username && !caption) return null;

  return (
    <View style={styles.container}>
      {username ? <Text style={styles.username}>{username}</Text> : null}

      {caption ? (
        <Text numberOfLines={maxLines} style={styles.caption}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 12,
  },
  username: {
    marginBottom: 5,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  caption: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
});
