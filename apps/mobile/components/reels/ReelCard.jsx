import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ReelActions from "./ReelActions";
import ReelCaption from "./ReelCaption";
import ReelMusic from "./ReelMusic";
import ReelVideo from "./ReelVideo";

export default function ReelCard({
  reel,
  active = false,
  muted = false,
  playing = true,
  bottomInset = 20,
  onPress,
  onUserPress,
  onLike,
  onComment,
  onRepost,
  onShare,
  onSave,
  onMute,
  onMore,
  onPlayPress,
}) {
  const [isFollowing, setIsFollowing] = useState(false);

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
        playing={playing}
        onPress={onPress}
        onMutePress={onMute}
        onPlayPress={onPlayPress}
      />

      <View pointerEvents="none" style={styles.overlay}>
        <View style={styles.overlayFade} />
      </View>

      <View style={[styles.bottom, { bottom: bottomInset }]}>
        <View style={styles.info}>
          <View style={styles.userSection}>
            <Pressable onPress={() => onUserPress?.(reel)} hitSlop={8}>
              <Image
                source={{
                  uri: user.avatar || user.profilePicture,
                }}
                style={styles.avatar}
              />
            </Pressable>

            <View style={styles.userInfo}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View>
                  <Text style={styles.name}>
                    {user.name || user.fullName || "User"}
                  </Text>
                  <Text style={styles.handle}>@{username}</Text>
                </View>

                <Pressable
                  onPress={() => setIsFollowing(!isFollowing)}
                  style={[styles.followBtn, isFollowing && styles.followingBtn]}
                >
                  <Text
                    style={[
                      styles.followText,
                      isFollowing && styles.followingText,
                    ]}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <ReelCaption caption={reel.caption || reel.text || reel.content} />

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
          onMore={onMore}
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
    backgroundColor: "#050505",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  overlayFade: {
    width: "100%",
    height: "42%",
    backgroundColor: "rgba(0,0,0,0.62)",
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
    gap: 4,
  },
  name: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  handle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  followBtn: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
  followingBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 0,
  },
  followText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  followingText: {
    color: "#ffffff",
  },
  info: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
});
