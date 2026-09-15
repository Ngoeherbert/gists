// app/(main)/profile/likes.jsx
// Posts this account has liked.

import React from "react";
import ProfileListScreen from "../../../components/profile/ProfileListScreen";
import PostCard from "../../../components/feeds/PostCard";

export default function ProfileLikesScreen() {
  return (
    <ProfileListScreen
      type="likes"
      title="Likes"
      emptyIcon="heart-outline"
      emptyTitle="No likes yet"
      emptyDescription="Posts this account likes will be collected here."
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
