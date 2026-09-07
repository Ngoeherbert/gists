// apps/mobile/components/comments/CommentModal.jsx

import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "../common/Modal";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

export default function CommentModal({
  visible = false,
  onClose,
  comments = [],
  user,
  loading = false,
  post,
  onSubmitComment,
  onLikeComment,
  onReplyComment,
  onViewReplies,
  onEditComment,
  onDeleteComment,
  onReportComment,
  onCopyComment,
  currentUserId,
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [inputValue, setInputValue] = useState("");

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

  const handleClose = () => {
    setReplyingTo(null);
    setInputValue("");
    onClose?.();
  };

  const renderComment = ({ item }) => (
    <CommentCard
      comment={item}
      currentUserId={currentUserId || user?.id}
      onLike={onLikeComment}
      onReply={handleReply}
      onViewReplies={onViewReplies}
      onMore={(comment) => {
        // The parent screen can use the callbacks below to open
        // its own menu/confirmation UI.
        if (
          comment?.user?.id &&
          String(comment.user.id) === String(currentUserId || user?.id)
        ) {
          onEditComment?.(comment);
        } else {
          onReportComment?.(comment);
        }
      }}
    />
  );

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={`Comments${commentCount ? ` (${commentCount})` : ""}`}
      position="bottom"
      fullHeight
    >
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loading ? (
          <View style={styles.loader}>
            <Loader />
          </View>
        ) : comments.length === 0 ? (
          <EmptyState
            title="No comments yet"
            message="Be the first to share your thoughts."
          />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item, index) =>
              String(item?.id || item?._id || index)
            }
            renderItem={renderComment}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}

        <CommentInput
          value={inputValue}
          onChangeText={setInputValue}
          onSubmit={handleSubmit}
          user={user}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 300,
  },
  list: {
    paddingVertical: 4,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
