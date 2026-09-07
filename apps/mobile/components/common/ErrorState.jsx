import { View, Text, Pressable, StyleSheet } from "react-native";

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  retryLabel = "Try again",
  onRetry,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
  },
  description: {
    maxWidth: 340,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#777777",
    textAlign: "center",
  },
  button: {
    minWidth: 120,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 24,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
