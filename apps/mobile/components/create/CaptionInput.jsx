// apps/mobile/components/create/CaptionInput.jsx
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function CaptionInput({
  value = "",
  onChangeText,
  placeholder = "Write a caption...",
  maxLength = 2200,
  multiline = true,
  autoFocus = false,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        multiline={multiline}
        maxLength={maxLength}
        autoFocus={autoFocus}
        textAlignVertical="top"
        style={styles.input}
      />

      {maxLength ? (
        <Text style={styles.counter}>
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 120,
    padding: 15,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
  },
  input: {
    minHeight: 82,
    padding: 0,
    color: "#111111",
    fontSize: 15,
    lineHeight: 22,
  },
  counter: {
    alignSelf: "flex-end",
    marginTop: 7,
    color: "#888888",
    fontSize: 11,
  },
});