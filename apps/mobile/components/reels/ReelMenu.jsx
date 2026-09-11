// apps/mobile/components/reels/ReelMenu.jsx
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function ReelMenu({
  visible = false,
  onClose,
  autoSkip = false,
  onToggleAutoSkip,
  onDownload,
  onNotInterested,
  onReport,
  onDelete,
  canDelete = false,
}) {
  const items = [
    {
      type: "toggle",
      label: "Auto-skip next reel",
      icon: "play-skip-forward-outline",
      value: autoSkip,
      onValueChange: onToggleAutoSkip,
    },
    {
      type: "action",
      label: "Download reel",
      icon: "download-outline",
      action: onDownload,
    },
    {
      type: "action",
      label: "Not interested",
      icon: "eye-off-outline",
      action: onNotInterested,
    },
    {
      type: "action",
      label: "Report",
      icon: "flag-outline",
      action: onReport,
    },
    ...(canDelete
      ? [
          {
            type: "action",
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
          {items.map((item) => {
            if (item.type === "toggle") {
              return (
                <View key={item.label} style={styles.item}>
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color="#111111"
                  />

                  <Text style={[styles.label, styles.labelFlex]}>{item.label}</Text>

                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: "#D5D5D5", true: "#111111" }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#D5D5D5"
                  />
                </View>
              );
            }

            if (typeof item.action !== "function") {
              return null;
            }

            return (
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
            );
          })}
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
  labelFlex: {
    flex: 1,
  },
  danger: {
    color: "#D64545",
  },
  pressed: {
    backgroundColor: "#F5F5F5",
  },
});
