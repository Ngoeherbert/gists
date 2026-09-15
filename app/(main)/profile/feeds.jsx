// app/(main)/profile/feeds.jsx
// The user's posts, as a list.

import React from "react";
import ProfileListScreen from "../../../components/profile/ProfileListScreen";
import PostCard from "../../../components/feeds/PostCard";

export default function ProfileFeedsScreen() {
  return (
    <ProfileListScreen
      type="posts"
      title="Posts"
      emptyIcon="newspaper-outline"
      emptyTitle="No posts yet"
      emptyDescription="Posts from this account will appear here."
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
