import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function AppTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  left,
  right,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = true,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  style,
  inputStyle,
  containerStyle,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          focused && styles.focused,
          error && styles.error,
          !editable && styles.disabled,
        ]}
      >
        {left && <View style={styles.left}>{left}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A1A1AA"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          style={[styles.input, multiline && styles.multiline, inputStyle]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {right && <View style={styles.right}>{right}</View>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 8,
  },
  inputWrapper: {
    width: "100%",
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  focused: {
    borderColor: "#111111",
  },
  error: {
    borderColor: "#D64545",
  },
  disabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.7,
  },
  left: {
    marginRight: 10,
  },
  right: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    minHeight: 54,
    padding: 0,
    fontSize: 16,
    color: "#111111",
  },
  multiline: {
    minHeight: 120,
    paddingVertical: 14,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#D64545",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  helperText: {
    color: "#777777",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
});
