// app/(main)/chats/ai.jsx
// Gists AI assistant chat. Messages live in chatStore.ai; replies are stubbed
// until an AI provider is wired in. The composer itself is the shared
// components/chats/ChatInput, which gives it the same hold-or-swipe voice notes.

import React, { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../constants/colors";
import spacing from "../../../constants/spacing";
import useChatStore from "../../../stores/chatStore";
import useAppStore from "../../../stores/appStore";
import { Header, Screen } from "../../../components/common";
import { EmptyState, IconButton, Text } from "../../../components/ui";
import MessageBubble from "../../../components/chats/MessageBubble";
import ChatInput from "../../../components/chats/ChatInput";

export default function AiChatScreen() {
  const router = useRouter();
  const listRef = useRef(null);

  const ai = useChatStore((s) => s.ai);
  const appendAiMessage = useChatStore((s) => s.appendAiMessage);
  const setAiThinking = useChatStore((s) => s.setAiThinking);
  const clearAiThread = useChatStore((s) => s.clearAiThread);
  const showToast = useAppStore((s) => s.showToast);

  // Track the pending reply timeout so it can be cancelled on refresh/unmount.
  const replyTimeoutRef = useRef(null);

  const cancelPendingReply = useCallback(() => {
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setAiThinking(false);
  }, [setAiThinking]);

  useEffect(() => {
    return () => cancelPendingReply();
  }, [cancelPendingReply]);

  // A recording in progress is already signalled by the wave + timer inside
  // ChatInput, so the default "Recording..." toast is suppressed here.
  const handleRecordStart = useCallback(() => {}, []);

  const handleRecordStop = useCallback(
    (cancelled) => {
      showToast(
        cancelled ? "Recording cancelled" : "Voice message sent to Gists AI",
        cancelled ? "info" : "success",
      );
    },
    [showToast],
  );

  const handleAttachmentPress = useCallback(
    (item) => {
      showToast(`${item.label} attachment coming soon`, "info");
    },
    [showToast],
  );

  const messages = (ai.thread.ids ?? [])
    .map((id) => ai.thread.byId[id])
    .filter(Boolean);

  // ChatInput hands over the fully-formed message payload; the AI thread only
  // needs the text/ids, so the draft, cap and scroll-to-end stay in the composer.
  // Voice notes arrive with mediaType "voice" + text "" — store enough for the
  // bubble to render, then answer with a text reply.
  const handleSend = useCallback(
    ({ message }) => {
      appendAiMessage({
        id: message.id,
        text:
          message.mediaType === "voice"
            ? `🎤 Voice note (${message.duration ?? 0}s${message.viewOnce ? ", view once" : ""})`
            : message.text,
        isMine: true,
        createdAt: message.createdAt,
      });

      setAiThinking(true);

      // Auto scroll to bottom
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd?.({ animated: true });
      });

      // Placeholder reply until a real provider is connected.
      replyTimeoutRef.current = setTimeout(() => {
        replyTimeoutRef.current = null;
        appendAiMessage({
          id: `ai-${Date.now()}-reply`,
          text: "I'm not connected to a live model yet — wire up your API provider in chatStore to receive real-time intelligence!",
          isMine: false,
          senderName: "Gists AI",
          createdAt: new Date().toISOString(),
        });
        setAiThinking(false);
        requestAnimationFrame(() => {
          listRef.current?.scrollToEnd?.({ animated: true });
        });
      }, 900);
    },
    [appendAiMessage, setAiThinking],
  );

  const handleClear = () => {
    cancelPendingReply();
    clearAiThread();
    showToast("AI chat history cleared", "info");
  };

  const openChatInfo = () => {
    router.navigate(`/(main)/chats/info?id=ai`);
  };

  const HeaderTitle = () => (
    <View style={styles.headerTitleContainer}>
      <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
        <Ionicons name="sparkles" size={18} color={colors.white} />
        <View style={styles.onlineBadge} />
      </View>
      <View style={styles.titleColumn}>
        <Text variant="subtitle" color="default" numberOfLines={1}>
          Gists AI
        </Text>
        <Text variant="caption" color="tertiary" numberOfLines={1}>
          {ai.isThinking ? "Thinking…" : "Always active"}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen
      style={styles.container}
      padded={false}
      keyboardAvoiding={false}
      edges={["top"]}
      header={
        <Header
          showBack
          centerTitle={false}
          compactTitle
          title={<HeaderTitle />}
          subtitle={null}
          right={<IconButton name="information-outline" onPress={openChatInfo} />}
          border={false}
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.keyboardAvoiding}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            // Same speaker-change rule as the main chat thread: the last bubble
            // of a turn leaves extra room so a user message and the AI reply
            // never read as one block. No date dividers here, so there is
            // nothing to suppress the gap for.
            const nextMsg = messages[index + 1];
            const senderSwitchAfter =
              Boolean(nextMsg) &&
              (nextMsg.isMine !== item.isMine ||
                nextMsg.senderId !== item.senderId);
            return (
              <MessageBubble
                message={item}
                senderSwitchAfter={senderSwitchAfter}
              />
            );
          }}
          contentContainerStyle={
            messages.length === 0 ? styles.emptyContent : styles.content
          }
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd?.({ animated: false })
          }
          ListEmptyComponent={
            <EmptyState
              icon="sparkles-outline"
              title="Ask Gists AI anything"
              description="I can help you write captions, summarize chats, and discover new creators."
            />
          }
          ListFooterComponent={
            ai.isThinking ? (
              <View style={styles.thinkingContainer}>
                <View
                  style={[
                    styles.aiBadgeSmall,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons name="sparkles" size={14} color={colors.primary} />
                </View>
                <Text
                  variant="caption"
                  color="tertiary"
                  style={styles.thinkingText}
                >
                  Gists AI is thinking…
                </Text>
              </View>
            ) : null
          }
        />

        <ChatInput
          conversationId="ai"
          onSend={handleSend}
          listRef={listRef}
          onToast={showToast}
          placeholder="Message Gists AI…"
          micIcon="mic-outline"
          micIconFamily="ionicon"
          messageIdPrefix="ai"
          attachmentOptions={[
            { name: "camera-outline", label: "Camera", provider: "ionicons" },
            { name: "image-outline", label: "Photo", provider: "ionicons" },
            { name: "document-outline", label: "File", provider: "ionicons" },
          ]}
          onAttachmentPress={handleAttachmentPress}
          onRecordStart={handleRecordStart}
          onRecordStop={handleRecordStop}
          showViewOnce={false}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.background,
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
  },
  thinkingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  aiBadgeSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  thinkingText: {
    fontStyle: "italic",
  },
});
