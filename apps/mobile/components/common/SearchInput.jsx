import { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchInput({
  value,
  onChangeText,
  placeholder = "Search",
  onClear,
  autoFocus = false,
  style,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChangeText?.("");
    onClear?.();
  };

  return (
    <View style={[styles.container, focused && styles.focused, style]}>
      <Ionicons name="search-outline" size={20} color="#777777" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A1A1AA"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="search"
        style={styles.input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />

      {value?.length > 0 ? (
        <Pressable onPress={handleClear} hitSlop={8} style={styles.clear}>
          <Ionicons name="close-circle" size={20} color="#999999" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 26,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  focused: {
    borderColor: "#111111",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 15,
    color: "#111111",
  },
  clear: {
    alignItems: "center",
    justifyContent: "center",
  },
});
