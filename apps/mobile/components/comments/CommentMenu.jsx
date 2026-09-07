// apps/mobile/components/comments/CommentMenu.jsx

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "../common/Modal";

export default function CommentMenu({
  visible = false,
  onClose,
  isOwnComment = false,
  onEdit,
  onDelete,
  onReport,
  onCopy,
}) {
  const handleAction = (callback) => {
    onClose?.();
    callback?.();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Comment options"
      position="bottom"
    >
      <View style={styles.container}>
        {onCopy && (
          <Pressable style={styles.item} onPress={() => handleAction(onCopy)}>
            <View style={styles.icon}>
              <Ionicons name="copy-outline" size={21} color="#111" />
            </View>
            <Text style={styles.label}>Copy</Text>
          </Pressable>
        )}

        {isOwnComment && onEdit && (
          <Pressable style={styles.item} onPress={() => handleAction(onEdit)}>
            <View style={styles.icon}>
              <Ionicons name="create-outline" size={21} color="#111" />
            </View>
            <Text style={styles.label}>Edit</Text>
          </Pressable>
        )}

        {!isOwnComment && onReport && (
          <Pressable style={styles.item} onPress={() => handleAction(onReport)}>
            <View style={styles.icon}>
              <Ionicons name="flag-outline" size={21} color="#111" />
            </View>
            <Text style={styles.label}>Report</Text>
          </Pressable>
        )}

        {isOwnComment && onDelete && (
          <Pressable style={styles.item} onPress={() => handleAction(onDelete)}>
            <View style={styles.icon}>
              <Ionicons name="trash-outline" size={21} color="#d00" />
            </View>
            <Text style={[styles.label, styles.danger]}>Delete</Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  item: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 14,
  },
  icon: {
    width: 34,
    alignItems: "center",
  },
  label: {
    color: "#111",
    fontSize: 15,
    fontWeight: "500",
  },
  danger: {
    color: "#d00",
  },
});
