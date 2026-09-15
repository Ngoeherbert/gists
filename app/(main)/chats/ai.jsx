// app/(main)/chats/ai.jsx
// Gists AI assistant chat. Messages live in chatStore.ai; replies are stubbed
// until an AI provider is wired in.

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../constants/colors";
import config from "../../../constants/config";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import typography from "../../../constants/typography";
import useAppTheme from "../../../hooks/useAppTheme";
import useChatStore from "../../../stores/chatStore";
import { Header, Screen } from "../../../components/common";
import { EmptyState, IconButton, Text } from "../../../components/ui";
import MessageBubble from "../../../components/chats/MessageBubble";

const SUGGESTIONS = [
  "Summarise my unread chats",
  "Draft a caption for my reel",
  "Who should I follow?",
];

export default function AiChatScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useAppTheme();
  const inputRef = useRef(null);

  const ai = useChatStore((s) => s.ai);
  const appendAiMessage = useChatStore((s) => s.appendAiMessage);
  const setAiThinking = useChatStore((s) => s.setAiThinking);
  const clearAiThread = useChatStore((s) => s.clearAiThread);

  const [draft, setDraft] = useState("");

  // Track the pending reply timeout so it can be cancelled on refresh/unmount.
  const replyTimeoutRef = useRef(null);

  const cancelPendingReply = useCallback(() => {
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setAiThinking(false);
  }, [setAiThinking]);

  // Never let a delayed reply update the store after we leave the screen.
  useEffect(() => {
    return () => cancelPendingReply();
  }, [cancelPendingReply]);

  const messages = (ai.thread.ids ?? []).map((id) => ai.thread.byId[id]).filter(Boolean);

  const send = useCallback(
    (text) => {
      const value = (text ?? draft).trim();
      if (!value) return;

      appendAiMessage({
        id: `ai-${Date.now()}`,
        text: value.slice(0, config.limits.maxMessageLength),
        isMine: true,
        createdAt: new Date().toISOString(),
      });
      setDraft("");

      setAiThinking(true);
      // Placeholder reply until a real provider is connected.
      replyTimeoutRef.current = setTimeout(() => {
        replyTimeoutRef.current = null;
        appendAiMessage({
          id: `ai-${Date.now()}-reply`,
          text: "I'm not connected to a model yet — wire up a provider in the AI chat store to get real answers.",
          isMine: false,
          createdAt: new Date().toISOString(),
        });
        setAiThinking(false);
      }, 700);
    },
    [draft, appendAiMessage, setAiThinking]
  );

  return (
    <Screen
      style={styles.container}
      padded={false}
      header={<Header
        title="Gists AI"
        subtitle="Your assistant"
        showBack
        right={
          <IconButton
            name="refresh-outline"
            onPress={() => {
              cancelPendingReply();
              clearAiThread();
            }}
          />
        }
      />}
    >

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={messages.length === 0 ? styles.emptyContent : styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="sparkles-outline"
            title="Ask me anything"
            description="I can help you write captions, summarise chats and find people to follow."
          />
        }
        ListFooterComponent={
          ai.isThinking ? (
            <View style={styles.thinking}>
              <Text variant="caption" color="tertiary">
                Thinking…
              </Text>
            </View>
          ) : null
        }
      />

      {messages.length === 0 ? (
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((suggestion) => (
            <View
              key={suggestion}
              style={[
                styles.suggestion,
                {
                  backgroundColor: isDark ? colors.surface : theme.app.surface,
                  borderColor: isDark ? colors.border : theme.colors.border,
                },
              ]}
            >
              <Text variant="bodySmall" color="secondary_text" onPress={() => send(suggestion)}>
                {suggestion}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

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
        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: isDark ? colors.chatInput : theme.app.input,
              borderColor: isDark ? colors.border : theme.colors.border,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="Message Gists AI…"
            placeholderTextColor={theme.text.tertiary}
            onSubmitEditing={() => send()}
            style={[styles.input, { color: theme.text.primary, fontSize: typography.size.md }]}
          />
        </View>

        <IconButton
          name="send"
          background={draft.trim() ? theme.colors.primary : "transparent"}
          color={draft.trim() ? colors.white : theme.text.tertiary}
          disabled={!draft.trim()}
          onPress={() => send()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  thinking: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
  },
  suggestions: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.md,
  },
  suggestion: {
    borderRadius: layout.borderRadius.md,
    borderWidth: layout.borderWidth.thin,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});
