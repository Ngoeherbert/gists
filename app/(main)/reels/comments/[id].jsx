// app/(main)/reels/comments/[id].jsx
// Comments sheet for a single reel, using the shared CommentRow + compose bar.

import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import config from "../../../../constants/config";
import layout from "../../../../constants/layout";
import spacing from "../../../../constants/spacing";
import typography from "../../../../constants/typography";
import useAppTheme from "../../../../hooks/useAppTheme";
import useReelStore from "../../../../stores/reelStore";
import useAppStore from "../../../../stores/appStore";
import useAuthStore from "../../../../stores/authStore";
import { Header } from "../../../../components/common";
import { Avatar, EmptyState, IconButton } from "../../../../components/ui";
import CommentRow from "../../../../components/feeds/CommentRow";

export default function ReelCommentsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useAppTheme();
  const inputRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const bucket = useReelStore((s) => s.comments[id]);
  const addComment = useReelStore((s) => s.addComment);
  const showToast = useAppStore((s) => s.showToast);

  const [draft, setDraft] = useState("");
  const comments = (bucket?.ids ?? [])
    .map((cid) => bucket.byId[cid])
    .filter(Boolean);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    addComment({
      reelId: id,
      comment: {
        id: `local-${Date.now()}`,
        text: text.slice(0, config.limits.maxCommentLength),
        author: user || { username: "you" },
        createdAt: new Date().toISOString(),
        likesCount: 0,
        isLiked: false,
      },
    });
    setDraft("");
    showToast("Comment posted", "success");
  }, [draft, id, addComment, user, showToast]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Comments" showBack />

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentRow postId={id} comment={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          comments.length === 0 ? styles.emptyContent : styles.content
        }
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No comments yet"
            description="Be the first to comment on this reel."
          />
        }
      />

      <View
        style={[
          styles.composer,
          {
            paddingBottom: Math.max(insets.bottom, spacing.sm),
            backgroundColor: isDark ? colors.surface : colors.white,
            borderTopColor: isDark ? colors.border : theme.colors.border,
          },
        ]}
      >
        <Avatar uri={user?.avatarUrl} name={user?.name} size="sm" />

        <Pressable
          style={[
            styles.inputWrap,
            {
              backgroundColor: isDark ? colors.chatInput : theme.app.input,
              borderColor: isDark ? colors.border : theme.colors.border,
            },
          ]}
          onPress={() => inputRef.current?.focus()}
        >
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="Add a comment…"
            placeholderTextColor={theme.text.tertiary}
            maxLength={config.limits.maxCommentLength}
            multiline
            style={[
              styles.input,
              { color: theme.text.primary, fontSize: typography.size.md },
            ]}
          />
        </Pressable>

        <IconButton
          name="send"
          background={draft.trim() ? theme.colors.primary : "transparent"}
          color={draft.trim() ? colors.white : theme.text.tertiary}
          disabled={!draft.trim()}
          onPress={send}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: spacing.sm,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    borderTopWidth: layout.borderWidth.thin,
  },
  inputWrap: {
    flex: 1,
    marginHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.round,
    borderWidth: layout.borderWidth.thin,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 120,
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});
