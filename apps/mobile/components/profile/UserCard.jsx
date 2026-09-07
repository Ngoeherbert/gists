import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ProfileAvatar from "./ProfileAvatar";
import GistId from "./GistId";
import VerificationBadge from "./VerificationBadge";
import FollowButton from "./FollowButton";

export default function UserCard({
  user = {},
  onPress,
  onFollow,
  following = false,
  followLoading = false,
  showFollow = true,
  compact = false,
}) {
  const {
    name = "Gist User",
    username = "gistuser",
    avatar,
    verified = false,
    bio,
    online = false,
  } = user;

  const content = (
    <>
      <ProfileAvatar
        uri={avatar}
        name={name}
        size={compact ? 48 : 56}
        showOnline={online}
      />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, compact && styles.compactName]}
            numberOfLines={1}
          >
            {name}
          </Text>

          {verified && <VerificationBadge size={16} />}
        </View>

        <GistId username={username} />

        {!compact && bio ? (
          <Text style={styles.bio} numberOfLines={1}>
            {bio}
          </Text>
        ) : null}
      </View>

      {showFollow && (
        <FollowButton
          following={following}
          loading={followLoading}
          onPress={onFollow}
          compact={compact}
        />
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          compact && styles.compactContainer,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Open ${name}'s profile`}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  compactContainer: {
    minHeight: 64,
    paddingVertical: 8,
  },

  info: {
    flex: 1,
    marginHorizontal: 12,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  name: {
    color: "#000",
    fontSize: 15,
    fontWeight: "750",
    maxWidth: "85%",
  },

  compactName: {
    fontSize: 14,
  },

  bio: {
    color: "#666",
    fontSize: 12,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.65,
  },
});
