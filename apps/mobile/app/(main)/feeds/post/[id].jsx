import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import PostHeader from "../../../../components/feeds/PostHeader";
import PostMedia from "../../../../components/feeds/PostMedia";
import PostActions from "../../../../components/feeds/PostActions";
import PostCaption from "../../../../components/feeds/PostCaption";
import PostMenu from "../../../../components/feeds/PostMenu";

import {
  posts as dummyPosts,
  currentUser,
} from "../../../../features/posts/dummyData";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id, postId } = useLocalSearchParams();

  const selectedPostId = String(id || postId || "");

  const originalPost = useMemo(
    () =>
      dummyPosts.find((post) => String(post?.id) === selectedPostId) || null,
    [selectedPostId],
  );

  const [post, setPost] = useState(originalPost);
  const [menuVisible, setMenuVisible] = useState(false);

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>

          <Text style={styles.topBarTitle}>Post</Text>

          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.notFound}>
          <Ionicons name="document-text-outline" size={42} color="#999999" />

          <Text style={styles.notFoundTitle}>Post not found</Text>

          <Text style={styles.notFoundText}>
            This post may have been deleted or is no longer available.
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={styles.backToFeedButton}
          >
            <Text style={styles.backToFeedText}>Back to feed</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const user = post.user || {
    id: post.userId,
    name: post.userName,
    username: post.username,
    avatar: post.userAvatar,
    photo: post.userPhoto,
  };

  const mediaUri =
    post.mediaUrl || post.image || post.media?.uri || post.media?.url;

  const isOwnPost = String(post.userId) === String(currentUser?.id);

  const updatePost = (changes) => {
    setPost((current) => ({
      ...current,
      ...changes,
    }));
  };

  const handleLike = () => {
    const liked = !(post.liked || post.isLiked);

    const currentCount = Number(post.likeCount ?? post.likesCount ?? 0);

    updatePost({
      liked,
      isLiked: liked,
      likeCount: Math.max(0, currentCount + (liked ? 1 : -1)),
    });
  };

  const handleComment = () => {
    router.push({
      pathname: "/(main)/feeds/post/comments",
      params: {
        postId: String(post.id),
      },
    });
  };

  const handleRepost = () => {
    const reposted = !(post.reposted || post.isReposted);

    const currentCount = Number(post.repostCount ?? post.repostsCount ?? 0);

    updatePost({
      reposted,
      isReposted: reposted,
      repostCount: Math.max(0, currentCount + (reposted ? 1 : -1)),
    });
  };

  const handleSave = () => {
    const saved = !(post.saved || post.isSaved);

    updatePost({
      saved,
      isSaved: saved,
    });
  };

  const handleShare = () => {
    Alert.alert(
      "Share post",
      "Post sharing will be connected to the sharing system later.",
    );
  };

  const handleDelete = () => {
    setMenuVisible(false);

    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          router.back();
        },
      },
    ]);
  };

  const handleReport = () => {
    Alert.alert("Report post", "Thanks. This post has been reported.");
  };

  const handleNotInterested = () => {
    Alert.alert("Not interested", "We will show you fewer posts like this.");
    router.back();
  };

  const handleEdit = () => {
    setMenuVisible(false);

    router.push({
      pathname: "/(main)/feeds/post/edit",
      params: {
        postId: String(post.id),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text style={styles.topBarTitle}>Post</Text>

        <Pressable
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
          hitSlop={10}
        >
          <Ionicons name="ellipsis-horizontal" size={23} color="#111111" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PostHeader
          user={user}
          timestamp={post.timestamp || post.createdAt}
          location={post.location}
          verified={Boolean(post.user?.verified || post.verified)}
          onUserPress={() => {
            const userId = user?.id || post.userId;

            if (!userId) return;

            router.push({
              pathname: "/(main)/profile",
              params: {
                userId: String(userId),
              },
            });
          }}
        />

        {mediaUri ? (
          <PostMedia
            uri={mediaUri}
            type={post.mediaType || post.media?.type || "image"}
            aspectRatio={post.aspectRatio || 1}
          />
        ) : null}

        <PostActions
          liked={Boolean(post.liked || post.isLiked)}
          likeCount={post.likeCount || post.likesCount || 0}
          commentCount={post.commentCount || post.commentsCount || 0}
          reposted={Boolean(post.reposted || post.isReposted)}
          repostCount={post.repostCount || post.repostsCount || 0}
          saved={Boolean(post.saved || post.isSaved)}
          onLike={handleLike}
          onComment={handleComment}
          onRepost={handleRepost}
          onShare={handleShare}
          onSave={handleSave}
        />

        <PostCaption
          username={post.username || user?.username}
          text={post.caption || post.content || post.text}
        />

        <Pressable onPress={handleComment} style={styles.commentsButton}>
          <Text style={styles.commentsButtonText}>
            View all {post.commentCount || post.commentsCount || 0} comments
          </Text>

          <Ionicons name="chevron-forward" size={17} color="#777777" />
        </Pressable>
      </ScrollView>

      <PostMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSave={handleSave}
        onReport={handleReport}
        onNotInterested={handleNotInterested}
        onDelete={isOwnPost ? handleDelete : undefined}
        canDelete={isOwnPost}
      />

      {isOwnPost && (
        <Pressable onPress={handleEdit} style={styles.editButton}>
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />

          <Text style={styles.editButtonText}>Edit post</Text>
        </Pressable>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  menuButton: {
    width: 40,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  topBarSpacer: {
    width: 40,
  },

  topBarTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  commentsButton: {
    marginHorizontal: 16,
    marginTop: 2,
    paddingVertical: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  commentsButtonText: {
    color: "#777777",
    fontSize: 14,
  },

  editButton: {
    position: "absolute",
    right: 18,
    bottom: 20,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: "#111111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  notFound: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundTitle: {
    marginTop: 14,
    color: "#111111",
    fontSize: 20,
    fontWeight: "700",
  },

  notFoundText: {
    maxWidth: 320,
    marginTop: 7,
    color: "#888888",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  backToFeedButton: {
    marginTop: 24,
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 23,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  backToFeedText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
