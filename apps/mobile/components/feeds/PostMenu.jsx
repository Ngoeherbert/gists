// apps/mobile/components/feeds/PostMenu.jsx
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text } from "react-native";

export default function PostMenu({
  visible,
  onClose,
  onSave,
  onReport,
  onNotInterested,
  onDelete,
  canDelete = false,
}) {
  const actions = [
    {
      label: "Save post",
      icon: "bookmark-outline",
      onPress: onSave,
    },
    {
      label: "Not interested",
      icon: "eye-off-outline",
      onPress: onNotInterested,
    },
    {
      label: "Report",
      icon: "flag-outline",
      onPress: onReport,
    },
    ...(canDelete
      ? [
          {
            label: "Delete post",
            icon: "trash-outline",
            onPress: onDelete,
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
            .filter((item) => typeof item.onPress === "function")
            .map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  onClose?.();
                  item.onPress?.();
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

                <Text
                  style={[
                    styles.label,
                    item.danger && styles.danger,
                  ]}
                >
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
    backgroundColor: "rgba(0,0,0,0.35)",
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
  pressed: {
    backgroundColor: "#F5F5F5",
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