import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Toast({
  visible,
  message,
  title,
  type = "default",
  duration = 3000,
  onClose,
  actionLabel,
  onAction,
}) {
  useEffect(() => {
    if (!visible || !duration) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const isError = type === "error";
  const isSuccess = type === "success";
  const isWarning = type === "warning";

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View
        style={[
          styles.container,
          isError && styles.error,
          isSuccess && styles.success,
          isWarning && styles.warning,
        ]}
      >
        <View style={styles.textContainer}>
          {title ? <Text style={styles.title}>{title}</Text> : null}

          <Text style={styles.message}>{message}</Text>
        </View>

        {actionLabel ? (
          <Pressable onPress={onAction} hitSlop={8} style={styles.action}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onClose} hitSlop={8} style={styles.close}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 480,
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: "#111111",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 8,
  },
  error: {
    backgroundColor: "#D64545",
  },
  success: {
    backgroundColor: "#111111",
  },
  warning: {
    backgroundColor: "#7A5A00",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  action: {
    marginLeft: 12,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  close: {
    marginLeft: 12,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 26,
  },
});
