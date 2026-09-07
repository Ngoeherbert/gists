/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const DUMMY_PROFILE = {
  id: "profile-1",
  name: "Herbert Ngoe",
  username: "herbert",
  bio: "Building ideas, sharing moments, and connecting with amazing people. 🚀",
  avatar: "https://i.pravatar.cc/300?img=12",
  cover: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
  location: "Buea, Cameroon",
  website: "gists.app",
  verified: true,
  followers: 12800,
  following: 642,
  posts: 184,
  likes: 48200,
  isFollowing: false,
};

const DUMMY_POSTS = [
  {
    id: "profile-post-1",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    likes: 2840,
    comments: 184,
  },
  {
    id: "profile-post-2",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    likes: 1920,
    comments: 97,
  },
  {
    id: "profile-post-3",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800",
    likes: 3410,
    comments: 221,
  },
  {
    id: "profile-post-4",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
    likes: 4170,
    comments: 304,
  },
  {
    id: "profile-post-5",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    likes: 2560,
    comments: 118,
  },
  {
    id: "profile-post-6",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    likes: 3890,
    comments: 276,
  },
  {
    id: "profile-post-7",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    likes: 1740,
    comments: 84,
  },
  {
    id: "profile-post-8",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    likes: 2210,
    comments: 143,
  },
  {
    id: "profile-post-9",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
    likes: 3180,
    comments: 194,
  },
];

const DUMMY_REELS = [
  {
    id: "reel-1",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700",
    views: 18200,
  },
  {
    id: "reel-2",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700",
    views: 12400,
  },
  {
    id: "reel-3",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=700",
    views: 9800,
  },
  {
    id: "reel-4",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700",
    views: 22100,
  },
  {
    id: "reel-5",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700",
    views: 7600,
  },
  {
    id: "reel-6",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700",
    views: 14300,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [profile, setProfile] = useState(DUMMY_PROFILE);
  const [activeTab, setActiveTab] = useState("posts");
  const [refreshing, setRefreshing] = useState(false);

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

  const handleMore = useCallback(() => {
    console.log("Profile menu:", profile.id);
  }, [profile.id]);

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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
          <Ionicons name="arrow-back" size={23} color="#111111" />
        </Pressable>

        <Text numberOfLines={1} style={styles.headerUsername}>
          @{displayProfile.username}
        </Text>

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
          <Ionicons name="ellipsis-horizontal" size={23} color="#111111" />
        </Pressable>
      </View>

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
        {/* Cover */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: displayProfile.cover }}
            resizeMode="cover"
            style={styles.coverImage}
          />

          <View style={styles.coverFade} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarRow}>
            <Image
              source={{ uri: displayProfile.avatar }}
              style={styles.avatar}
            />

            {isOwnProfile ? (
              <Pressable
                onPress={handleEditProfile}
                style={({ pressed }) => [
                  styles.topActionButton,
                  pressed && styles.topActionPressed,
                ]}
              >
                <Text style={styles.topActionText}>Edit profile</Text>
              </Pressable>
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
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color="#111111"
                  />
                </Pressable>
              </View>
            )}
          </View>

          {/* Name */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{displayProfile.name}</Text>

            {displayProfile.verified ? (
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#111111"
                style={styles.verified}
              />
            ) : null}
          </View>

          <Text style={styles.username}>@{displayProfile.username}</Text>

          {/* Bio */}
          <Text style={styles.bio}>{displayProfile.bio}</Text>

          {/* Profile Metadata */}
          <View style={styles.metadata}>
            {displayProfile.location ? (
              <View style={styles.metadataItem}>
                <Ionicons name="location-outline" size={15} color="#777777" />

                <Text style={styles.metadataText}>
                  {displayProfile.location}
                </Text>
              </View>
            ) : null}

            {displayProfile.website ? (
              <View style={styles.metadataItem}>
                <Ionicons name="link-outline" size={15} color="#777777" />

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

            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {formatCount(displayProfile.likes)}
              </Text>

              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabs}>
          <Pressable
            onPress={() => setActiveTab("posts")}
            style={[styles.tab, activeTab === "posts" && styles.activeTab]}
          >
            <Ionicons
              name={activeTab === "posts" ? "grid" : "grid-outline"}
              size={21}
              color={activeTab === "posts" ? "#111111" : "#999999"}
            />

            <Text
              style={[
                styles.tabText,
                activeTab === "posts" && styles.activeTabText,
              ]}
            >
              Posts
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("reels")}
            style={[styles.tab, activeTab === "reels" && styles.activeTab]}
          >
            <Ionicons
              name={
                activeTab === "reels" ? "play-circle" : "play-circle-outline"
              }
              size={21}
              color={activeTab === "reels" ? "#111111" : "#999999"}
            />

            <Text
              style={[
                styles.tabText,
                activeTab === "reels" && styles.activeTabText,
              ]}
            >
              Reels
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("saved")}
            style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          >
            <Ionicons
              name={activeTab === "saved" ? "bookmark" : "bookmark-outline"}
              size={21}
              color={activeTab === "saved" ? "#111111" : "#999999"}
            />

            <Text
              style={[
                styles.tabText,
                activeTab === "saved" && styles.activeTabText,
              ]}
            >
              Saved
            </Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        {activeTab === "posts" && renderPosts()}
        {activeTab === "reels" && renderReels()}

        {activeTab === "saved" ? (
          <View style={styles.emptyContent}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bookmark-outline" size={28} color="#777777" />
            </View>

            <Text style={styles.emptyTitle}>Saved Gists</Text>

            <Text style={styles.emptyText}>Saved Gists will appear here.</Text>
          </View>
        ) : null}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
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

  header: {
    height: 62,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  headerButtonPressed: {
    backgroundColor: "#F4F4F4",
    transform: [{ scale: 0.94 }],
  },

  headerUsername: {
    flex: 1,
    marginHorizontal: 15,
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  content: {
    paddingBottom: 30,
  },

  coverContainer: {
    width: "100%",
    height: 175,
    backgroundColor: "#EAEAEA",
    overflow: "hidden",
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  coverFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  profileSection: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },

  avatarRow: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  topActionButton: {
    minWidth: 110,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },

  topActionPressed: {
    backgroundColor: "#F5F5F5",
    transform: [{ scale: 0.97 }],
  },

  topActionText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "700",
  },

  profileActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  followButton: {
    minWidth: 92,
    height: 36,
    paddingHorizontal: 17,
    borderRadius: 18,
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
    transform: [{ scale: 0.97 }],
  },

  followButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  followingButtonText: {
    color: "#444444",
  },

  messageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  messageButtonPressed: {
    backgroundColor: "#E8E8E8",
    transform: [{ scale: 0.95 }],
  },

  nameRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    color: "#111111",
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  verified: {
    marginLeft: 5,
  },

  username: {
    marginTop: 2,
    color: "#777777",
    fontSize: 13,
    fontWeight: "500",
  },

  bio: {
    marginTop: 12,
    color: "#333333",
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: "500",
  },

  metadata: {
    marginTop: 11,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
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

  stats: {
    marginTop: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "900",
  },

  statLabel: {
    marginTop: 3,
    color: "#888888",
    fontSize: 10.5,
    fontWeight: "500",
  },

  tabs: {
    height: 58,
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
    gap: 3,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#111111",
  },

  tabText: {
    color: "#999999",
    fontSize: 10,
    fontWeight: "600",
  },

  activeTabText: {
    color: "#111111",
    fontWeight: "800",
  },

  grid: {
    padding: 2,
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

  emptyContent: {
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F3F3",
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
});
