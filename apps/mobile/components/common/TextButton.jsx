import { Pressable, Text, StyleSheet } from "react-native";

export default function TextButton({
  title,
  onPress,
  disabled = false,
  variant = "default",
  align = "center",
  style,
  textStyle,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        { alignItems: align },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "danger" && styles.danger,
          variant === "muted" && styles.muted,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    minHeight: 36,
  },
  text: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },
  danger: {
    color: "#D64545",
  },
  muted: {
    color: "#777777",
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.6,
  },
});
