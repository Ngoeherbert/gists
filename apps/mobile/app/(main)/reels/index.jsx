import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import useReelStore from "../../../stores/reelStore";
import useAuthStore from "../../../stores/authStore";

import ReelCard from "../../../components/reels/ReelCard";
import ReelCommentModal from "../../../components/reels/ReelCommentModal";
import ReelMenu from "../../../components/reels/ReelMenu";

const REEL_DUMMY = [
  {
    id: "reel-101",
    userId: "user-002",
    user: {
      id: "user-002",
      name: "Sarah Williams",
      username: "sarahw",
      avatar: "https://i.pravatar.cc/150?img=47",
      verified: true,
    },
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    caption: "Sunset vibes at the beach 🌊",
    music: { title: "Ocean Waves", artist: "Nature Sounds" },
    liked: false,
    likeCount: 1240,
    commentCount: 45,
    reposted: false,
    repostCount: 12,
    saved: false,
    comments: [
      { id: "c1", user: { name: "Mike" }, text: "This is amazing!" },
      { id: "c2", user: { name: "Jess" }, text: "Love the vibes 🔥" },
    ],
  },
  {
    id: "reel-102",
    userId: "user-003",
    user: {
      id: "user-003",
      name: "Michael Chen",
      username: "mchen",
      avatar: "https://i.pravatar.cc/150?img=11",
      verified: false,
    },
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    caption: "City lights never sleep ✨",
    music: { title: "Midnight City", artist: "M83" },
    liked: true,
    likeCount: 856,
    commentCount: 23,
    reposted: true,
    repostCount: 5,
    saved: true,
    comments: [{ id: "c3", user: { name: "Anna" }, text: "Great shot!" }],
  },
  {
    id: "reel-103",
    userId: "user-004",
    user: {
      id: "user-004",
      name: "Jessica Park",
      username: "jpark",
      avatar: "https://i.pravatar.cc/150?img=32",
      verified: true,
    },
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "Weekend adventure with friends 🏔️",
    music: { title: "Adventure Awaits", artist: "Travel Beats" },
    liked: false,
    likeCount: 2341,
    commentCount: 89,
    reposted: false,
    repostCount: 34,
    saved: false,
    comments: [],
  },
];

export default function ReelsScreen() {
  const router = useRouter();
  const reels = useReelStore((state) => state.reels);
  const addReel = useReelStore((state) => state.addReel);
  const updateReel = useReelStore((state) => state.updateReel);
  const setActiveReel = useReelStore((state) => state.setActiveReel);
  const togglePlaying = useReelStore((state) => state.togglePlaying);
  const isMuted = useReelStore((state) => state.isMuted);

  const [refreshing, setRefreshing] = useState(false);
  const [activeReelId, setActiveReelId] = useState(null);
  const [commentReel, setCommentReel] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [menuReel, setMenuReel] = useState(null);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const flatListRef = useRef(null);
  const lastTapRef = useRef({ current: null, time: 0 });
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (reels.length === 0) {
      REEL_DUMMY.forEach((reel) => addReel(reel));
    }
  }, [reels.length, addReel]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ changed }) => {
      const visible = changed.filter((item) => item.isViewable);
      if (visible.length > 0) {
        const reel = visible[0].item;
        setActiveReelId(reel.id);
        setActiveReel(reel.id);
      }
    },
    [setActiveReel],
  );

  const handleLike = useCallback(
    (reel) => {
      updateReel(reel.id, {
        liked: !reel.liked,
        likeCount: Math.max(0, (reel.likeCount || 0) + (reel.liked ? -1 : 1)),
      });
    },
    [updateReel],
  );

  const handleComment = useCallback((reel) => {
    setCommentReel(reel);
    setCommentText("");
  }, []);

  const handleCloseComments = useCallback(() => {
    setCommentReel(null);
    setCommentText("");
  }, []);

  const handleSendComment = useCallback(() => {
    if (!commentReel || !commentText.trim()) return;

    const latestReel =
      reels.find((reel) => reel.id === commentReel.id) ?? commentReel;
    const newComment = {
      id: `comment-${Date.now()}`,
      user: currentUser,
      text: commentText.trim(),
    };

    updateReel(commentReel.id, {
      comments: [...(latestReel?.comments || []), newComment],
      commentCount: (latestReel?.commentCount || 0) + 1,
    });

    setCommentText("");
    setCommentReel(null);
  }, [commentReel, commentText, currentUser, reels, updateReel]);

  const handleRepost = useCallback(
    (reel) => {
      updateReel(reel.id, {
        reposted: !reel.reposted,
        repostCount: Math.max(
          0,
          (reel.repostCount || 0) + (reel.reposted ? -1 : 1),
        ),
      });
    },
    [updateReel],
  );

  const handleShare = useCallback((reel) => {
    Alert.alert("Share", "Share sheet coming soon.");
  }, []);

  const handleSave = useCallback(
    (reel) => {
      updateReel(reel.id, {
        saved: !reel.saved,
      });
    },
    [updateReel],
  );

  const handleMore = useCallback((reel) => {
    setMenuReel(reel);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuReel(null);
  }, []);

  const handleReport = useCallback(() => {
    setMenuReel(null);
    Alert.alert("Reported", "Thank you for your feedback.");
  }, []);

  const handleNotInterested = useCallback(() => {
    setMenuReel(null);
  }, []);

  const handleDeleteReel = useCallback(() => {
    if (!menuReel) return;
    updateReel(menuReel.id, { deleted: true });
    setMenuReel(null);
  }, [menuReel, updateReel]);

  const handleCardPress = useCallback(
    (reel) => {
      const now = Date.now();
      const last = lastTapRef.current;
      const timeDiff = now - last.time;
      lastTapRef.current = { current: reel.id, time: now };

      if (last.current === reel.id && timeDiff < 300) {
        handleLike(reel);
      }
    },
    [handleLike],
  );

  const handleLongPress = useCallback(
    (reel) => {
      togglePlaying();
    },
    [togglePlaying],
  );

  const handleUserPress = useCallback(
    (reel) => {
      const user = reel.user || {};
      const userId = user.id || reel.userId;
      if (userId) {
        router.push(`/(main)/feeds/profile/${userId}`);
      }
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const active = activeReelId === item.id;
      return (
        <ReelCard
          reel={item}
          active={active}
          muted={isMuted}
          onPress={() => handleCardPress(item)}
          onUserPress={handleUserPress}
          onLike={() => handleLike(item)}
          onComment={() => handleComment(item)}
          onRepost={() => handleRepost(item)}
          onShare={() => handleShare(item)}
          onSave={() => handleSave(item)}
          onMore={() => handleMore(item)}
          onLongPress={() => handleLongPress(item)}
        />
      );
    },
    [
      activeReelId,
      isMuted,
      handleCardPress,
      handleUserPress,
      handleLike,
      handleComment,
      handleRepost,
      handleShare,
      handleSave,
      handleMore,
      handleLongPress,
    ],
  );

  const keyExtractor = useCallback(
    (item, index) => String(item.id ?? index),
    [],
  );

  const listEmptyComponent = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No reels yet</Text>
        <Text style={styles.emptyText}>Check back later for new reels.</Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <FlatList
        ref={flatListRef}
        data={reels.filter((item) => !item.deleted)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={styles.listContent}
      />

      <ReelCommentModal
        visible={Boolean(commentReel)}
        comments={commentReel?.comments || []}
        value={commentText}
        onChangeText={setCommentText}
        onSubmit={handleSendComment}
        onClose={handleCloseComments}
      />

      <ReelMenu
        visible={Boolean(menuReel)}
        onClose={handleCloseMenu}
        onSave={() => menuReel && handleSave(menuReel)}
        onNotInterested={handleNotInterested}
        onReport={handleReport}
        onDelete={handleDeleteReel}
        canDelete={menuReel?.userId === currentUser?.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  listContent: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
