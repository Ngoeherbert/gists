// apps/mobile/components/feeds/PostCaption.jsx
import { StyleSheet, Text, View } from "react-native";

export default function PostCaption({ text, username, maxLines }) {
  if (!text) return null;

  return (
    <View style={styles.container}>
      {username ? <Text style={styles.username}>{username} </Text> : null}

      <Text numberOfLines={maxLines} style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 3,
    paddingBottom: 10,
  },
  username: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  text: {
    color: "#222222",
    fontSize: 14,
    lineHeight: 20,
  },
});
