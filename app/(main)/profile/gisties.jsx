// app/(main)/profile/gisties.jsx
// "Gisties" — the accounts following this user.

import React from "react";
import ProfileListScreen from "../../../components/profile/ProfileListScreen";
import UserRow from "../../../components/profile/UserRow";

export default function ProfileGistiesScreen() {
  return (
    <ProfileListScreen
      type="followers"
      title="Gisties"
      emptyIcon="people-outline"
      emptyTitle="No gisties yet"
      emptyDescription="People who follow this account will appear here."
      renderItem={({ item }) => <UserRow user={item} />}
    />
  );
}
