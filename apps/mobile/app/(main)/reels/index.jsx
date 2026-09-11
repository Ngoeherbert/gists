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
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useReelStore } from "../../../stores/reelStore";
import { useAuthStore } from "../../../stores/authStore";

import ReelCard from "../../../components/reels/ReelCard";
import ReelCommentModal from "../../../components/reels/ReelCommentModal";
import ReelMenu from "../../../components/reels/ReelMenu";

import {
  reels as REEL_DUMMY,
  currentUser as DUMMY_CURRENT_USER,
} from "../../../features/posts/dummyData";

export default function ReelsScreen() {
  const router = useRouter();
  const reels = useReelStore((state) => state.reels);
  const addReel = useReelStore((state) => state.addReel);
  const updateReel = useReelStore((state) => state.updateReel);
  const setActiveReel = useReelStore((state) => state.setActiveReel);
  const isPlaying = useReelStore((state) => state.isPlaying);
  const togglePlaying = useReelStore((state) => state.togglePlaying);
  const autoSkip = useReelStore((state) => state.autoSkip);
  const toggleAutoSkip = useReelStore((state) => state.toggleAutoSkip);
  const isMuted = useReelStore((state) => state.isMuted);

  const [refreshing, setRefreshing] = useState(false);
  const [activeReelId, setActiveReelId] = useState(null);
  const [commentReel, setCommentReel] = useState(null);
  const [menuReel, setMenuReel] = useState(null);
  const [itemHeight, setItemHeight] = useState(0);
  const [feedTab, setFeedTab] = useState("for-you");

  // Position the reel's info + action buttons toward the bottom of the
  // screen, sitting just above the translucent bottom navbar (68px pill +
  // container padding). Combined with the card's internal 40px padding this
  // places the content right above the nav instead of floating higher up.
  const REEL_BOTTOM_INSET = 48;

  // Simulated reel playback duration used by the "auto-skip next reel"
  // preference. Reels are rendered as poster images right now, so there is
  // no real video progress to hook into; once real playback is wired up
  // this should be replaced with onPlaybackStatusUpdate + durationMillis.
  const REEL_AUTO_SKIP_MS = 6000;

  // Upper bound (ms) applied when a reel exposes a real duration, so the
  // auto-skip never feels too slow in the demo feed.
  const REEL_AUTO_SKIP_MAX_MS = 15000;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
  const flatListRef = useRef(null);
  const lastTapRef = useRef({ current: null, time: 0 });
  const visibleReelsRef = useRef([]);
  const authUser = useAuthStore((state) => state.user);

  // The current user is fetched from auth storage. In this dummy app the auth
  // store can be empty, so fall back to (and merge with) the seeded dummy user
  // to guarantee a real profile image is shown in the comment input.
  const currentUser = useMemo(() => {
    const base = authUser
      ? { ...DUMMY_CURRENT_USER, ...authUser }
      : DUMMY_CURRENT_USER;
    return {
      id: base.id || DUMMY_CURRENT_USER.id,
      name: base.name || DUMMY_CURRENT_USER.name,
      username: base.username || DUMMY_CURRENT_USER.username,
      avatar: base.avatar || DUMMY_CURRENT_USER.avatar,
      verified: Boolean(base.verified ?? DUMMY_CURRENT_USER.verified),
    };
  }, [authUser]);

  useEffect(() => {
    if (reels.length === 0) {
      [...REEL_DUMMY].reverse().forEach((reel) => addReel(reel));
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
  }, []);

  const handleCloseComments = useCallback(() => {
    setCommentReel(null);
  }, []);

  const activeCommentReel = useMemo(() => {
    if (!commentReel) {
      return null;
    }

    return (
      reels.find((reel) => String(reel.id) === String(commentReel.id)) ||
      commentReel
    );
  }, [commentReel, reels]);

  const handleSendComment = useCallback(
    ({ text, parentId, comment }) => {
      if (!commentReel || !text?.trim()) {
        return;
      }

      const latestReel =
        reels.find((reel) => reel.id === commentReel.id) ?? commentReel;

      const newComment = {
        id: `comment-${Date.now()}`,
        user: {
          id: currentUser?.id,
          name: currentUser?.name,
          username: currentUser?.username,
          avatar: currentUser?.avatar,
          verified: Boolean(currentUser?.verified),
        },
        text: text.trim(),
        liked: false,
        likeCount: 0,
      };

      const updatedComments = [...(latestReel?.comments || [])];

      if (parentId) {
        const parentIndex = updatedComments.findIndex(
          (reelComment) => String(reelComment.id) === String(parentId),
        );

        if (parentIndex >= 0) {
          const parent = updatedComments[parentIndex];
          updatedComments[parentIndex] = {
            ...parent,
            replies: [...(parent.replies || []), newComment],
            repliesCount: (parent.repliesCount ?? parent.replyCount ?? 0) + 1,
          };
        } else {
          updatedComments.push(newComment);
        }
      } else {
        updatedComments.push(newComment);
      }

      updateReel(commentReel.id, {
        comments: updatedComments,
        commentCount: (latestReel?.commentCount || 0) + 1,
      });

      setCommentReel(null);
    },
    [commentReel, currentUser, reels, updateReel],
  );

  const handleLikeComment = useCallback(
    (comment, liked) => {
      if (!commentReel) {
        return;
      }

      const latestReel =
        reels.find((reel) => reel.id === commentReel.id) ?? commentReel;

      const updateComments = (reelComments) =>
        reelComments.map((reelComment) => {
          if (String(reelComment.id) === String(comment.id)) {
            return {
              ...reelComment,
              liked,
              likeCount: Math.max(
                0,
                (reelComment.likeCount || 0) + (liked ? 1 : -1),
              ),
            };
          }
          return reelComment;
        });

      updateReel(commentReel.id, {
        comments: updateComments(latestReel?.comments || []),
      });
    },
    [commentReel, reels, updateReel],
  );

  const handleReportComment = useCallback((comment) => {
    Alert.alert(
      "Report",
      "Thanks for letting us know. We'll review this comment.",
    );
  }, []);

  const handleEditComment = useCallback((comment) => {
    Alert.alert("Edit", "Editing comments will be available soon.");
  }, []);

  const handleDeleteComment = useCallback(
    (comment) => {
      if (!commentReel) {
        return;
      }

      const latestReel =
        reels.find((reel) => reel.id === commentReel.id) ?? commentReel;

      updateReel(commentReel.id, {
        comments: (latestReel?.comments || []).filter(
          (reelComment) => String(reelComment.id) !== String(comment.id),
        ),
        commentCount: Math.max(0, (latestReel?.commentCount || 0) - 1),
      });
    },
    [commentReel, reels, updateReel],
  );

  const handleCopyComment = useCallback((comment) => {
    const text = comment?.text || comment?.content || "";
    if (text) {
      Alert.alert("Copied", "Comment text copied to clipboard.");
    }
  }, []);

  const handleHideComment = useCallback(
    (comment) => {
      if (!commentReel) {
        return;
      }

      const latestReel =
        reels.find((reel) => reel.id === commentReel.id) ?? commentReel;

      updateReel(commentReel.id, {
        comments: (latestReel?.comments || []).map((reelComment) =>
          String(reelComment.id) === String(comment.id)
            ? { ...reelComment, hidden: true }
            : reelComment,
        ),
      });
    },
    [commentReel, reels, updateReel],
  );

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
    (item) => {
      const user = item?.user || {};
      const userId = user?.id || item?.userId;

      if (!userId) {
        return;
      }

      // Dismiss the comment sheet / reel menu before navigating so the
      // profile screen is not opened underneath a still-visible modal.
      setCommentReel(null);
      setMenuReel(null);

      router.push({
        pathname: "/(main)/feeds/profile/[userId]",
        params: {
          userId: String(userId),
          user: JSON.stringify(user || {}),
        },
      });
    },
    [router],
  );

  const handleDownload = useCallback(() => {
    setMenuReel(null);
    Alert.alert(
      "Downloading reel",
      "The reel is being saved to your device. You'll find it in your gallery when it's ready.",
    );
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      const active = activeReelId === item.id;
      return (
        <View style={[styles.item, itemHeight ? { height: itemHeight } : null]}>
          <ReelCard
            reel={item}
            active={active}
            muted={isMuted}
            playing={isPlaying}
            bottomInset={REEL_BOTTOM_INSET}
            onPress={() => handleCardPress(item)}
            onUserPress={handleUserPress}
            onLike={() => handleLike(item)}
            onComment={() => handleComment(item)}
            onRepost={() => handleRepost(item)}
            onShare={() => handleShare(item)}
            onSave={() => handleSave(item)}
            onMore={() => handleMore(item)}
            onLongPress={() => handleLongPress(item)}
            onPlayPress={togglePlaying}
          />
        </View>
      );
    },
    [
      activeReelId,
      isMuted,
      isPlaying,
      togglePlaying,
      itemHeight,
      REEL_BOTTOM_INSET,
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

  const getItemLayout = useCallback(
    (data, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const listEmptyComponent = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No reels yet</Text>
        <Text style={styles.emptyText}>
          {feedTab === "following"
            ? "Reels from people you follow will appear here."
            : "Check back later for new reels."}
        </Text>
      </View>
    ),
    [feedTab],
  );

  // Feed mode filtering: "For You" shows everything, "Following" shows
  // reels from accounts you follow (falls back to the full list when no
  // follow information is available on the reel).
  const visibleReels = useMemo(() => {
    const active = reels.filter((item) => !item.deleted);

    if (feedTab !== "following") {
      return active;
    }

    const followed = active.filter(
      (item) => item.user?.following || item.user?.isFollowing,
    );

    return followed;
  }, [reels, feedTab]);

  useEffect(() => {
    visibleReelsRef.current = visibleReels;
  }, [visibleReels]);

  // Auto-skip: when enabled, advance to the next reel once the current one's
  // playback finishes. The timer is paused whenever playback is paused or the
  // comment sheet is open, and restarts whenever the active reel changes.
  useEffect(() => {
    if (!autoSkip || !isPlaying || !activeReelId || commentReel) {
      return undefined;
    }

    const latestVisibleReels = visibleReelsRef.current;
    const currentIndex = latestVisibleReels.findIndex(
      (reel) => reel.id === activeReelId,
    );

    if (currentIndex < 0 || latestVisibleReels.length < 2) {
      return undefined;
    }

    const activeReel = latestVisibleReels[currentIndex];
    // Honour a real duration (seconds) when the reel carries one, otherwise
    // fall back to the simulated playback duration.
    const delayMs = activeReel?.duration
      ? Math.min(REEL_AUTO_SKIP_MAX_MS, activeReel.duration * 1000)
      : REEL_AUTO_SKIP_MS;

    const timer = setTimeout(() => {
      const latestVisibleReelsAtTimeout = visibleReelsRef.current;
      const latestCurrentIndex = latestVisibleReelsAtTimeout.findIndex(
        (reel) => reel.id === activeReelId,
      );

      if (latestCurrentIndex < 0 || latestVisibleReelsAtTimeout.length < 2) {
        return;
      }

      const nextIndex =
        (latestCurrentIndex + 1) % latestVisibleReelsAtTimeout.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, delayMs);

    return () => clearTimeout(timer);
  }, [
    autoSkip,
    isPlaying,
    activeReelId,
    commentReel,
    visibleReels.length,
    REEL_AUTO_SKIP_MS,
    REEL_AUTO_SKIP_MAX_MS,
  ]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Feed mode switch: For You / Following */}
      <View style={styles.feedTabs}>
        {[
          { key: "for-you", label: "For You" },
          { key: "following", label: "Following" },
        ].map((tab) => {
          const active = feedTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setFeedTab(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              hitSlop={8}
              style={styles.feedTab}
            >
              <Text
                style={[
                  styles.feedTabLabel,
                  active && styles.feedTabLabelActive,
                ]}
              >
                {tab.label}
              </Text>

              {active ? <View style={styles.feedTabIndicator} /> : null}
            </Pressable>
          );
        })}
      </View>

      <FlatList
        ref={flatListRef}
        data={visibleReels}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={itemHeight ? getItemLayout : undefined}
        snapToInterval={itemHeight || undefined}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={styles.listContent}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height && height !== itemHeight) {
            setItemHeight(height);
          }
        }}
      />

      <ReelCommentModal
        visible={Boolean(commentReel)}
        comments={(activeCommentReel?.comments || []).filter(
          (commentItem) => !commentItem?.hidden,
        )}
        user={currentUser}
        currentUserId={currentUser?.id}
        post={activeCommentReel}
        onUserPress={handleUserPress}
        onSubmitComment={handleSendComment}
        onLikeComment={handleLikeComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onReportComment={handleReportComment}
        onCopyComment={handleCopyComment}
        onHideComment={handleHideComment}
        onClose={handleCloseComments}
      />

      <ReelMenu
        visible={Boolean(menuReel)}
        onClose={handleCloseMenu}
        autoSkip={autoSkip}
        onToggleAutoSkip={toggleAutoSkip}
        onDownload={handleDownload}
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
  feedTabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: "#000",
  },
  feedTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  feedTabLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    fontWeight: "600",
  },
  feedTabLabelActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  feedTabIndicator: {
    marginTop: 4,
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    flexGrow: 1,
  },
  item: {
    width: "100%",
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
