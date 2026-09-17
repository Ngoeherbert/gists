// app/(main)/chats/[id].jsx
// Individual conversation: message thread, typing indicator, and a composer
// with attach / voice-note affordances. Sending writes into chatStore.

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import colors from "../../../constants/colors";
import spacing from "../../../constants/spacing";
import useChatStore from "../../../stores/chatStore";
import useAppStore from "../../../stores/appStore";
import useAuthStore from "../../../stores/authStore";
import { Header, Screen } from "../../../components/common";
import { Avatar, EmptyState, IconButton, Text } from "../../../components/ui";
import MessageBubble from "../../../components/chats/MessageBubble";
import ChatInput from "../../../components/chats/ChatInput";

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const listRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const conversation = useChatStore((s) => s.conversationsById[id]);
  const thread = useChatStore((s) => s.threads[id]);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const showToast = useAppStore((s) => s.showToast);
  const typing = useChatStore((s) => s.typing[id]);
  const fetchMessages = useChatStore((s) => s.fetchMessages);

  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    setActiveConversation(id);
    // Load messages if thread doesn't exist or is empty
    if (!thread?.ids?.length) {
      fetchMessages({ conversationId: id });
    }
  }, [id, setActiveConversation, thread?.ids?.length, fetchMessages]);

  const messages = (thread?.ids ?? [])
    .map((mid) => thread.byId[mid])
    .filter(Boolean);

  const peer = conversation?.participants?.[0] || {};
  const isGroup = conversation?.type === "group";
  const title = isGroup ? conversation.name : peer.name || peer.username;

  // The composer (components/chats/ChatInput) owns the draft, recording and
  // attachment-sheet state. It reports typing changes so the store can broadcast
  // them to the other participants.
  const handleTyping = useCallback(
    (isTyping) => {
      setTyping(id, user?.id, isTyping);
    },
    [id, setTyping, user?.id],
  );

  const typingUsers = typing
    ? Object.entries(typing)
        .filter(([_, expires]) => expires > Date.now())
        .map(
          ([userId]) =>
            conversation?.participants?.find((p) => p.id === userId)?.name,
        )
        .filter(Boolean)
    : [];

  const typingText =
    typingUsers.length > 0
      ? typingUsers.length === 1
        ? `${typingUsers[0]} is typing...`
        : `${typingUsers.slice(0, 2).join(", ")} are typing...`
      : null;

  const handleLongPress = useCallback((message) => {
    if (!message.isMine) {
      setReplyTo(message);
    }
  }, []);

  const openProfile = () => {
    if (!isGroup && peer.id) {
      router.navigate(`/(main)/profile/${peer.id}`);
    }
  };

  const subtitle = typingText || (peer.isOnline ? "online" : undefined);

  // Build header title with avatar(s) next to name
  const HeaderTitle = () => {
    if (isGroup) {
      const participants = conversation?.participants || [];
      // Show up to 3 avatars for groups
      const displayParticipants = participants.slice(0, 3);
      return (
        <View style={styles.groupTitle}>
          <View style={styles.avatarStack}>
            {displayParticipants.map((p, i) => (
              <Avatar
                key={p.id}
                uri={p.avatarUrl}
                name={p.name}
                size="sm"
                style={[
                  styles.stackAvatar,
                  { zIndex: 3 - i, marginLeft: i > 0 ? -12 : 0 },
                ]}
              />
            ))}
            {participants.length > 3 && (
              <View
                style={[styles.stackAvatar, styles.stackMore, { zIndex: 0 }]}
              >
                <Text
                  variant="caption"
                  color="default"
                  style={{ fontWeight: "600", fontSize: 10 }}
                >
                  +{participants.length - 3}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.titleColumn}>
            <Text variant="subtitle" color="default" numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text variant="caption" color="tertiary" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      );
    }
    // Direct message - single avatar next to name
    return (
      <View style={styles.dmTitle}>
        <Avatar
          uri={peer.avatarUrl}
          name={peer.name}
          size="md"
          online={peer.isOnline}
        />
        <View style={styles.titleColumn}>
          <Text
            variant="subtitle"
            color="default"
            numberOfLines={1}
            onPress={openProfile}
          >
            {title}
          </Text>
          {subtitle && (
            <Text variant="caption" color="tertiary" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    );
  };

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
          right={
            <View style={styles.headerActions}>
              <IconButton
                name="call-outline"
                onPress={() =>
                  router.navigate(`/(main)/chats/call/voice?id=${id}`)
                }
              />
              <IconButton
                name="videocam-outline"
                onPress={() =>
                  router.navigate(`/(main)/chats/call/video?id=${id}`)
                }
              />
            </View>
          }
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
            const prevMsg = messages[index - 1];
            const showAvatar = item.isMine
              ? false
              : !prevMsg ||
                prevMsg.isMine ||
                prevMsg.senderId !== item.senderId;
            const showName = isGroup && !item.isMine && showAvatar;
            return (
              <MessageBubble
                message={item}
                onLongPress={handleLongPress}
                showAvatar={showAvatar}
                showName={showName}
                isGroup={isGroup}
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
              icon="chatbubble-outline"
              title="No messages yet"
              description={`Say hi to ${title || "them"} — this conversation is just getting started.`}
            />
          }
        />

        <ChatInput
          key={id}
          conversationId={id}
          user={user}
          onSend={sendMessage}
          onTyping={handleTyping}
          replyTo={replyTo}
          onReplyChange={setReplyTo}
          listRef={listRef}
          onToast={showToast}
        />
      </KeyboardAvoidingView>
    </Screen>
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
  groupTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarStack: {
    flexDirection: "row",
  },
  stackAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.background,
  },
  stackMore: {
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  dmTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
  },
  content: {
    paddingVertical: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
