// app/profile/[id].jsx
// Another user's public profile, reached from feeds, comments and chats.

import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useAuthStore from "../../stores/authStore";
import useProfileStore from "../../stores/profileStore";
import useAppStore from "../../stores/appStore";
import { Header, Screen } from "../../components/common";
import { EmptyState, IconButton, Loading } from "../../components/ui";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs from "../../components/profile/ProfileTabs";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const storedProfile = useProfileStore((s) => (id === "me" ? s.me : s.profiles[id]));
  const isLoadingProfile = useProfileStore((s) => s.isLoadingProfile);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const isFollowing = useProfileStore((s) => s.following.includes(id));
  const toggleFollow = useProfileStore((s) => s.toggleFollow);
  const showToast = useAppStore((s) => s.showToast);

  // Own-profile links can fall back to the signed-in user, like the profile tab.
  const profile = id === "me" ? storedProfile || user : storedProfile;

  // Fetch the profile the first time an id is shown (cold store, deep links).
  const requestedIds = useRef(new Set());
  useEffect(() => {
    if (!id || id === "me" || storedProfile) return;
    if (requestedIds.current.has(id)) return;
    requestedIds.current.add(id);
    fetchProfile({ userId: id });
  }, [id, storedProfile, fetchProfile]);

  const handleFollow = useCallback(async () => {
    await toggleFollow({ userId: id });
    showToast(isFollowing ? "Unfollowed" : "Following", "success");
  }, [toggleFollow, id, isFollowing, showToast]);

  if (!profile) {
    return (
      <Screen header={<Header title="Profile" showBack />}>
        {isLoadingProfile ? (
          <Loading label="Loading profile…" />
        ) : (
          <EmptyState
            icon="person-outline"
            title="Profile unavailable"
            description="This account may have been removed or made private."
          />
        )}
      </Screen>
    );
  }

  return (
    <Screen
      header={
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
      }
    >
      <ProfileTabs
        userId={id}
        ListHeaderComponent={
          <ProfileHeader
            profile={profile}
            isFollowing={isFollowing}
            onPressFollow={handleFollow}
            onPressShare={() => router.navigate(`/profile/share?id=${id}`)}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
