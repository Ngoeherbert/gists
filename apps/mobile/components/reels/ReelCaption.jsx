// appuses/mobile/components/reels/ReelCaption.jsx
import { StyleSheet, Text, View } from "react-native";

export default function ReelCaption({ caption, maxLines = 3 }) {
  if (!caption) return null;

  return (
    <View style={styles.container}>
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
  caption: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
});
