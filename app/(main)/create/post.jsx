// app/(main)/create/post.jsx
// New post composer. Publishes through feedStore.createPost.

import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../../constants/spacing";
import useFeedStore from "../../../stores/feedStore";
import useAppStore from "../../../stores/appStore";
import useAuthStore from "../../../stores/authStore";
import { Header, Screen } from "../../../components/common";
import PostComposer from "../../../components/feeds/PostComposer";

export default function CreatePostScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const createPost = useFeedStore((s) => s.createPost);
  const showToast = useAppStore((s) => s.showToast);

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = useCallback(
    async ({ text, media, mediaUrl }) => {
      setIsSaving(true);
      const post = await createPost({
        payload: {
          text,
          media,
          mediaUrl,
          author: {
            id: user?.id,
            name: user?.name,
            username: user?.username,
            avatarUrl: user?.avatarUrl,
          },
          createdAt: new Date().toISOString(),
        },
      });
      setIsSaving(false);

      if (post) {
        showToast("Post published", "success");
        router.replace("/(main)/feeds");
      } else {
        showToast("Couldn't publish your post", "error");
      }
    },
    [createPost, user, showToast, router]
  );

  return (
    <Screen padded={false} header={<Header title="New post" showBack />}>

      <View style={styles.body}>
        <PostComposer
          avatarUri={user?.avatarUrl}
          displayName={user?.name || user?.username}
          submitLabel="Publish"
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: spacing.screenHorizontal,
  },
});
