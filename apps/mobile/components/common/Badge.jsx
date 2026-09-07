import { View, Text, StyleSheet } from "react-native";

export default function Badge({
  value,
  children,
  variant = "dark",
  size = "medium",
  dot = false,
  style,
  textStyle,
}) {
  const content = children ?? value;

  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          size === "small" && styles.smallDot,
          variant === "danger" && styles.danger,
          variant === "light" && styles.light,
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.badge,
        size === "small" && styles.small,
        size === "large" && styles.large,
        variant === "dark" && styles.dark,
        variant === "light" && styles.light,
        variant === "danger" && styles.danger,
        variant === "outline" && styles.outline,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "dark" && styles.darkText,
          variant === "light" && styles.lightText,
          variant === "danger" && styles.dangerText,
          variant === "outline" && styles.outlineText,
          textStyle,
        ]}
      >
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 24,
    borderRadius: 12,
    paddingHorizontal: 9,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  small: {
    minHeight: 20,
    borderRadius: 10,
    paddingHorizontal: 7,
  },
  large: {
    minHeight: 30,
    borderRadius: 15,
    paddingHorizontal: 12,
  },
  dark: {
    backgroundColor: "#111111",
  },
  light: {
    backgroundColor: "#F1F1F1",
  },
  danger: {
    backgroundColor: "#D64545",
  },
  outline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8D8D8",
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#111111",
  },
  dangerText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#111111",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#111111",
  },
  smallDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
