// app/(main)/profile/[id].jsx
// Another user's public profile, reached from feeds, comments and chats.

import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useProfileStore from "../../../stores/profileStore";
import useAppStore from "../../../stores/appStore";
import { Header } from "../../../components/common";
import { EmptyState, IconButton } from "../../../components/ui";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileTabs from "../../../components/profile/ProfileTabs";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const profile = useProfileStore((s) => s.profiles[id]);
  const isFollowing = useProfileStore((s) => s.following.includes(id));
  const toggleFollow = useProfileStore((s) => s.toggleFollow);
  const showToast = useAppStore((s) => s.showToast);

  const handleFollow = useCallback(async () => {
    await toggleFollow({ userId: id });
    showToast(isFollowing ? "Unfollowed" : "Following", "success");
  }, [toggleFollow, id, isFollowing, showToast]);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Header title="Profile" showBack />
        <EmptyState
          icon="person-outline"
          title="Profile unavailable"
          description="This account may have been removed or made private."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={profile.username || "Profile"}
        showBack
        right={
          <IconButton
            name="ellipsis-horizontal"
            onPress={() => showToast("Profile options", "info")}
          />
        }
      />

      <ProfileTabs
        userId={id}
        ListHeaderComponent={
          <ProfileHeader
            profile={profile}
            isFollowing={isFollowing}
            onPressFollow={handleFollow}
            onPressShare={() => router.push("/(main)/profile/share")}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
