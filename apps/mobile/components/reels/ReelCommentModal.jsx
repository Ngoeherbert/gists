// apps/mobile/components/reels/ReelCommentModal.jsx
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function CommentItem({ comment }) {
  const user = comment?.user || {};
  const name = user.name || user.username || comment?.username || "User";

  return (
    <View style={styles.comment}>
      <View style={styles.avatar}>
        <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.commentBody}>
        <Text style={styles.commentName}>{name}</Text>
        <Text style={styles.commentText}>
          {comment?.text || comment?.content || ""}
        </Text>
      </View>
    </View>
  );
}

export default function ReelCommentModal({
  visible = false,
  comments = [],
  value = "",
  onChangeText,
  onSubmit,
  onClose,
  submitting = false,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>

            <Pressable onPress={onClose} hitSlop={8} style={styles.close}>
              <Ionicons name="close" size={24} color="#111111" />
            </Pressable>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item, index) => String(item?.id ?? index)}
            renderItem={({ item }) => <CommentItem comment={item} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No comments yet</Text>
                <Text style={styles.emptyText}>Be the first to comment.</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />

          <View style={styles.inputRow}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder="Add a comment..."
              placeholderTextColor="#999999"
              style={styles.input}
              multiline
            />

            <Pressable
              onPress={onSubmit}
              disabled={submitting || !value?.trim()}
              style={({ pressed }) => [
                styles.send,
                (submitting || !value?.trim()) && styles.sendDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    height: "72%",
    overflow: "hidden",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 58,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
  },
  close: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flexGrow: 1,
    padding: 16,
  },
  comment: {
    marginBottom: 18,
    flexDirection: "row",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E8E8",
  },
  initial: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  commentBody: {
    flex: 1,
    marginLeft: 10,
  },
  commentName: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },
  commentText: {
    marginTop: 3,
    color: "#333333",
    fontSize: 13,
    lineHeight: 19,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 4,
    color: "#888888",
    fontSize: 12,
  },
  inputRow: {
    padding: 12,
    paddingBottom: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 9,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: "#F3F3F3",
    color: "#111111",
    fontSize: 14,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
  sendDisabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.7,
  },
});
