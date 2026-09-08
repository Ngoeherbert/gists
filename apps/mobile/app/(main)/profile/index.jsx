import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createURL } from "expo-linking";
import QRCode from "react-native-qrcode-svg";

import {
  currentUser,
  profile as sharedProfile,
  profilePosts as DUMMY_POSTS,
  reels as DUMMY_REELS,
} from "../../../features/posts/dummyData";

const DUMMY_PROFILE = {
  ...sharedProfile,
  id: currentUser.id,
  name: currentUser.name,
  username: currentUser.username,
  avatar: currentUser.avatar,
};

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [profile, setProfile] = useState(DUMMY_PROFILE);
  const [activeTab, setActiveTab] = useState("posts");
  const [refreshing, setRefreshing] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const isOwnProfile =
    !params?.userId || String(params.userId) === String(DUMMY_PROFILE.id);

  const displayProfile = useMemo(
    () => ({
      ...profile,
      isFollowing: profile.isFollowing,
    }),
    [profile],
  );

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await new Promise((resolve) => setTimeout(resolve, 700));
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleFollow = useCallback(() => {
    setProfile((current) => ({
      ...current,
      isFollowing: !current.isFollowing,
      followers: current.isFollowing
        ? current.followers - 1
        : current.followers + 1,
    }));
  }, []);

  const handleEditProfile = useCallback(() => {
    console.log("Edit profile");
  }, []);

  const handleMessage = useCallback(() => {
    console.log("Message user:", profile.id);
  }, [profile.id]);

  const handleSettings = useCallback(() => {
    router.push("/(main)/profile/settings");
  }, [router]);

  const handlePostPress = useCallback(
    (post) => {
      if (!post?.id) return;

      router.push({
        pathname: "/(main)/feeds/post",
        params: {
          postId: String(post.id),
        },
      });
    },
    [router],
  );

  const handleReelPress = useCallback((reel) => {
    if (!reel?.id) return;

    console.log("Open reel:", reel.id);
  }, []);

  const renderPosts = () => {
    if (DUMMY_POSTS.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <View style={styles.emptyIcon}>
            <Ionicons name="images-outline" size={30} color="#555555" />
          </View>

          <Text style={styles.emptyTitle}>No posts yet</Text>

          <Text style={styles.emptyText}>
            Posts shared by this account will appear here.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {DUMMY_POSTS.map((post) => (
          <Pressable
            key={post.id}
            onPress={() => handlePostPress(post)}
            style={({ pressed }) => [
              styles.gridItem,
              pressed && styles.gridItemPressed,
            ]}
          >
            <Image
              source={{ uri: post.image }}
              resizeMode="cover"
              style={styles.gridImage}
            />

            <View style={styles.gridOverlay}>
              <View style={styles.gridStat}>
                <Ionicons name="heart" size={13} color="#FFFFFF" />

                <Text style={styles.gridStatText}>
                  {formatCount(post.likes)}
                </Text>
              </View>

              <View style={styles.gridStat}>
                <Ionicons name="chatbubble" size={12} color="#FFFFFF" />

                <Text style={styles.gridStatText}>
                  {formatCount(post.comments)}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderReels = () => {
    if (DUMMY_REELS.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <View style={styles.emptyIcon}>
            <Ionicons name="play-circle-outline" size={30} color="#555555" />
          </View>

          <Text style={styles.emptyTitle}>No Reels yet</Text>

          <Text style={styles.emptyText}>
            Reels shared by this account will appear here.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {DUMMY_REELS.map((reel) => (
          <Pressable
            key={reel.id}
            onPress={() => handleReelPress(reel)}
            style={({ pressed }) => [
              styles.gridItem,
              pressed && styles.gridItemPressed,
            ]}
          >
            <Image
              source={{ uri: reel.image }}
              resizeMode="cover"
              style={styles.gridImage}
            />

            <View style={styles.reelBadge}>
              <Ionicons name="play" size={11} color="#FFFFFF" />

              <Text style={styles.reelBadgeText}>
                {formatCount(reel.views)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#111111"
          />
        }
        contentContainerStyle={styles.content}
      >
        {/* =====================================================
            COVER + HEADER
        ====================================================== */}

        <View style={styles.heroContainer}>
          {/* Cover Image */}
          <Image
            source={{ uri: displayProfile.cover }}
            resizeMode="cover"
            style={styles.coverImage}
          />

          {/* Subtle dark overlay */}
          <View style={styles.coverFade} />

          {/* Header */}
          <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
            <View style={styles.header}>
              {/* Back */}
              <Pressable
                onPress={() => router.replace("/(main)/feeds")}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <Ionicons name="chevron-back" size={23} color="#FFFFFF" />
              </Pressable>

              {/* Settings */}
              <Pressable
                onPress={handleSettings}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Settings"
              >
                <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        {/* =====================================================
            PROFILE INFO
        ====================================================== */}

        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarRow}>
            <Image
              source={{ uri: displayProfile.avatar }}
              style={styles.avatar}
            />
          </View>

          {/* Name */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{displayProfile.name}</Text>

            {displayProfile.verified ? (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
            ) : null}
          </View>

          {/* Username */}
          <Text style={styles.username}>@{displayProfile.username}</Text>

          {/* Bio */}
          <Text style={styles.bio}>{displayProfile.bio}</Text>

          {/* Metadata */}
          <View style={styles.metadata}>
            {displayProfile.location ? (
              <View style={styles.metadataItem}>
                <View style={styles.metadataIcon}>
                  <Ionicons name="location-outline" size={13} color="#555555" />
                </View>

                <Text style={styles.metadataText}>
                  {displayProfile.location}
                </Text>
              </View>
            ) : null}

            {displayProfile.website ? (
              <View style={styles.metadataItem}>
                <View style={styles.metadataIcon}>
                  <Ionicons name="link-outline" size={13} color="#555555" />
                </View>

                <Text style={styles.metadataLink}>
                  {displayProfile.website}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {formatCount(displayProfile.posts)}
              </Text>

              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <Pressable style={styles.stat} hitSlop={6}>
              <Text style={styles.statNumber}>
                {formatCount(displayProfile.followers)}
              </Text>

              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>

            <Pressable style={styles.stat} hitSlop={6}>
              <Text style={styles.statNumber}>
                {formatCount(displayProfile.following)}
              </Text>

              <Text style={styles.statLabel}>Following</Text>
            </Pressable>

            <View style={[styles.stat, styles.statLast]}>
              <Text style={styles.statNumber}>
                {formatCount(displayProfile.likes)}
              </Text>

              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>

          {/* Action Buttons */}
          {isOwnProfile ? (
            <View style={styles.profileActions}>
              <Pressable
                onPress={handleEditProfile}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.topActionButton,
                  pressed && styles.topActionPressed,
                ]}
              >
                <Text style={styles.topActionText}>Edit profile</Text>
              </Pressable>

              <Pressable
                onPress={() => setQrVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Show profile QR code"
                style={({ pressed }) => [
                  styles.qrButton,
                  pressed && styles.qrButtonPressed,
                ]}
              >
                <Ionicons name="qr-code-outline" size={22} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.profileActions}>
              <Pressable
                onPress={handleFollow}
                style={({ pressed }) => [
                  styles.followButton,
                  displayProfile.isFollowing && styles.followingButton,
                  pressed && styles.followButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    displayProfile.isFollowing && styles.followingButtonText,
                  ]}
                >
                  {displayProfile.isFollowing ? "Following" : "Follow"}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleMessage}
                style={({ pressed }) => [
                  styles.messageButton,
                  pressed && styles.messageButtonPressed,
                ]}
              >
                <Ionicons name="chatbubble-outline" size={18} color="#111111" />
              </Pressable>
            </View>
          )}
        </View>

        {/* =====================================================
            CONTENT TABS
        ====================================================== */}

        <View style={styles.tabs}>
          {/* Posts */}
          <Pressable onPress={() => setActiveTab("posts")} style={styles.tab}>
            <View style={styles.tabIcon}>
              <Ionicons
                name={activeTab === "posts" ? "grid" : "grid-outline"}
                size={20}
                color={activeTab === "posts" ? "#111111" : "#999999"}
              />
            </View>

            <Text
              style={[
                styles.tabText,
                activeTab === "posts" && styles.activeTabText,
              ]}
            >
              Posts
            </Text>

            {activeTab === "posts" ? (
              <View style={styles.activeUnderline} />
            ) : null}
          </Pressable>

          {/* Reels */}
          <Pressable onPress={() => setActiveTab("reels")} style={styles.tab}>
            <View style={styles.tabIcon}>
              <Ionicons
                name={activeTab === "reels" ? "play" : "play-outline"}
                size={20}
                color={activeTab === "reels" ? "#111111" : "#999999"}
              />
            </View>

            <Text
              style={[
                styles.tabText,
                activeTab === "reels" && styles.activeTabText,
              ]}
            >
              Reels
            </Text>

            {activeTab === "reels" ? (
              <View style={styles.activeUnderline} />
            ) : null}
          </Pressable>

          {/* Saved */}
          <Pressable onPress={() => setActiveTab("saved")} style={styles.tab}>
            <View style={styles.tabIcon}>
              <Ionicons
                name={activeTab === "saved" ? "bookmark" : "bookmark-outline"}
                size={20}
                color={activeTab === "saved" ? "#111111" : "#999999"}
              />
            </View>

            <Text
              style={[
                styles.tabText,
                activeTab === "saved" && styles.activeTabText,
              ]}
            >
              Saved
            </Text>

            {activeTab === "saved" ? (
              <View style={styles.activeUnderline} />
            ) : null}
          </Pressable>
        </View>

        {/* =====================================================
            TAB CONTENT
        ====================================================== */}

        {activeTab === "posts" && renderPosts()}

        {activeTab === "reels" && renderReels()}

        {activeTab === "saved" ? (
          <View style={styles.emptyContent}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bookmark-outline" size={30} color="#555555" />
            </View>

            <Text style={styles.emptyTitle}>Saved Gists</Text>

            <Text style={styles.emptyText}>Saved Gists will appear here.</Text>
          </View>
        ) : null}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* =======================================================
          QR MODAL
      ======================================================== */}

      <Modal
        visible={qrVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrVisible(false)}
      >
        <View style={styles.qrBackdrop}>
          <View style={styles.qrCard} accessibilityViewIsModal>
            <Text style={styles.emptyTitle}>Your profile QR code</Text>

            <Text style={styles.username}>@{displayProfile.username}</Text>

            <View style={styles.qrCode}>
              <QRCode
                value={createURL(
                  `/feeds/profile/${encodeURIComponent(displayProfile.id)}`,
                )}
                size={200}
                quietZone={12}
              />
            </View>

            <Text style={styles.emptyText}>
              Scan to open your profile in Gists.
            </Text>

            <Pressable
              onPress={() => setQrVisible(false)}
              accessibilityRole="button"
              style={styles.topActionButton}
            >
              <Text style={styles.topActionText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function formatCount(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  if (number >= 1000000) {
    return `${(number / 1000000)
      .toFixed(number >= 10000000 ? 0 : 1)
      .replace(".0", "")}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000)
      .toFixed(number >= 10000 ? 0 : 1)
      .replace(".0", "")}K`;
  }

  return String(number);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingBottom: 30,
  },

  /*
   * ==========================================================
   * HERO / COVER
   * ==========================================================
   */

  heroContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#EAEAEA",
    overflow: "hidden",
    position: "relative",
  },

  coverImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },

  coverFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.10)",
  },

  /*
   * ==========================================================
   * HEADER
   * ==========================================================
   *
   * The header is inside the ScrollView, so it is NOT fixed.
   */

  headerSafeArea: {
    backgroundColor: "transparent",
  },

  header: {
    height: 62,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(0, 0, 0, 0.55)",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  headerButtonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.8,
  },

  /*
   * ==========================================================
   * PROFILE
   * ==========================================================
   */

  profileSection: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },

  avatarRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginTop: -44,
    backgroundColor: "#EAEAEA",
  },

  profileActions: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  topActionButton: {
    flex: 1,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  topActionPressed: {
    backgroundColor: "#F5F5F5",
    transform: [{ scale: 0.98 }],
  },

  topActionText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },

  qrButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  qrButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },

  followButton: {
    flex: 1,
    height: 42,
    paddingHorizontal: 17,
    borderRadius: 12,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  followingButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },

  followButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  followButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  followingButtonText: {
    color: "#444444",
  },

  messageButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  messageButtonPressed: {
    backgroundColor: "#E8E8E8",
    transform: [{ scale: 0.96 }],
  },

  nameRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    color: "#111111",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  verifiedBadge: {
    width: 18,
    height: 18,
    marginLeft: 6,
    borderRadius: 9,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  username: {
    textAlign: "center",
    marginTop: 2,
    color: "#777777",
    fontSize: 13,
    fontWeight: "500",
  },

  bio: {
    textAlign: "center",
    marginTop: 12,
    color: "#333333",
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: "500",
  },

  /*
   * ==========================================================
   * METADATA
   * ==========================================================
   */

  metadata: {
    marginTop: 11,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metadataIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  metadataText: {
    marginLeft: 5,
    color: "#777777",
    fontSize: 11.5,
  },

  metadataLink: {
    marginLeft: 5,
    color: "#333333",
    fontSize: 11.5,
    fontWeight: "600",
  },

  /*
   * ==========================================================
   * STATS
   * ==========================================================
   */

  stats: {
    marginTop: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "stretch",
  },

  stat: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#4949496d",
  },

  statLast: {
    borderRightWidth: 0,
  },

  statNumber: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111111",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#777777",
  },

  /*
   * ==========================================================
   * TABS
   * ==========================================================
   */

  tabs: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "stretch",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingBottom: 4,
    gap: 3,
  },

  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
  },

  tabText: {
    color: "#999999",
    fontSize: 11,
    fontWeight: "600",
  },

  activeTabText: {
    color: "#111111",
    fontWeight: "800",
  },

  activeUnderline: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: 48,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "#111111",
  },

  /*
   * ==========================================================
   * GRID
   * ==========================================================
   */

  grid: {
    padding: 2,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  gridItem: {
    width: "33.333%",
    aspectRatio: 0.9,
    padding: 2,
  },

  gridItemPressed: {
    opacity: 0.75,
  },

  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#EEEEEE",
  },

  gridOverlay: {
    position: "absolute",
    left: 9,
    right: 9,
    bottom: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  gridStat: {
    flexDirection: "row",
    alignItems: "center",
  },

  gridStatText: {
    marginLeft: 3,
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2,
  },

  /*
   * ==========================================================
   * REELS
   * ==========================================================
   */

  reelBadge: {
    position: "absolute",
    right: 9,
    bottom: 9,
    minHeight: 22,
    paddingHorizontal: 7,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.65)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  reelBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },

  /*
   * ==========================================================
   * EMPTY STATE
   * ==========================================================
   */

  emptyContent: {
    minHeight: 280,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 14,
    color: "#222222",
    fontSize: 17,
    fontWeight: "800",
  },

  emptyText: {
    maxWidth: 280,
    marginTop: 6,
    color: "#999999",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  bottomSpace: {
    height: 80,
  },

  /*
   * ==========================================================
   * QR MODAL
   * ==========================================================
   */

  qrBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  qrCard: {
    width: "100%",
    maxWidth: 340,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    gap: 12,
  },

  qrCode: {
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
});
