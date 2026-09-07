// apps/mobile/components/reels/ReelMenu.jsx
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text } from "react-native";

export default function ReelMenu({
  visible = false,
  onClose,
  onSave,
  onNotInterested,
  onReport,
  onDelete,
  canDelete = false,
}) {
  const actions = [
    {
      label: "Save reel",
      icon: "bookmark-outline",
      action: onSave,
    },
    {
      label: "Not interested",
      icon: "eye-off-outline",
      action: onNotInterested,
    },
    {
      label: "Report",
      icon: "flag-outline",
      action: onReport,
    },
    ...(canDelete
      ? [
          {
            label: "Delete reel",
            icon: "trash-outline",
            action: onDelete,
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.menu}
          onPress={(event) => event.stopPropagation()}
        >
          {actions
            .filter((item) => typeof item.action === "function")
            .map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  onClose?.();
                  item.action?.();
                }}
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={21}
                  color={item.danger ? "#D64545" : "#111111"}
                />

                <Text style={[styles.label, item.danger && styles.danger]}>
                  {item.label}
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
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menu: {
    width: "100%",
    maxWidth: 360,
    paddingVertical: 7,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  item: {
    minHeight: 54,
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
  pressed: {
    backgroundColor: "#F5F5F5",
  },
});
