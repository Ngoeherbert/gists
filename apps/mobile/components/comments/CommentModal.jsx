// apps/mobile/components/comments/CommentModal.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "../common/Modal";
import Loader from "../common/Loader";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

export default function CommentModal({
  visible = false,
  onClose,
  comments = [],
  user,
  loading = false,
  post,
  onUserPress,
  onSubmitComment,
  onLikeComment,
  onReplyComment,
  onViewReplies,
  onEditComment,
  onDeleteComment,
  onReportComment,
  onCopyComment,
  onHideComment,
  currentUserId,
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Bottom-sheet modals (especially on Android with edge-to-edge enabled)
  // are not resized when the keyboard appears, so the comment input gets
  // hidden underneath it. Track the keyboard height here and lift the sheet
  // contents up so the input always stays visible above the keyboard.
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event?.endCoordinates?.height ?? 0);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const commentCount = useMemo(
    () => post?.commentCount ?? post?.commentsCount ?? comments.length,
    [post, comments.length],
  );

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setInputValue("");
  };

  const handleSubmit = async (text) => {
    const parentId = replyingTo?.id || replyingTo?._id || null;

    await onSubmitComment?.({
      text,
      parentId,
      comment: replyingTo,
    });

    setInputValue("");
    setReplyingTo(null);
  };

  const handleClose = useCallback(() => {
    setReplyingTo(null);
    setInputValue("");
    onClose?.();
  }, [onClose]);

  const flatListRef = useRef(null);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 10 || Math.abs(gestureState.dx) > 10,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 10 || Math.abs(gestureState.dx) > 10,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 60 && gesture.vy > 0.5) {
            handleClose();
          }
        },
      }),
    [handleClose],
  );

  const handleInputFocus = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleLongPress = (comment) => {
    const isOwn =
      comment?.user?.id &&
      String(comment.user.id) === String(currentUserId || user?.id);

    const actions = isOwn
      ? [
          { text: "Edit", onPress: () => onEditComment?.(comment) },
          {
            text: "Delete",
            onPress: () => onDeleteComment?.(comment),
            style: "destructive",
          },
          { text: "Cancel", style: "cancel" },
        ]
      : [
          { text: "Copy", onPress: () => onCopyComment?.(comment) },
          {
            text: "Report",
            onPress: () => onReportComment?.(comment),
            style: "destructive",
          },
          {
            text: "Hide comment",
            onPress: () => onHideComment?.(comment),
            style: "destructive",
          },
        ];

    Alert.alert(isOwn ? "Edit comment" : "Comment options", undefined, actions);
  };

  const renderComment = ({ item }) => (
    <CommentCard
      comment={item}
      currentUserId={currentUserId || user?.id}
      onLike={onLikeComment}
      onReply={handleReply}
      onViewReplies={onViewReplies}
      onUserPress={onUserPress}
      onLongPress={handleLongPress}
    />
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No comments yet</Text>
      <Text style={styles.emptyText}>Be the first to comment.</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      position="bottom"
      animationType="slide"
      style={[styles.modalContent, { paddingBottom: keyboardHeight }]}
    >
      <View
        style={styles.dragHandle}
        {...panResponder.panHandlers}
        accessibilityLabel="Drag to close"
      />

      <View style={styles.header}>
        <Text style={styles.title}>
          Comments{commentCount ? ` (${commentCount})` : ""}
        </Text>

        <Pressable onPress={handleClose} hitSlop={8} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#111111" />
        </Pressable>
      </View>

      <View style={styles.body}>
        {loading ? (
          <View style={styles.loader}>
            <Loader />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(item, index) =>
              String(item?.id || item?._id || index)
            }
            renderItem={renderComment}
            ListEmptyComponent={renderEmpty}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      <CommentInput
        value={inputValue}
        onChangeText={setInputValue}
        onSubmit={handleSubmit}
        onFocus={handleInputFocus}
        user={user}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
        keyboardAvoiding={false}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "72%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DDDDDD",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 2,
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
    flex: 1,
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    paddingVertical: 4,
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
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
