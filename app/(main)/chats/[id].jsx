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
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import { Header, Screen } from "../../../components/common";
import { Avatar, EmptyState, IconButton, Text } from "../../../components/ui";
import MessageBubble from "../../../components/chats/MessageBubble";

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useAppTheme();
  const listRef = useRef(null);

  // Hide bottom tab bar
  React.useLayoutEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
    return () => navigation.setOptions({ tabBarVisible: true });
  }, [navigation]);

  const user = useAuthStore((s) => s.user);
  const conversation = useChatStore((s) => s.conversationsById[id]);
  const thread = useChatStore((s) => s.threads[id]);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const showToast = useAppStore((s) => s.showToast);
  const typing = useChatStore((s) => s.typing[id]);
  const fetchMessages = useChatStore((s) => s.fetchMessages);

  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [waveAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setActiveConversation(id);
    // Load messages if thread doesn't exist or is empty
    if (!thread?.ids?.length) {
      fetchMessages({ conversationId: id });
    }
  }, [id, setActiveConversation, thread?.ids?.length, fetchMessages]);

  const messages = (thread?.ids ?? []).map((mid) => thread.byId[mid]).filter(Boolean);

  const peer = conversation?.participants?.[0] || {};
  const isGroup = conversation?.type === "group";
  const title = isGroup ? conversation.name : peer.name || peer.username;

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text && !replyTo) return;

    sendMessage({
      conversationId: id,
      message: {
        id: `local-${Date.now()}`,
        text: text.slice(0, config.limits.maxMessageLength),
        senderId: user?.id,
        senderName: user?.name,
        senderAvatar: user?.avatarUrl,
        isMine: true,
        createdAt: new Date().toISOString(),
        status: "sent",
        replyTo: replyTo
          ? {
              id: replyTo.id,
              text: replyTo.text?.slice(0, 100),
              senderName: replyTo.isMine ? "You" : (replyTo.senderName || "Unknown"),
            }
          : undefined,
      },
    });
    setDraft("");
    setReplyTo(null);
    setTyping(id, user?.id, false);
    requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));
  }, [draft, id, sendMessage, setTyping, user?.id, replyTo]);

  const onChangeText = useCallback(
    (value) => {
      setDraft(value);
      setTyping(id, user?.id, value.length > 0);
    },
    [id, setTyping, user?.id]
  );

  // Clear the typing flag when the chat screen is left.
  useEffect(() => {
    return () => {
      setTyping(id, user?.id, false);
    };
  }, [id, setTyping, user?.id]);

  const typingUsers = typing
    ? Object.entries(typing)
        .filter(([_, expires]) => expires > Date.now())
        .map(([userId]) => conversation?.participants?.find((p) => p.id === userId)?.name)
        .filter(Boolean)
    : [];

  const typingText = typingUsers.length > 0
    ? typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : `${typingUsers.slice(0, 2).join(", ")} are typing...`
    : null;

  const handleLongPress = useCallback((message) => {
    if (!message.isMine) {
      setReplyTo(message);
    }
  }, []);

  // Voice recording animation
  useEffect(() => {
    if (isRecording) {
      waveAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(waveAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isRecording, waveAnim]);

  const startRecording = () => {
    setIsRecording(true);
    setDraft("");
    showToast("Recording...", "info");
  };

  const stopRecording = () => {
    setIsRecording(false);
    showToast("Voice note sent", "success");
  };

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
                style={[styles.stackAvatar, { zIndex: 3 - i, marginLeft: i > 0 ? -12 : 0 }]}
              />
            ))}
            {participants.length > 3 && (
              <View style={[styles.stackAvatar, styles.stackMore, { zIndex: 0 }]}>
                <Text variant="caption" color="default" style={{ fontWeight: "600", fontSize: 10 }}>
                  +{participants.length - 3}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.titleColumn}>
            <Text variant="subtitle" color="default" numberOfLines={1}>
              {title}
            </Text>
            {subtitle && <Text variant="caption" color="tertiary" numberOfLines={1}>{subtitle}</Text>}
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
          <Text variant="subtitle" color="default" numberOfLines={1} onPress={openProfile}>
            {title}
          </Text>
          {subtitle && <Text variant="caption" color="tertiary" numberOfLines={1}>{subtitle}</Text>}
        </View>
      </View>
    );
  };


  return (
    <Screen
      style={styles.container}
      padded={false}
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
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const prevMsg = messages[index - 1];
          const showAvatar = item.isMine
            ? false
            : !prevMsg || prevMsg.isMine || prevMsg.senderId !== item.senderId;
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

      {replyTo && (
        <View style={styles.replyBar}>
          <Pressable onPress={() => setReplyTo(null)} style={styles.replyClose}>
            <MaterialCommunityIcons
              name="close"
              size={16}
              color={theme.text.tertiary}
            />
          </Pressable>
          <View style={styles.replyPreview}>
            <View
              style={{
                width: 3,
                height: "100%",
                backgroundColor: theme.colors.primary,
                borderRadius: 1.5,
              }}
            />
            <View
              style={{
                flex: 1,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
              }}
            >
              <Text
                variant="caption"
                color="primary"
                style={{ fontWeight: "600" }}
              >
                Replying to{" "}
                {replyTo.isMine ? "you" : replyTo.senderName || "Unknown"}
              </Text>
              <Text variant="caption" color="tertiary" numberOfLines={1}>
                {replyTo.text?.slice(0, 50)}
              </Text>
            </View>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
        style={styles.keyboardAvoiding}
      >
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
          <Pressable
            onPress={() => setShowAttachments(!showAttachments)}
            style={styles.attachButton}
          >
            <Ionicons
              name={showAttachments ? "remove-circle-outline" : "add"}
              size={24}
              color={theme.text.secondary}
            />
          </Pressable>

          {showAttachments && (
            <View style={styles.attachmentRow}>
              {[
                { name: "image-outline", label: "Photo" },
                { name: "videocam-outline", label: "Video" },
                { name: "document-outline", label: "File" },
                { name: "location-outline", label: "Location" },
                { name: "contact-outline", label: "Contact" },
              ].map((item) => (
                <Pressable
                  key={item.label}
                  style={styles.attachmentItem}
                  onPress={() => showToast(`${item.label} coming soon`, "info")}
                >
                  <View style={styles.attachmentIcon}>
                    <Ionicons
                      name={item.name}
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text
                    variant="caption"
                    color="default"
                    style={styles.attachmentLabel}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.inputWrap}>
            <TextInput
              value={draft}
              onChangeText={onChangeText}
              placeholder="Message…"
              placeholderTextColor={theme.text.tertiary}
              maxLength={config.limits.maxMessageLength}
              multiline
              style={[
                styles.input,
                { color: theme.text.primary, fontSize: typography.size.md },
              ]}
            />
          </View>

          {draft.trim() || replyTo ? (
            <Pressable onPress={send} style={styles.sendButton}>
              <Ionicons name="send" size={24} color={colors.white} />
            </Pressable>
          ) : (
            <Pressable
              onPressIn={startRecording}
              onPressOut={stopRecording}
              onPress={stopRecording}
              style={styles.voiceButton}
            >
              <Animated.View style={styles.waveContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.waveBar,
                      {
                        transform: [
                          {
                            scaleY: waveAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.2, 1 - i * 0.1],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            </Pressable>
          )}
        </View>
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
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopWidth: layout.borderWidth.thin,
    borderTopColor: colors.border,
  },
  attachButton: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  inputWrap: {
    flex: 1,
    marginHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.lg,
    borderWidth: layout.borderWidth.thin,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 120,
    backgroundColor: isDark ? colors.chatInput : theme.app.input,
    borderColor: isDark ? colors.border : theme.colors.border,
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0,
    color: theme.text.primary,
    fontSize: typography.size.md,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
    marginBottom: spacing.xs,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
    marginBottom: spacing.xs,
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    height: 20,
  },
  waveBar: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  replyBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + "10",
    borderBottomWidth: layout.borderWidth.thin,
    borderBottomColor: colors.border,
  },
  replyClose: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  replyPreview: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
  },
});