import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import CommentCard from "../../../../components/comments/CommentCard";
import CommentInput from "../../../../components/comments/CommentInput";
import ReplyList from "../../../../components/comments/ReplyList";

import {
  posts as dummyPosts,
  currentUser,
} from "../../../../features/posts/dummyData";

const dummyComments = [
  {
    id: "comment-001",
    postId: "post-001",
    text: "This is really nice 🔥",
    liked: false,
    likeCount: 12,
    repliesCount: 2,
    user: {
      id: "user-002",
      name: "Sarah",
      username: "sarah",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
  },
  {
    id: "comment-002",
    postId: "post-001",
    text: "Love this! 👏",
    liked: true,
    likeCount: 8,
    repliesCount: 0,
    user: {
      id: "user-003",
      name: "Michael",
      username: "michael",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
  },
  {
    id: "comment-003",
    postId: "post-001",
    text: "Where was this taken?",
    liked: false,
    likeCount: 3,
    repliesCount: 1,
    user: {
      id: "user-004",
      name: "Jessica",
      username: "jessica",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
  },
];

const dummyReplies = {
  "comment-001": [
    {
      id: "reply-001",
      text: "I agree! 🔥",
      liked: false,
      likeCount: 2,
      user: {
        id: "user-004",
        name: "Jessica",
        username: "jessica",
        avatar: "https://i.pravatar.cc/150?img=32",
      },
    },
    {
      id: "reply-002",
      text: "Absolutely!",
      liked: false,
      likeCount: 1,
      user: {
        id: "user-005",
        name: "Daniel",
        username: "daniel",
        avatar: "https://i.pravatar.cc/150?img=68",
      },
    },
  ],

  "comment-003": [
    {
      id: "reply-003",
      text: "Looks like Buea to me.",
      liked: false,
      likeCount: 2,
      user: {
        id: "user-002",
        name: "Sarah",
        username: "sarah",
        avatar: "https://i.pravatar.cc/150?img=47",
      },
    },
  ],
};

export default function CommentsScreen() {
  const router = useRouter();
  const { postId, id } = useLocalSearchParams();

  const selectedPostId = String(postId || id || "");

  const post = useMemo(
    () =>
      dummyPosts.find(
        (item) => String(item?.id) === selectedPostId,
      ) || null,
    [selectedPostId],
  );

  const [comments, setComments] = useState(() =>
    dummyComments.filter(
      (comment) =>
        !selectedPostId ||
        String(comment.postId) === selectedPostId ||
        selectedPostId === "post-001",
    ),
  );

  const [commentText, setCommentText] = useState("");

  const [replyingTo, setReplyingTo] = useState(null);

  const [selectedReplies, setSelectedReplies] = useState(null);

  const [replies, setReplies] = useState(dummyReplies);

  // Pagination loading state.
  const [loadingMore, setLoadingMore] = useState(false);

  // Reply pagination loading state.
  const [replyLoading, setReplyLoading] = useState(false);

  // Comment/reply submission loading state.
  const [submitting, setSubmitting] = useState(false);

  // There are currently no more dummy comments to load.
  // Change this to true when real pagination is connected.
  const [hasMoreComments] = useState(false);

  // There are currently no more dummy replies to load.
  const [hasMoreReplies] = useState(false);

  const [menuComment, setMenuComment] = useState(null);

  const handleSubmitComment = (text) => {
    const trimmed = text.trim();

    if (!trimmed || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      if (replyingTo) {
        const newReply = {
          id: `reply-${Date.now()}`,
          text: trimmed,
          liked: false,
          likeCount: 0,
          user: {
            id: currentUser?.id,
            name: currentUser?.name,
            username: currentUser?.username,
            avatar: currentUser?.avatar,
          },
        };

        setReplies((current) => ({
          ...current,
          [replyingTo.id]: [
            ...(current[replyingTo.id] || []),
            newReply,
          ],
        }));

        setComments((current) =>
          current.map((comment) =>
            comment.id === replyingTo.id
              ? {
                  ...comment,
                  repliesCount:
                    (comment.repliesCount || 0) + 1,
                }
              : comment,
          ),
        );

        setReplyingTo(null);
        setCommentText("");

        return;
      }

      const newComment = {
        id: `comment-${Date.now()}`,
        postId: selectedPostId,
        text: trimmed,
        liked: false,
        likeCount: 0,
        repliesCount: 0,
        user: {
          id: currentUser?.id,
          name: currentUser?.name,
          username: currentUser?.username,
          avatar: currentUser?.avatar,
        },
      };

      setComments((current) => [
        newComment,
        ...current,
      ]);

      setCommentText("");
    } catch (error) {
      console.error(
        "Failed to submit comment:",
        error,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = (comment, liked) => {
    setComments((current) =>
      current.map((item) =>
        item.id === comment.id
          ? {
              ...item,
              liked,
              likeCount: Math.max(
                0,
                (item.likeCount || 0) +
                  (liked ? 1 : -1),
              ),
            }
          : item,
      ),
    );
  };

  const handleReply = (comment) => {
    setSelectedReplies(null);
    setReplyingTo(comment);
  };

  const handleViewReplies = (comment) => {
    setReplyingTo(null);
    setSelectedReplies(comment);
  };

  const handleMore = (comment) => {
    setMenuComment(comment);
  };

  const handleDeleteComment = () => {
    if (!menuComment) {
      return;
    }

    setComments((current) =>
      current.filter(
        (item) => item.id !== menuComment.id,
      ),
    );

    setMenuComment(null);
  };

  const handleLoadMore = () => {
    // No pagination available yet.
    // This prevents FlatList from repeatedly
    // putting the screen into a loading state.
    if (!hasMoreComments || loadingMore) {
      return;
    }

    setLoadingMore(true);

    setTimeout(() => {
      setLoadingMore(false);
    }, 700);
  };

  const handleLoadMoreReplies = () => {
    if (!hasMoreReplies || replyLoading) {
      return;
    }

    setReplyLoading(true);

    setTimeout(() => {
      setReplyLoading(false);
    }, 700);
  };

  const renderComment = ({ item }) => (
    <CommentCard
      comment={item}
      currentUserId={currentUser?.id}
      onLike={handleLikeComment}
      onReply={handleReply}
      onMore={handleMore}
      onViewReplies={handleViewReplies}
    />
  );

  const renderHeader = () => {
    if (!post) {
      return null;
    }

    const username =
      post.username ||
      post.user?.username ||
      post.userName;

    const text =
      post.caption ||
      post.content ||
      post.text;

    return (
      <View style={styles.postSummary}>
        <Text style={styles.postSummaryTitle}>
          {username ? `@${username}` : "Post"}
        </Text>

        {text ? (
          <Text
            style={styles.postSummaryText}
            numberOfLines={3}
          >
            {text}
          </Text>
        ) : null}

        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>
            Comments
          </Text>

          <Text style={styles.commentsCount}>
            {comments.length}
          </Text>
        </View>
      </View>
    );
  };

  if (selectedReplies) {
    const commentReplies =
      replies[selectedReplies.id] || [];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => setSelectedReplies(null)}
            style={styles.iconButton}
            hitSlop={10}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111111"
            />
          </Pressable>

          <Text style={styles.topBarTitle}>
            Replies
          </Text>

          <View style={styles.iconSpacer} />
        </View>

        <View style={styles.replyTarget}>
          <Text style={styles.replyTargetName}>
            {selectedReplies?.user?.name ||
              selectedReplies?.user?.username ||
              "Comment"}
          </Text>

          <Text
            style={styles.replyTargetText}
            numberOfLines={2}
          >
            {selectedReplies?.text ||
              selectedReplies?.content ||
              ""}
          </Text>
        </View>

        <View style={styles.replyListContainer}>
          <ReplyList
            replies={commentReplies}
            loading={replyLoading}
            currentUserId={currentUser?.id}
            onLike={(reply, liked) => {
              setReplies((current) => ({
                ...current,
                [selectedReplies.id]: (
                  current[selectedReplies.id] || []
                ).map((item) =>
                  item.id === reply.id
                    ? {
                        ...item,
                        liked,
                        likeCount: Math.max(
                          0,
                          (item.likeCount || 0) +
                            (liked ? 1 : -1),
                        ),
                      }
                    : item,
                ),
              }));
            }}
            onReply={handleReply}
            onMore={handleMore}
            onLoadMore={handleLoadMoreReplies}
            hasMore={hasMoreReplies}
          />
        </View>

        <CommentInput
          value={commentText}
          onChangeText={setCommentText}
          onSubmit={handleSubmitComment}
          user={currentUser}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          loading={submitting}
          placeholder="Write a reply..."
        />
      </SafeAreaView>
    );
  }

  if (!post && !selectedPostId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111111"
            />
          </Pressable>

          <Text style={styles.topBarTitle}>
            Comments
          </Text>

          <View style={styles.iconSpacer} />
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            Post not found
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>
              Go back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconButton}
          hitSlop={10}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111111"
          />
        </Pressable>

        <Text style={styles.topBarTitle}>
          Comments
        </Text>

        <View style={styles.iconSpacer} />
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item, index) =>
          String(
            item?.id || `comment-${index}`,
          )
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyComments}>
            <Ionicons
              name="chatbubble-outline"
              size={36}
              color="#AAAAAA"
            />

            <Text style={styles.emptyCommentsTitle}>
              No comments yet
            </Text>

            <Text style={styles.emptyCommentsText}>
              Be the first to share your thoughts.
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator
                size="small"
                color="#111111"
              />
            </View>
          ) : null
        }
        onEndReached={
          hasMoreComments
            ? handleLoadMore
            : undefined
        }
        onEndReachedThreshold={0.6}
        refreshing={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          comments.length === 0
            ? styles.emptyList
            : styles.list
        }
      />

      <CommentInput
        value={commentText}
        onChangeText={setCommentText}
        onSubmit={handleSubmitComment}
        user={currentUser}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        loading={submitting}
        placeholder={
          replyingTo
            ? "Write a reply..."
            : "Add a comment..."
        }
      />

      {menuComment && (
        <View style={styles.menuOverlay}>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuComment(null)}
          />

          <View style={styles.commentMenu}>
            <Pressable
              onPress={() => {
                setMenuComment(null);
                handleReply(menuComment);
              }}
              style={styles.menuItem}
            >
              <Ionicons
                name="return-down-forward-outline"
                size={20}
                color="#111111"
              />

              <Text style={styles.menuItemText}>
                Reply
              </Text>
            </Pressable>

            {String(menuComment?.user?.id) ===
              String(currentUser?.id) && (
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Delete comment",
                    "Are you sure you want to delete this comment?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress:
                          handleDeleteComment,
                      },
                    ],
                  );
                }}
                style={styles.menuItem}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#D64545"
                />

                <Text
                  style={[
                    styles.menuItemText,
                    styles.dangerText,
                  ]}
                >
                  Delete
                </Text>
              </Pressable>
            )}

            {String(menuComment?.user?.id) !==
              String(currentUser?.id) && (
              <Pressable
                onPress={() => {
                  setMenuComment(null);

                  Alert.alert(
                    "Report comment",
                    "Thanks. This comment has been reported.",
                  );
                }}
                style={styles.menuItem}
              >
                <Ionicons
                  name="flag-outline"
                  size={20}
                  color="#111111"
                />

                <Text style={styles.menuItemText}>
                  Report
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => setMenuComment(null)}
              style={[
                styles.menuItem,
                styles.cancelMenuItem,
              ]}
            >
              <Text style={styles.cancelMenuText}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  topBar: {
    height: 58,
    paddingHorizontal: 16,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  iconSpacer: {
    width: 40,
  },

  topBarTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },

  postSummary: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 4,
  },

  postSummaryTitle: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },

  postSummaryText: {
    marginTop: 5,
    color: "#555555",
    fontSize: 13,
    lineHeight: 19,
  },

  commentsHeader: {
    marginTop: 18,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  commentsTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
  },

  commentsCount: {
    marginLeft: 7,
    color: "#999999",
    fontSize: 13,
  },

  list: {
    paddingBottom: 16,
  },

  emptyList: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  emptyComments: {
    flex: 1,
    minHeight: 260,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCommentsTitle: {
    marginTop: 12,
    color: "#222222",
    fontSize: 17,
    fontWeight: "700",
  },

  emptyCommentsText: {
    marginTop: 6,
    color: "#999999",
    fontSize: 13,
    textAlign: "center",
  },

  loadingFooter: {
    paddingVertical: 18,
    alignItems: "center",
  },

  replyTarget: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F7F7F7",
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },

  replyTargetName: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },

  replyTargetText: {
    marginTop: 4,
    color: "#666666",
    fontSize: 13,
    lineHeight: 19,
  },

  replyListContainer: {
    flex: 1,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    color: "#111111",
    fontSize: 19,
    fontWeight: "700",
  },

  emptyButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    justifyContent: "flex-end",
  },

  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  commentMenu: {
    marginHorizontal: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },

  menuItem: {
    minHeight: 52,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
  },

  menuItemText: {
    marginLeft: 12,
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },

  dangerText: {
    color: "#D64545",
  },

  cancelMenuItem: {
    justifyContent: "center",
    borderBottomWidth: 0,
  },

  cancelMenuText: {
    color: "#777777",
    fontSize: 15,
    fontWeight: "600",
  },
});
