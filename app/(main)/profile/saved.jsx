// app/(main)/profile/saved.jsx
// Posts the signed-in user has saved. Private to the owner.

import React from "react";
import ProfileListScreen from "../../../components/profile/ProfileListScreen";
import PostCard from "../../../components/feeds/PostCard";

export default function ProfileSavedScreen() {
  return (
    <ProfileListScreen
      type="saved"
      title="Saved"
      emptyIcon="bookmark-outline"
      emptyTitle="Nothing saved yet"
      emptyDescription="Tap the bookmark on any post to save it here for later."
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
