import { Pressable, StyleSheet } from "react-native";

export default function IconButton({
  children,
  onPress,
  size = 44,
  disabled = false,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.4,
  },

  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.96 }],
  },
});
