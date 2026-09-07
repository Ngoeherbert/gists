// apps/mobile/components/create/CreateOption.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CreateOption({
  icon = "add-outline",
  title,
  description,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Ionicons name={icon} size={25} color="#111111" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={19} color="#888888" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    paddingHorizontal: 15,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    marginTop: 3,
    color: "#777777",
    fontSize: 12,
  },
  pressed: {
    opacity: 0.65,
  },
});
