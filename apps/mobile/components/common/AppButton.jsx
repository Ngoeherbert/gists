import { Pressable, Text, StyleSheet } from "react-native";

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {loading ? "Please wait..." : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  primary: {
    backgroundColor: "#111111",
  },

  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8D8D8",
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  text: {
    fontSize: 15,
    fontWeight: "700",
  },

  primaryText: {
    color: "#FFFFFF",
  },

  secondaryText: {
    color: "#111111",
  },
});
