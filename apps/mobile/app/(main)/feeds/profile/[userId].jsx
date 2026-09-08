/* eslint-disable react/no-unescaped-entities */

import React, { useCallback, useEffect, useMemo, useState } from "react";

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
  posts as dummyPosts,
  reels as dummyReels,
} from "../../../../features/posts/dummyData";

import {
  useProfile,
  useUserPosts,
  useUserReels,
  useProfileActions,
} from "../../../../hooks/useProfile";

import { useUserId } from "../../../../hooks/useUser";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200";

const DUMMY_REELS = dummyReels;

export default function UserProfileScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState("posts");

  const [refreshing, setRefreshing] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const handleEditProfile = useCallback(() => {
    router.push("/(main)/profile");
  }, [router]);

  const selectedUserId = String(params?.userId || "");

  const currentUserId = useUserId();

  const isOwnProfile =
    Boolean(currentUserId) &&
    Boolean(selectedUserId) &&
    String(currentUserId) === String(selectedUserId);

  /*
   * --------------------------------------------------
   * SERVER PROFILE
   * --------------------------------------------------
   *
   * Fetch the real profile for this userId from the
   * API. Falls back to route/dummy data while loading
   * or if the request fails.
   */

  const profileQuery = useProfile(selectedUserId, {
    enabled: Boolean(selectedUserId),
    retry: 1,
  });

  const userPostsQuery = useUserPosts(
    selectedUserId,
    {},
    {
      enabled: Boolean(selectedUserId),
    },
  );

  const userReelsQuery = useUserReels(
    selectedUserId,
    {},
    {
      enabled: Boolean(selectedUserId),
    },
  );

  const { followUser, unfollowUser } = useProfileActions();

  const serverProfile = useMemo(() => {
    const data = profileQuery.data;

    if (!data) {
      return null;
    }

    return data.profile || data.user || data;
  }, [profileQuery.data]);

  const serverPosts = useMemo(() => {
    const data = userPostsQuery.data;

    if (!data) {
      return null;
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.posts)) {
      return data.posts;
    }

    if (Array.isArray(data.items)) {
      return data.items;
    }

    return null;
  }, [userPostsQuery.data]);

  const serverReels = useMemo(() => {
    const data = userReelsQuery.data;

    if (!data) {
      return null;
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.reels)) {
      return data.reels;
    }

    if (Array.isArray(data.items)) {
      return data.items;
    }

    return null;
  }, [userReelsQuery.data]);

  /*
   * --------------------------------------------------
   * GET THE ACTUAL USER FROM THE FEED
   * --------------------------------------------------
   *
   * FeedsScreen sends:
   *
   * user: JSON.stringify(selectedUser)
   *
   * Therefore this screen should use params.user
   * as the primary source of profile information.
   */

  const routeUser = useMemo(() => {
    if (!params?.user) {
      return null;
    }

    try {
      const parsed = JSON.parse(String(params.user));

      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (error) {
      console.error("Failed to parse user params:", error);
    }

    return null;
  }, [params?.user]);

  /*
   * --------------------------------------------------
   * FALLBACK USER
   * --------------------------------------------------
   *
   * Only use dummyPosts if the actual user was not
   * passed through navigation.
   */

  const fallbackUser = useMemo(() => {
    if (!selectedUserId) {
      return null;
    }

    if (
      String(selectedUserId) === String(currentUser.id) ||
      (currentUserId && String(selectedUserId) === String(currentUserId))
    ) {
      return {
        ...sharedProfile,
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        verified: Boolean(sharedProfile.verified ?? currentUser.verified),
      };
    }

    const foundPost = dummyPosts.find((post) => {
      const postUser = post?.user || {};

      const postUserId =
        postUser?.id || postUser?.userId || post?.userId || post?.authorId;

      return String(postUserId || "") === selectedUserId;
    });

    if (!foundPost) {
      return null;
    }

    const postUser = foundPost.user || {};

    return {
      id:
        postUser?.id ||
        postUser?.userId ||
        foundPost?.userId ||
        foundPost?.authorId ||
        selectedUserId,
      name:
        postUser?.name ||
        foundPost?.userName ||
        foundPost?.username ||
        "User",
      username: postUser?.username || foundPost?.username || "",
      avatar:
        postUser?.avatar ||
        foundPost?.userAvatar ||
        foundPost?.userPhoto ||
        "",
      verified: Boolean(postUser?.verified ?? foundPost?.verified ?? false),
    };
  }, [selectedUserId, currentUserId]);

  /*
   * --------------------------------------------------
   * ACTUAL PROFILE USER
   * --------------------------------------------------
   *
   * Route user always wins.
   */

  const selectedUser = useMemo(() => {
    return serverProfile || routeUser || fallbackUser || {};
  }, [serverProfile, routeUser, fallbackUser]);

  /*
   * --------------------------------------------------
   * PROFILE DATA
   * --------------------------------------------------
   */

  const profile = useMemo(() => {
    const user = selectedUser || {};

    const id = user?.id || user?.userId || selectedUserId;

    const name =
      user?.name ||
      user?.fullName ||
      user?.displayName ||
      user?.username ||
      "User";

    const username = user?.username || user?.handle || "";

    const avatar =
      user?.avatar ||
      user?.avatarUrl ||
      user?.photo ||
      user?.profilePhoto ||
      "";

    const cover =
      user?.cover || user?.coverPhoto || user?.coverImage || DEFAULT_COVER;

    const bio =
      user?.bio ||
      user?.description ||
      "Building ideas, sharing moments, and connecting with amazing people. 🚀";

    const location = user?.location || "";

    const website = user?.website || "";

    const verified = Boolean(
      user?.verified ??
      user?.isVerified ??
      user?.is_verified ??
      fallbackUser?.verified ??
      (params?.verified === "true" || params?.verified === true) ??
      false,
    );

    const followers = Number(
      user?.followers ?? user?.followersCount ?? user?.stats?.followers ?? 0,
    );

    const following = Number(
      user?.following ?? user?.followingCount ?? user?.stats?.following ?? 0,
    );

    const likes = Number(
      user?.likes ?? user?.likesCount ?? user?.stats?.likes ?? 0,
    );

    const isFollowingUser = Boolean(user?.isFollowing || user?.following);

    return {
      id,
      name,
      username,
      avatar,
      cover,
      bio,
      location,
      website,
      verified,
      followers: Number.isFinite(followers) ? followers : 0,
      following: Number.isFinite(following) ? following : 0,
      likes: Number.isFinite(likes) ? likes : 0,
      isFollowingUser,
    };
  }, [selectedUser, selectedUserId]);

  /*
   * Sync follow state from the server profile once it
   * loads (server value wins over local toggle).
   */

  useEffect(() => {
    setIsFollowing(profile.isFollowingUser);
  }, [profile.isFollowingUser]);

  /*
   * --------------------------------------------------
   * USER POSTS
   * --------------------------------------------------
   *
   * Match posts against the ACTUAL profile ID.
   */

  const userPosts = useMemo(() => {
    if (!profile.id) {
      return [];
    }

    if (serverPosts) {
      return serverPosts;
    }

    return dummyPosts.filter((post) => {
      const postUser = post?.user || {};

      const postUserId =
        postUser?.id || postUser?.userId || post?.userId || post?.authorId;

      return String(postUserId || "") === String(profile.id);
    });
  }, [profile.id, serverPosts]);

  const userReels = useMemo(() => {
    if (serverReels) {
      return serverReels;
    }

    return DUMMY_REELS;
  }, [serverReels]);

  /*
   * --------------------------------------------------
   * REFRESH
   * --------------------------------------------------
   */

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        profileQuery.refetch(),
        userPostsQuery.refetch(),
        userReelsQuery.refetch(),
      ]);
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    } finally {
      setRefreshing(false);
    }
  }, [profileQuery, userPostsQuery, userReelsQuery]);

  /*
   * --------------------------------------------------
   * FOLLOW
   * --------------------------------------------------
   */

  const handleFollow = useCallback(async () => {
    if (!profile.id || isOwnProfile) {
      return;
    }

    // Optimistic update.
    const next = !isFollowing;

    setIsFollowing(next);

    try {
      if (next) {
        await followUser(profile.id);
      } else {
        await unfollowUser(profile.id);
      }
    } catch (error) {
      // Revert on failure.
      setIsFollowing(!next);

      console.error("Failed to update follow state:", error);
    }
  }, [profile.id, isFollowing, isOwnProfile, followUser, unfollowUser]);

  /*
   * --------------------------------------------------
   * MESSAGE
   * --------------------------------------------------
   */

  const handleMessage = useCallback(() => {
    console.log("Message user:", profile.id);
  }, [profile.id]);

  /*
   * --------------------------------------------------
   * MORE
   * --------------------------------------------------
   */

  const handleMore = useCallback(() => {
    console.log("Profile menu:", profile.id);
  }, [profile.id]);

  /*
   * --------------------------------------------------
   * OPEN POST
   * --------------------------------------------------
   */

  const handlePostPress = useCallback(
    (post) => {
      if (!post?.id) {
        return;
      }

      router.push({
        pathname: "/(main)/feeds/post/[id]",
        params: {
          id: String(post.id),
        },
      });
    },
    [router],
  );

  /*
   * --------------------------------------------------
   * OPEN REEL
   * --------------------------------------------------
   */

  const handleReelPress = useCallback((reel) => {
    if (!reel?.id) {
      return;
    }

    console.log("Open reel:", reel.id);
  }, []);

  /*
   * --------------------------------------------------
   * POSTS TAB
   * --------------------------------------------------
   */

  const renderPosts = () => {
    if (userPosts.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <View style={styles.emptyIcon}>
            <Ionicons name="images-outline" size={28} color="#777777" />
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
        {userPosts.map((post) => {
          const mediaUri =
            post?.mediaUrl ||
            post?.image ||
            post?.media?.uri ||
            post?.media?.url;

          if (!mediaUri) {
            return (
              <Pressable
                key={String(post.id)}
                onPress={() => handlePostPress(post)}
                style={styles.textGridItem}
              >
                <Text numberOfLines={5} style={styles.textGridPost}>
                  {post?.caption || post?.content || post?.text || ""}
                </Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={String(post.id)}
              onPress={() => handlePostPress(post)}
              style={({ pressed }) => [
                styles.gridItem,
                pressed && styles.gridItemPressed,
              ]}
            >
              <Image
                source={{
                  uri: mediaUri,
                }}
                resizeMode="cover"
                style={styles.gridImage}
              />

              <View style={styles.gridOverlay}>
                <View style={styles.gridStat}>
                  <Ionicons name="heart" size={13} color="#FFFFFF" />

                  <Text style={styles.gridStatText}>
                    {formatCount(
                      post?.likeCount || post?.likesCount || post?.likes || 0,
                    )}
                  </Text>
                </View>

                <View style={styles.gridStat}>
                  <Ionicons name="chatbubble" size={12} color="#FFFFFF" />

                  <Text style={styles.gridStatText}>
                    {formatCount(
                      post?.commentCount ||
                        post?.commentsCount ||
                        post?.comments ||
                        0,
                    )}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  /*
   * --------------------------------------------------
   * REELS TAB
   * --------------------------------------------------
   */

  const renderReels = () => {
    if (userReels.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <View style={styles.emptyIcon}>
            <Ionicons name="play-circle-outline" size={28} color="#777777" />
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
        {userReels.map((reel) => (
          <Pressable
            key={reel.id}
            onPress={() => handleReelPress(reel)}
            style={({ pressed }) => [
              styles.gridItem,
              pressed && styles.gridItemPressed,
            ]}
          >
            <Image
              source={{
                uri: reel.image,
              }}
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

  /*
   * --------------------------------------------------
   * SCREEN
   * --------------------------------------------------
   */

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
            source={{
              uri: profile.cover,
            }}
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
                onPress={() => router.back()}
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

              {/* More (3 dots) */}
              <Pressable
                onPress={handleMore}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.headerButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="More options"
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color="#FFFFFF"
                />
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
            {profile.avatar ? (
              <Image
                source={{
                  uri: profile.avatar,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
            )}
          </View>

          {/* Name */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>

            {profile.verified ? (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
            ) : null}
          </View>

          {/* Username */}
          <Text style={styles.username}>
            {profile.username ? `@${profile.username}` : ""}
          </Text>

          {/* Bio */}
          <Text style={styles.bio}>{profile.bio}</Text>

          {/* Metadata */}
          <View style={styles.metadata}>
            {profile.location ? (
              <View style={styles.metadataItem}>
                <View style={styles.metadataIcon}>
                  <Ionicons name="location-outline" size={13} color="#555555" />
                </View>

                <Text style={styles.metadataText}>{profile.location}</Text>
              </View>
            ) : null}

            {profile.website ? (
              <View style={styles.metadataItem}>
                <View style={styles.metadataIcon}>
                  <Ionicons name="link-outline" size={13} color="#555555" />
                </View>

                <Text style={styles.metadataLink}>{profile.website}</Text>
              </View>
            ) : null}
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {formatCount(userPosts.length)}
              </Text>

              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <Pressable style={styles.stat} hitSlop={6}>
              <Text style={styles.statNumber}>
                {formatCount(profile.followers + (isFollowing ? 1 : 0))}
              </Text>

              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>

            <Pressable style={styles.stat} hitSlop={6}>
              <Text style={styles.statNumber}>
                {formatCount(profile.following)}
              </Text>

              <Text style={styles.statLabel}>Following</Text>
            </Pressable>

            <View style={[styles.stat, styles.statLast]}>
              <Text style={styles.statNumber}>
                {formatCount(profile.likes)}
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
                  isFollowing && styles.followingButton,
                  pressed && styles.followButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}
                >
                  {isFollowing ? "Following" : "Follow"}
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

        {activeTab === "posts" ? renderPosts() : null}

        {activeTab === "reels" ? renderReels() : null}

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
            <Text style={styles.emptyTitle}>
              {isOwnProfile
                ? "Your profile QR code"
                : `${profile.name}'s profile QR code`}
            </Text>

            {profile.username ? (
              <Text style={styles.username}>@{profile.username}</Text>
            ) : null}

            <View style={styles.qrCode}>
              <QRCode
                value={createURL(
                  `/feeds/profile/${encodeURIComponent(profile.id)}`,
                )}
                size={200}
                quietZone={12}
              />
            </View>

            <Text style={styles.emptyText}>Scan to open profile in Gists.</Text>

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

  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginTop: -44,
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    color: "#111111",
    fontSize: 30,
    fontWeight: "800",
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
   * ACTIONS
   * ==========================================================
   */

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

  textGridItem: {
    width: "33.333%",
    aspectRatio: 0.9,
    padding: 5,
  },

  textGridPost: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#F3F3F3",
    color: "#222222",
    fontSize: 11,
    lineHeight: 16,
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
