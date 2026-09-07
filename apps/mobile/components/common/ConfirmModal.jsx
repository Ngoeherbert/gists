import { View, Text, Pressable, StyleSheet } from "react-native";
import Modal from "./Modal";

export default function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
}) {
  return (
    <Modal visible={visible} onClose={onClose} dismissOnBackdrop={!loading}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            onPress={onClose}
            disabled={loading}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && !loading && styles.pressed,
            ]}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>

          <Pressable
            onPress={onConfirm}
            disabled={loading}
            style={({ pressed }) => [
              styles.confirmButton,
              destructive && styles.destructive,
              pressed && !loading && styles.pressed,
              loading && styles.disabled,
            ]}
          >
            <Text style={styles.confirmText}>
              {loading ? "Please wait..." : confirmLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    color: "#111111",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#777777",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  destructive: {
    backgroundColor: "#D64545",
  },
  cancelText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
});
