import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

export default function FollowButton({
  following = false,
  onPress,
  loading = false,
  disabled = false,
  compact = false,
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={following ? "Unfollow user" : "Follow user"}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        following ? styles.following : styles.notFollowing,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={following ? "#000" : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            following ? styles.followingText : styles.notFollowingText,
          ]}
        >
          {following ? "Following" : "Follow"}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 110,
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  compact: {
    minWidth: 88,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 16,
  },

  notFollowing: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  following: {
    backgroundColor: "#fff",
    borderColor: "#D9D9D9",
  },

  text: {
    fontSize: 14,
    fontWeight: "700",
  },

  notFollowingText: {
    color: "#fff",
  },

  followingText: {
    color: "#000",
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
});
