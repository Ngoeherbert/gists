// apps/mobile/components/create/HashtagInput.jsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function HashtagInput({
  value = "",
  onChangeText,
  placeholder = "Add hashtags",
}) {
  return (
    <View style={styles.container}>
      <Ionicons name="pricetag-outline" size={20} color="#777777" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 27,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
    color: "#111111",
    fontSize: 14,
  },
});
