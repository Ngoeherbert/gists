// components/profile/UserRow.jsx
// A person in a connection list (followers / following): avatar, name, handle,
// and a follow/unfollow control.

import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../constants/spacing";
import useProfileStore from "../../stores/profileStore";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Text from "../ui/Text";

function UserRow({ user }) {
  const router = useRouter();
  const following = useProfileStore((s) => s.following);
  const toggleFollow = useProfileStore((s) => s.toggleFollow);

  if (!user) return null;
  const isFollowing = following.includes(user.id);

  return (
    <Pressable
      style={styles.row}
      onPress={() => router.navigate(`/profile/${user.id}`)}
    >
      <Avatar
        uri={user.avatarUrl}
        name={user.name || user.username}
        size="md"
        online={user.isOnline}
      />

      <View style={styles.body}>
        <Text variant="bodyMedium" numberOfLines={1}>
          {user.name || user.username}
        </Text>
        <Text variant="caption" color="tertiary" numberOfLines={1}>
          @{user.username}
        </Text>
      </View>

      <Button
        title={isFollowing ? "Following" : "Follow"}
        variant={isFollowing ? "ghost" : "outline"}
        size="small"
        onPress={() => toggleFollow({ userId: user.id })}
      />
    </Pressable>
  );
}

export default memo(UserRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
});
