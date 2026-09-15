// app/(main)/profile/following.jsx
// Accounts this user follows.

import React from "react";
import ProfileListScreen from "../../../components/profile/ProfileListScreen";
import UserRow from "../../../components/profile/UserRow";

export default function ProfileFollowingScreen() {
  return (
    <ProfileListScreen
      type="following"
      title="Following"
      emptyIcon="people-outline"
      emptyTitle="Not following anyone yet"
      emptyDescription="Accounts this user follows will show up here."
      renderItem={({ item }) => <UserRow user={item} />}
    />
  );
}
