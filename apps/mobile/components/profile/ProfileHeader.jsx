import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ProfileAvatar from "./ProfileAvatar";
import GistId from "./GistId";
import VerificationBadge from "./VerificationBadge";

export default function ProfileHeader({
  user = {},
  isOwnProfile = false,
  isFollowing = false,
  onBack,
  onEdit,
  onFollow,
  onMessage,
  onMore,
  onAvatarPress,
}) {
  const {
    name = "Gist User",
    username = "gistuser",
    avatar,
    bio,
    verified = false,
    website,
  } = user;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}

        <Text style={styles.title}>Profile</Text>

        <Pressable
          onPress={onMore}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Profile options"
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </Pressable>
      </View>

      <View style={styles.profile}>
        <ProfileAvatar
          uri={avatar}
          name={name}
          size={96}
          onPress={onAvatarPress}
        />

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>

            {verified && <VerificationBadge size={18} />}
          </View>

          <GistId username={username} />

          {bio ? <Text style={styles.bio}>{bio}</Text> : null}

          {website ? (
            <Pressable
              onPress={() => {}}
              style={styles.websiteRow}
              accessibilityRole="link"
            >
              <Ionicons name="link-outline" size={15} color="#555" />
              <Text style={styles.website} numberOfLines={1}>
                {website}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        {isOwnProfile ? (
          <Pressable
            onPress={onEdit}
            style={styles.editButton}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <Text style={styles.editText}>Edit Profile</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={onFollow}
              style={[
                styles.actionButton,
                isFollowing && styles.followingButton,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isFollowing ? "Unfollow user" : "Follow user"}
            >
              <Text
                style={[styles.actionText, isFollowing && styles.followingText]}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </Pressable>

            <Pressable
              onPress={onMessage}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel="Message user"
            >
              <Text style={styles.actionText}>Message</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingBottom: 18,
  },

  topBar: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#000",
    fontSize: 17,
    fontWeight: "700",
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  sidePlaceholder: {
    width: 42,
  },

  profile: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },

  info: {
    flex: 1,
    marginLeft: 16,
    paddingTop: 4,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  name: {
    color: "#000",
    fontSize: 20,
    fontWeight: "800",
    maxWidth: "82%",
  },

  bio: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 9,
  },

  websiteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  website: {
    color: "#555",
    fontSize: 13,
    marginLeft: 5,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  followingButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },

  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  followingText: {
    color: "#000",
  },

  editButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },

  editText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
});
