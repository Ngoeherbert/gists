// app/(main)/chats/[id].jsx
// Individual conversation: message thread, typing indicator, and a composer
// with attach / voice-note affordances. Sending writes into chatStore.

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../constants/colors";
import config from "../../../constants/config";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import typography from "../../../constants/typography";
import useAppTheme from "../../../hooks/useAppTheme";
import useChatStore from "../../../stores/chatStore";
import useAppStore from "../../../stores/appStore";
import useAuthStore from "../../../stores/authStore";
import { Header } from "../../../components/common";
import { Avatar, EmptyState, IconButton, Text } from "../../../components/ui";
import MessageBubble from "../../../components/chats/MessageBubble";

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useAppTheme();
  const listRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const conversation = useChatStore((s) => s.conversationsById[id]);
  const thread = useChatStore((s) => s.threads[id]);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const showToast = useAppStore((s) => s.showToast);

  const [draft, setDraft] = useState("");

  useEffect(() => {
    setActiveConversation(id);
  }, [id, setActiveConversation]);

  const messages = (thread?.ids ?? []).map((mid) => thread.byId[mid]).filter(Boolean);

  const peer = conversation?.participants?.[0] || {};
  const title = conversation?.type === "group" ? conversation.name : peer.name || peer.username;

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    sendMessage({
      conversationId: id,
      message: {
        id: `local-${Date.now()}`,
        text: text.slice(0, config.limits.maxMessageLength),
        senderId: user?.id,
        isMine: true,
        createdAt: new Date().toISOString(),
        status: "sent",
      },
    });
    setDraft("");
    setTyping(id, user?.id, false);
    requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));
  }, [draft, id, sendMessage, setTyping, user?.id]);

  const onChangeText = useCallback(
    (value) => {
      setDraft(value);
      setTyping(id, user?.id, value.length > 0);
    },
    [id, setTyping, user?.id]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header
        title={title || "Chat"}
        subtitle={peer.isOnline ? "online" : undefined}
        showBack
        right={
          <View style={styles.headerActions}>
            <IconButton
              name="call-outline"
              onPress={() => router.push(`/(main)/chats/call/voice?id=${id}`)}
            />
            <IconButton
              name="videocam-outline"
              onPress={() => router.push(`/(main)/chats/call/video?id=${id}`)}
            />
          </View>
        }
      />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={messages.length === 0 ? styles.emptyContent : styles.content}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: false })}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-outline"
            title="No messages yet"
            description={`Say hi to ${title || "them"} — this conversation is just getting started.`}
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
        <IconButton name="add" onPress={() => showToast("Attachments coming soon", "info")} />

        <Pressable
          style={[
            styles.inputWrap,
            {
              backgroundColor: isDark ? colors.chatInput : theme.app.input,
              borderColor: isDark ? colors.border : theme.colors.border,
            },
          ]}
        >
          <TextInput
            value={draft}
            onChangeText={onChangeText}
            placeholder="Message…"
            placeholderTextColor={theme.text.tertiary}
            maxLength={config.limits.maxMessageLength}
            multiline
            style={[styles.input, { color: theme.text.primary, fontSize: typography.size.md }]}
          />
        </Pressable>

        {draft.trim() ? (
          <IconButton name="send" background={theme.colors.primary} color={colors.white} onPress={send} />
        ) : (
          <IconButton
            name="mic-outline"
            onPress={() => showToast("Voice notes coming soon", "info")}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    paddingVertical: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: layout.borderWidth.thin,
  },
  inputWrap: {
    flex: 1,
    marginHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.lg,
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
