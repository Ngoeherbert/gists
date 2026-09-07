// apps/mobile/components/reels/ReelCard.jsx
import { StyleSheet, View } from "react-native";
import ReelActions from "./ReelActions";
import ReelCaption from "./ReelCaption";
import ReelHeader from "./ReelHeader";
import ReelMusic from "./ReelMusic";
import ReelVideo from "./ReelVideo";

export default function ReelCard({
  reel,
  active = false,
  muted = false,
  onPress,
  onUserPress,
  onLike,
  onComment,
  onRepost,
  onShare,
  onSave,
  onMute,
  onMore,
}) {
  if (!reel) return null;

  const user = reel.user || {};

  const username =
    user.username || reel.username || user.name || reel.userName || "User";

  const videoUri =
    reel.videoUrl ||
    reel.video ||
    reel.uri ||
    reel.media?.uri ||
    reel.media?.url;

  return (
    <View style={styles.container}>
      <ReelVideo
        uri={videoUri}
        active={active}
        muted={muted}
        onPress={onPress}
        onMutePress={onMute}
      />

      <View style={styles.top}>
        <ReelHeader
          user={user}
          username={username}
          onUserPress={() => onUserPress?.(reel, user)}
          onMorePress={() => onMore?.(reel)}
        />
      </View>

      <View style={styles.bottom}>
        <View style={styles.info}>
          <ReelCaption
            username={`@${String(username).replace(/^@/, "")}`}
            caption={reel.caption || reel.text || reel.content}
          />

          {reel.music || reel.song ? (
            <ReelMusic music={reel.music || reel.song} />
          ) : null}
        </View>

        <ReelActions
          liked={Boolean(reel.liked || reel.isLiked)}
          likeCount={reel.likeCount || reel.likesCount || 0}
          commentCount={reel.commentCount || reel.commentsCount || 0}
          reposted={Boolean(reel.reposted || reel.isReposted)}
          repostCount={reel.repostCount || reel.repostsCount || 0}
          saved={Boolean(reel.saved || reel.isSaved)}
          onLike={() => onLike?.(reel)}
          onComment={() => onComment?.(reel)}
          onRepost={() => onRepost?.(reel)}
          onShare={() => onShare?.(reel)}
          onSave={() => onSave?.(reel)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  top: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 12,
    bottom: 20,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  info: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 16,
    paddingRight: 10,
  },
});
