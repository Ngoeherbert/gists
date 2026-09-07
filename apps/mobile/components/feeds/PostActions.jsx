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
        <View style={styles.action}>
          <ReactionButton reacted={liked} count={likeCount} onPress={onLike} />
        </View>

        <View style={styles.action}>
          <CommentButton count={commentCount} onPress={onComment} />
        </View>

        <View style={styles.action}>
          <RepostButton
            reposted={reposted}
            count={repostCount}
            onPress={onRepost}
          />
        </View>

        <View style={styles.shareAction}>
          <ShareButton onPress={onShare} />
        </View>
      </View>

      <View style={styles.saveAction}>
        <SaveButton saved={saved} onPress={onSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  action: {
    marginRight: 12,
  },

  shareAction: {
    marginLeft: -8,
  },

  saveAction: {
    marginLeft: 12,
  },
});