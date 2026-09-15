// app/(main)/profile/index.jsx
// The signed-in user's own profile: header, content tabs and settings entry.

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "../../../stores/authStore";
import useProfileStore from "../../../stores/profileStore";
import { Header, Screen } from "../../../components/common";
import { IconButton } from "../../../components/ui";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileTabs from "../../../components/profile/ProfileTabs";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const me = useProfileStore((s) => s.me);
  const fetchMe = useProfileStore((s) => s.fetchMe);

  // Fall back to the auth user until a full profile is fetched.
  const profile = me || user;

  // Load the complete profile record for the signed-in user.
  useEffect(() => {
    if (!me) fetchMe();
  }, [me, fetchMe]);

return (
    <Screen
      edges={["top"]}
      header={
        <Header
          title={profile?.username || "Profile"}
          right={
            <View style={styles.actions}>
              <IconButton name="qr-code-outline" onPress={() => router.navigate("/profile/share")} />
              <IconButton name="settings-outline" onPress={() => router.navigate("/(main)/profile/settings")} />
            </View>
          }
        />
      }
    >
      <ProfileTabs userId="me" ListHeaderComponent={
        <ProfileHeader
          profile={profile}
          isMe
          onPressEdit={() => router.navigate("/(main)/profile/edit")}
          onPressShare={() => router.navigate("/profile/share")}
          onPressFollowers={() => router.navigate("/(main)/profile/gisties")}
          onPressFollowing={() => router.navigate("/(main)/profile/following")}
        />
      } />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
