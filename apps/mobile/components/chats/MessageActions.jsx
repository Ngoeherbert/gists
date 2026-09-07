// apps/mobile/components/chats/MessageActions.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MessageActions({
  onReply,
  onReact,
  onCopy,
  onForward,
  onDelete,
  canDelete = false,
}) {
  const actions = [
    {
      key: "reply",
      label: "Reply",
      icon: "return-down-forward-outline",
      onPress: onReply,
    },
    {
      key: "react",
      label: "React",
      icon: "happy-outline",
      onPress: onReact,
    },
    {
      key: "copy",
      label: "Copy",
      icon: "copy-outline",
      onPress: onCopy,
    },
    {
      key: "forward",
      label: "Forward",
      icon: "arrow-redo-outline",
      onPress: onForward,
    },
    ...(canDelete
      ? [
          {
            key: "delete",
            label: "Delete",
            icon: "trash-outline",
            onPress: onDelete,
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <View style={styles.container}>
      {actions
        .filter((action) => typeof action.onPress === "function")
        .map((action) => (
          <Pressable
            key={action.key}
            onPress={action.onPress}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <Ionicons
              name={action.icon}
              size={20}
              color={action.danger ? "#D64545" : "#111111"}
            />
            <Text style={[styles.label, action.danger && styles.dangerLabel]}>
              {action.label}
            </Text>
          </Pressable>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  action: {
    minWidth: 76,
    minHeight: 58,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  pressed: {
    backgroundColor: "#F2F2F2",
  },
  label: {
    marginTop: 5,
    color: "#111111",
    fontSize: 11,
    fontWeight: "600",
  },
  dangerLabel: {
    color: "#D64545",
  },
});
