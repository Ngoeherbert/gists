// app/(main)/feeds/edit/[id].jsx
// Edit an existing post. Prefills from feedStore and saves via editPost.

import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import config from "../../../../constants/config";
import spacing from "../../../../constants/spacing";
import typography from "../../../../constants/typography";
import useFeedStore from "../../../../stores/feedStore";
import useAppStore from "../../../../stores/appStore";
import { Header } from "../../../../components/common";
import { Avatar, Button, EmptyState, Input } from "../../../../components/ui";
import useAuthStore from "../../../../stores/authStore";

export default function EditPostScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const post = useFeedStore((s) => s.posts[id]);
  const editPost = useFeedStore((s) => s.editPost);
  const showToast = useAppStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);

  const [text, setText] = useState(post?.text ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      showToast("A post can't be empty", "warning");
      return;
    }
    setIsSaving(true);
    await editPost({ postId: id, patch: { text: trimmed, editedAt: Date.now() } });
    setIsSaving(false);
    showToast("Post updated", "success");
    router.back();
  }, [text, id, editPost, showToast, router]);

  if (!post) {
    return (
      <View style={styles.container}>
        <Header title="Edit post" showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Post unavailable"
          description="You can only edit posts that still exist."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Edit post"
        showBack
        right={
          <Button
            title="Save"
            size="small"
            loading={isSaving}
            disabled={!text.trim() || isSaving}
            onPress={save}
          />
        }
      />

      <View style={styles.body}>
        <View style={styles.authorRow}>
          <Avatar uri={user?.avatarUrl} name={user?.name} size="md" />
        </View>

        <Input
          value={text}
          onChangeText={setText}
          placeholder="What's on your mind?"
          multiline
          numberOfLines={8}
          maxLength={config.limits.maxPostTextLength}
          helperText={`${text.length}/${config.limits.maxPostTextLength}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: spacing.screenHorizontal,
  },
  authorRow: {
    marginBottom: spacing.md,
  },
});
