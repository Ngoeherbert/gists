// apps/mobile/components/create/LocationPicker.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function LocationPicker({
  value,
  onPress,
  onClear,
  placeholder = "Add location",
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Ionicons name="location-outline" size={20} color="#111111" />
      </View>

      <Text
        numberOfLines={1}
        style={[styles.text, !value && styles.placeholder]}
      >
        {value || placeholder}
      </Text>

      {value && onClear ? (
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color="#777777" />
        </Pressable>
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#888888" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  text: {
    flex: 1,
    marginHorizontal: 10,
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },
  placeholder: {
    color: "#888888",
    fontWeight: "400",
  },
  pressed: {
    opacity: 0.7,
  },
});
