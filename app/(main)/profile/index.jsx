// app/(main)/profile/index.jsx
// The signed-in user's own profile: header, content tabs and settings entry.

import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "../../../stores/authStore";
import useProfileStore from "../../../stores/profileStore";
import { Header } from "../../../components/common";
import { IconButton } from "../../../components/ui";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileTabs from "../../../components/profile/ProfileTabs";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const me = useProfileStore((s) => s.me);

  // Fall back to the auth user until a full profile is fetched.
  const profile = me || user;

  return (
    <View style={styles.container}>
      <Header
        title={profile?.username || "Profile"}
        right={
          <View style={styles.actions}>
            <IconButton name="qr-code-outline" onPress={() => router.push("/(main)/profile/share")} />
            <IconButton name="settings-outline" onPress={() => router.push("/(main)/profile/settings")} />
          </View>
        }
      />

      <ProfileTabs userId="me" ListHeaderComponent={
        <ProfileHeader
          profile={profile}
          isMe
          onPressEdit={() => router.push("/(main)/profile/edit")}
          onPressShare={() => router.push("/(main)/profile/share")}
          onPressFollowers={() => router.push("/(main)/profile/gisties")}
          onPressFollowing={() => router.push("/(main)/profile/following")}
        />
      } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
