// apps/mobile/components/feeds/PostCard.jsx
import { StyleSheet, View } from "react-native";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";

export default function PostCard({
  post,
  onUserPress,
  onMenuPress,
  onMediaPress,
  onLike,
  onComment,
  onRepost,
  onShare,
  onSave,
}) {
  if (!post) return null;

  const user = post.user || {
    name: post.userName,
    username: post.username,
    avatar: post.userAvatar,
    photo: post.userPhoto,
  };

  const mediaUri =
    post.mediaUrl || post.image || post.media?.uri || post.media?.url;

  return (
    <View style={styles.card}>
      <PostHeader
        user={user}
        timestamp={post.timestamp || post.createdAt}
        location={post.location}
        verified={Boolean(post.user?.verified || post.verified)}
        onUserPress={() => onUserPress?.(post, user)}
        onMenuPress={() => onMenuPress?.(post)}
      />

      {mediaUri ? (
        <PostMedia
          uri={mediaUri}
          type={post.mediaType || post.media?.type || "image"}
          aspectRatio={post.aspectRatio || 1}
          muted={post.muted}
          onPress={() => onMediaPress?.(post)}
        />
      ) : null}

      <PostActions
        liked={Boolean(post.liked || post.isLiked)}
        likeCount={post.likeCount || post.likesCount || 0}
        commentCount={post.commentCount || post.commentsCount || 0}
        reposted={Boolean(post.reposted || post.isReposted)}
        repostCount={post.repostCount || post.repostsCount || 0}
        saved={Boolean(post.saved || post.isSaved)}
        onLike={() => onLike?.(post)}
        onComment={() => onComment?.(post)}
        onRepost={() => onRepost?.(post)}
        onShare={() => onShare?.(post)}
        onSave={() => onSave?.(post)}
      />

      <PostCaption
        username={post.username || user?.username}
        text={post.caption || post.content || post.text}
        maxLines={post.maxCaptionLines || undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
});
