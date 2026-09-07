// apps/mobile/components/chats/MessageMenu.jsx
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function MessageMenu({
  visible,
  onClose,
  onReply,
  onReact,
  onCopy,
  onForward,
  onDelete,
  canDelete = false,
}) {
  const actions = [
    {
      label: "Reply",
      icon: "return-down-forward-outline",
      onPress: onReply,
    },
    {
      label: "React",
      icon: "happy-outline",
      onPress: onReact,
    },
    {
      label: "Copy",
      icon: "copy-outline",
      onPress: onCopy,
    },
    {
      label: "Forward",
      icon: "arrow-redo-outline",
      onPress: onForward,
    },
    ...(canDelete
      ? [
          {
            label: "Delete",
            icon: "trash-outline",
            onPress: onDelete,
            danger: true,
          },
        ]
      : []),
  ];

  const handleAction = (action) => {
    onClose?.();
    requestAnimationFrame(() => {
      action.onPress?.();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.menu} onPress={() => {}}>
          {actions
            .filter((action) => typeof action.onPress === "function")
            .map((action) => (
              <Pressable
                key={action.label}
                onPress={() => handleAction(action)}
                style={styles.item}
              >
                <Ionicons
                  name={action.icon}
                  size={21}
                  color={action.danger ? "#D64545" : "#111111"}
                />
                <Text style={[styles.label, action.danger && styles.danger]}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  menu: {
    width: "100%",
    maxWidth: 360,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  item: {
    minHeight: 52,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 13,
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },
  danger: {
    color: "#D64545",
  },
});
