// apps/mobile/components/chats/ViewOnceMessage.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ViewOnceMessage({
  viewed = false,
  isMine = false,
  onPress,
}) {
  return (
    <Pressable
      onPress={!viewed ? onPress : undefined}
      disabled={viewed}
      style={[
        styles.container,
        isMine ? styles.mine : styles.their,
        viewed && styles.viewed,
      ]}
    >
      <View style={[styles.icon, isMine ? styles.mineIcon : styles.theirIcon]}>
        <Ionicons
          name={viewed ? "checkmark" : "eye-outline"}
          size={24}
          color={isMine ? "#111111" : "#FFFFFF"}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, isMine ? styles.mineText : styles.theirText]}
        >
          {viewed ? "Opened" : "View once"}
        </Text>

        <Text
          style={[
            styles.subtitle,
            isMine ? styles.mineSubtext : styles.theirSubtext,
          ]}
        >
          {viewed ? "This media has been viewed" : "Tap to view once"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 245,
    maxWidth: "100%",
    minHeight: 72,
    padding: 10,
    borderRadius: 18,
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
  viewed: {
    opacity: 0.65,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 15,
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
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
  },
  mineText: {
    color: "#FFFFFF",
  },
  theirText: {
    color: "#111111",
  },
  mineSubtext: {
    color: "#CFCFCF",
  },
  theirSubtext: {
    color: "#777777",
  },
});
