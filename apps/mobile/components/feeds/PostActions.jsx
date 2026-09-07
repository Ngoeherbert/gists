// apps/mobile/components/feeds/PostActions.jsx
import { StyleSheet, View } from "react-native";
import CommentButton from "./CommentButton";
import ReactionButton from "./ReactionButton";
import RepostButton from "./RepostButton";
import SaveButton from "./SaveButton";
import ShareButton from "./ShareButton";

export default function PostActions({
  liked = false,
  likeCount = 0,
  commentCount = 0,
  reposted = false,
  repostCount = 0,
  saved = false,
  onLike,
  onComment,
  onRepost,
  onShare,
  onSave,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.leftActions}>
        <ReactionButton reacted={liked} count={likeCount} onPress={onLike} />

        <CommentButton count={commentCount} onPress={onComment} />

        <RepostButton
          reposted={reposted}
          count={repostCount}
          onPress={onRepost}
        />

        <ShareButton onPress={onShare} />
      </View>

      <SaveButton saved={saved} onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
