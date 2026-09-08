import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  posts as dummyPosts,
  currentUser,
} from "../../../../features/posts/dummyData";

export default function UserProfileScreen() {
  const router = useRouter();

  const { userId, name, username, avatar } = useLocalSearchParams();

  const selectedUserId = String(userId || "");

  /*
   * Resolve the profile user from the data (the params
   * only carry the userId). Params are used as a
   * fallback only.
   */
  const user = useMemo(() => {
    const post = dummyPosts.find(
      (item) =>
        String(item?.user?.id || item?.user?.userId || item?.userId) ===
        selectedUserId,
    );

    if (post?.user || post?.userId) {
      return {
        id: selectedUserId,
        name: post?.user?.name || post?.userName,
        username: post?.user?.username || post?.username,
        avatar: post?.user?.avatar || post?.userAvatar || post?.userPhoto,
      };
    }

    if (String(currentUser?.id) === selectedUserId) {
      return currentUser;
    }

    /*
     * No data record found - fall back to whatever
     * was passed through the route params.
     */
    const fallbackName = String(name || username || "");

    if (fallbackName || avatar) {
      return {
        id: selectedUserId,
        name: fallbackName || "User",
        username: String(username || ""),
        avatar: String(avatar || ""),
      };
    }

    return null;
  }, [selectedUserId, name, username, avatar]);

  const userPosts = useMemo(() => {
    return dummyPosts.filter((post) => {
      const postUserId =
        post?.user?.id || post?.user?.userId || post?.userId || post?.authorId;

      return String(postUserId || "") === selectedUserId;
    });
  }, [selectedUserId]);

  const handleBack = () => {
    /*
     * Normally we return to wherever the user came from
     * (the Feeds screen). If there is no history
     * (e.g. deep link), go to the Feeds screen directly.
     */
    if (router.canGoBack()) {
      router.back();

      return;
    }

    router.replace("/(main)/feeds");
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color="#111111" />
          </Pressable>

          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.notFound}>
          <Ionicons name="person-outline" size={48} color="#AAAAAA" />

          <Text style={styles.notFoundTitle}>User not found</Text>

          <Pressable onPress={handleBack} style={styles.backHomeButton}>
            <Text style={styles.backHomeText}>Back to feed</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const profileName = String(user?.name || user?.username || "User");

  const profileUsername = String(user?.username || "");

  const profileAvatar = String(
    user?.avatar || user?.avatarUrl || user?.photo || "",
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {profileName}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile */}
        <View style={styles.profileHeader}>
          {profileAvatar ? (
            <Image
              source={{
                uri: profileAvatar,
              }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {profileName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <Text style={styles.name}>{profileName}</Text>

          {profileUsername ? (
            <Text style={styles.username}>@{profileUsername}</Text>
          ) : null}

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{userPosts.length}</Text>

              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>

              <Text style={styles.statLabel}>Followers</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>

              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <Pressable style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </Pressable>
        </View>

        {/* Posts */}
        <View style={styles.postsSection}>
          <Text style={styles.postsTitle}>Posts</Text>

          {userPosts.length === 0 ? (
            <View style={styles.emptyPosts}>
              <Ionicons name="images-outline" size={38} color="#AAAAAA" />

              <Text style={styles.emptyPostsTitle}>No posts yet</Text>
            </View>
          ) : (
            userPosts.map((post) => {
              const mediaUri =
                post?.mediaUrl ||
                post?.image ||
                post?.media?.uri ||
                post?.media?.url;

              if (!mediaUri) {
                return (
                  <View key={String(post.id)} style={styles.textPost}>
                    <Text style={styles.textPostText}>
                      {post?.caption || post?.content || post?.text || ""}
                    </Text>
                  </View>
                );
              }

              return (
                <View key={String(post.id)} style={styles.post}>
                  <Image
                    source={{
                      uri: mediaUri,
                    }}
                    resizeMode="cover"
                    style={styles.postImage}
                  />

                  {post?.caption ? (
                    <Text style={styles.postCaption}>{post.caption}</Text>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 58,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    marginHorizontal: 12,
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  headerSpacer: {
    width: 40,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#EEEEEE",
  },

  avatarPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEEEE",
  },

  avatarInitial: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "700",
  },

  name: {
    marginTop: 14,
    color: "#111111",
    fontSize: 21,
    fontWeight: "700",
  },

  username: {
    marginTop: 4,
    color: "#888888",
    fontSize: 14,
  },

  stats: {
    width: "100%",
    maxWidth: 360,
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },

  statLabel: {
    marginTop: 3,
    color: "#888888",
    fontSize: 12,
  },

  followButton: {
    width: "100%",
    maxWidth: 300,
    height: 46,
    marginTop: 22,
    borderRadius: 23,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  followButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  postsSection: {
    paddingHorizontal: 16,
  },

  postsTitle: {
    marginBottom: 12,
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
  },

  post: {
    marginBottom: 16,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
  },

  postImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#EEEEEE",
  },

  postCaption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#222222",
    fontSize: 14,
    lineHeight: 20,
  },

  textPost: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },

  textPostText: {
    color: "#222222",
    fontSize: 14,
    lineHeight: 20,
  },

  emptyPosts: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyPostsTitle: {
    marginTop: 10,
    color: "#888888",
    fontSize: 14,
  },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  notFoundTitle: {
    marginTop: 14,
    color: "#222222",
    fontSize: 18,
    fontWeight: "700",
  },

  backHomeButton: {
    marginTop: 18,
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 22,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  backHomeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
