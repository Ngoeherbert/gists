// app/(main)/chats/[id].jsx
// Individual conversation: message thread, typing indicator, and a composer
// with attach / voice-note affordances. Sending writes into chatStore.

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useChatStore from "../../../stores/chatStore";
import useAppStore from "../../../stores/appStore";
import useAuthStore from "../../../stores/authStore";
import useAppTheme from "../../../hooks/useAppTheme";
import { Header, Screen } from "../../../components/common";
import { Avatar, EmptyState, IconButton, Text } from "../../../components/ui";
import MessageBubble from "../../../components/chats/MessageBubble";
import ChatInput from "../../../components/chats/ChatInput";
import VoicePlayer from "../../../components/chats/VoicePlayer";

// View-once reveal helpers (the preview modal over the chat screen).
function fmtTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Full-screen video surface for media previews (expo-video, SDK 54). Rendered
// only while a video preview is open, so the player hook lives and dies with
// the preview. Autoplays; ✕ closes and unmounts it.
function VideoPreviewLayer({ uri }) {
  const player = useVideoPlayer(uri, (p) => {
    p.play();
  });
  return (
    <VideoView
      style={styles.revealMediaFull}
      player={player}
      contentFit="contain"
      allowsFullscreen
      allowsPictureInPicture={false}
    />
  );
}

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
  const downloadViewOnceMessage = useChatStore((s) => s.downloadViewOnceMessage);
  const markViewOnceViewed = useChatStore((s) => s.markViewOnceViewed);
  const showToast = useAppStore((s) => s.showToast);
  const { isDark } = useAppTheme();
  const typing = useChatStore((s) => s.typing[id]);
  const fetchMessages = useChatStore((s) => s.fetchMessages);

  const [replyTo, setReplyTo] = useState(null);
  // View-once message currently revealed in the full-screen preview modal.
  const [reveal, setReveal] = useState(null);
  // Regular media message currently open in the preview modal.
  const [preview, setPreview] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!id) return;
    setActiveConversation(id);
    // Load messages if thread doesn't exist or is empty
    if (!thread?.ids?.length) {
      fetchMessages({ conversationId: id });
    }
  }, [id, setActiveConversation, thread?.ids?.length, fetchMessages]);

  // Keep the FlatList from trying to render messages while the thread is still
  // initialising (i.e. before fetchMessages has populated `byId`). The `thread`
  // selector above can expose an empty `byId` during the brief window between the
  // `setActiveConversation` write and the async `fetchMessages` response, which
  // would otherwise crash MessageBubble on missing message shapes.
  const safeThread = thread && Array.isArray(thread.ids) ? thread : null;
  const messages = safeThread?.ids?.map((mid) => safeThread.byId[mid]).filter(Boolean) ?? [];

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

  const openChatInfo = () => {
    router.navigate(`/(main)/chats/info?id=${id}`);
  };

  // ── View-once flow ─────────────────────────────────
  // Sent/received view-once messages are BLOCKED in-thread: their content is
  // never rendered inline. A receiver tap downloads the payload and reveals it
  // in a full-screen preview modal OVER the chat screen — closing the modal
  // lands straight back on the chat with the bubble flipped to
  // "Opened — no re-views". The sender's bubble can never open; it only
  // reflects the "Opened" receipt once the receiver has viewed it.
  const handleViewOnceDownload = useCallback(
    (message) => {
      downloadViewOnceMessage({ conversationId: id, message });
    },
    [id, downloadViewOnceMessage],
  );

  const handleViewOnceOpen = useCallback(
    (message) => {
      // Consume the one-time reveal up front: the bubble flips to
      // "Opened — no re-views" the moment the preview modal opens, and a
      // second tap on it is inert.
      markViewOnceViewed(message.id);
      setReveal(message);
    },
    [markViewOnceViewed],
  );

  const closeReveal = useCallback(() => setReveal(null), []);

  // Chat-bubble palette for the in-modal text / voice bubbles — mirrors the
  // other-side styling used by MessageBubble.
  const revealBubbleColor = isDark ? colors.chatBubbleOther : "#F1F1F5";
  const revealContentColor = isDark ? colors.white : "#111118";

  // ── Media interactions ─────────────────────────────
  // Photos / videos open the in-app full-screen preview. Files (PDF) download
  // to cache and are handed to the phone's PDF viewer via the system sheet.
  const openPdfExternally = useCallback(
    async (message) => {
      const url = message?.mediaUrl;
      if (!url) {
        showToast("File unavailable", "error");
        return;
      }
      try {
        let fileUri = url;
        if (!url.startsWith("file:")) {
          // Download to cache first, then hand off to the system viewer.
          const destination = new Directory(Paths.cache, "pdfs");
          const output = await File.downloadFileAsync(url, destination);
          fileUri = output.uri;
        }
        if (await Sharing.isAvailableAsync()) {
          // System sheet -> any installed PDF viewer ("Open with …").
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            UTI: "com.adobe.pdf",
            dialogTitle: message.fileName || "Open PDF",
          });
        } else {
          await Linking.openURL(url);
        }
      } catch {
        showToast("Couldn't open the PDF", "error");
      }
    },
    [showToast],
  );

  const handleMediaPress = useCallback(
    (message) => {
      if (!message) return;
      if (message.mediaType === "file") {
        openPdfExternally(message);
        return;
      }
      if (message.mediaType === "image" || message.mediaType === "video") {
        if (!message.mediaUrl) {
          showToast("Preview unavailable", "info");
          return;
        }
        setPreview(message);
      }
    },
    [openPdfExternally, showToast],
  );

  const closePreview = useCallback(() => setPreview(null), []);

  const subtitle = typingText || (peer?.isOnline ? "online" : undefined);

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
            <Text variant="subtitle" color="default" numberOfLines={1} onPress={openChatInfo}>
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
        <Pressable onPress={openChatInfo} hitSlop={8}>
          <Avatar
            uri={peer.avatarUrl}
            name={peer.name}
            size="md"
            online={peer.isOnline}
          />
        </Pressable>
        <View style={styles.titleColumn}>
          <Text
            variant="subtitle"
            color="default"
            numberOfLines={1}
            onPress={openChatInfo}
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
            const sameSenderAsPrev =
              prevMsg &&
              prevMsg.isMine === item.isMine &&
              prevMsg.senderId === item.senderId;
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
                showTail={!sameSenderAsPrev}
                isGrouped={Boolean(sameSenderAsPrev)}
                onViewOnceDownload={handleViewOnceDownload}
                onViewOnceOpen={handleViewOnceOpen}
                onMediaPress={handleMediaPress}
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

      {/* ── View-once preview modal ──────────────────────
          Rendered over the chat screen itself (no route push): closing it
          drops the user straight back into the conversation, with the
          bubble already marked "Opened — no re-views". Minimal chrome:
          an ✕ to dismiss (top-left) and a view-once eye (top-right) — no
          sender profile, no footer button. Image / video take the full
          screen; text / voice render as chat-style bubbles. */}
      <Modal
        visible={Boolean(reveal)}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={closeReveal}
      >
        <View
          style={[
            styles.revealBackdrop,
            { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm },
          ]}
        >
          {reveal ? (
            <>
              {/* Top bar: ✕ dismiss · view-once eye */}
              <View style={styles.revealHeader}>
                <Pressable
                  onPress={closeReveal}
                  hitSlop={12}
                  style={({ pressed }) => [styles.revealXBtn, pressed && { opacity: 0.6 }]}
                  accessibilityLabel="Close view once"
                >
                  <Ionicons name="close" size={26} color={colors.white} />
                </Pressable>
                <Ionicons name="eye-outline" size={24} color={colors.white} />
              </View>

              <View style={styles.revealBody}>
                {reveal.mediaType === "image" && reveal.mediaUrl ? (
                  // Full-screen photo
                  <Image
                    source={{ uri: reveal.mediaUrl }}
                    style={styles.revealMediaFull}
                    resizeMode="contain"
                  />
                ) : reveal.mediaType === "video" ? (
                  // Full-screen video surface (plays when a source exists)
                  reveal.mediaUrl ? (
                    <VideoPreviewLayer uri={reveal.mediaUrl} />
                  ) : (
                    <View style={styles.revealMediaFull}>
                      <Ionicons name="play-circle" size={96} color="rgba(255,255,255,0.9)" />
                    </View>
                  )
                ) : (
                  // Text / voice render as chat-style bubbles
                  <ScrollView
                    contentContainerStyle={styles.revealBubbleScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={[styles.revealBubble, { backgroundColor: revealBubbleColor }]}>
                      <View style={[styles.revealTail, { borderRightColor: revealBubbleColor }]} />
                      {reveal.mediaType === "voice" ? (
                        <VoicePlayer
                          uri={reveal.mediaUrl || null}
                          duration={reveal.duration}
                          waveform={reveal.waveform}
                          color={revealContentColor}
                        />
                      ) : null}

                      {reveal.text ? (
                        <Text
                          variant="body"
                          style={[styles.revealBubbleText, { color: revealContentColor }]}
                        >
                          {reveal.text}
                        </Text>
                      ) : null}

                      <Text
                        variant="caption"
                        style={[styles.revealBubbleTime, { color: revealContentColor }]}
                      >
                        {fmtTime(reveal.createdAt)}
                      </Text>
                    </View>
                  </ScrollView>
                )}
              </View>
            </>
          ) : null}
        </View>
      </Modal>

      {/* ── Media preview modal (photos / videos) ────────
          Also rendered over the chat screen: ✕ closes back into the
          conversation. Photos render edge-to-edge; videos autoplay via
          expo-video. PDFs never land here — they go to the system viewer. */}
      <Modal
        visible={Boolean(preview)}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View
          style={[
            styles.revealBackdrop,
            { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.sm },
          ]}
        >
          {preview ? (
            <>
              <View style={styles.revealHeader}>
                <Pressable
                  onPress={closePreview}
                  hitSlop={12}
                  style={({ pressed }) => [styles.revealXBtn, pressed && { opacity: 0.6 }]}
                  accessibilityLabel="Close preview"
                >
                  <Ionicons name="close" size={26} color={colors.white} />
                </Pressable>
                {/* <Text
                  variant="caption"
                  numberOfLines={1}
                  style={{ color: colors.white, opacity: 0.75, flex: 1, textAlign: "right" }}
                >
                  {preview.fileName || "Preview"}
                </Text> */}
              </View>

              <View style={styles.revealBody}>
                {preview.mediaType === "video" && preview.mediaUrl ? (
                  <VideoPreviewLayer uri={preview.mediaUrl} />
                ) : preview.mediaUrl ? (
                  <Image
                    source={{ uri: preview.mediaUrl }}
                    style={styles.revealMediaFull}
                    resizeMode="contain"
                  />
                ) : (
                  <Ionicons name="image-outline" size={64} color="rgba(255,255,255,0.5)" />
                )}
              </View>
            </>
          ) : null}
        </View>
      </Modal>
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
  // ── View-once preview modal (over the chat screen) ──
  revealBackdrop: {
    flex: 1,
    backgroundColor: colors.black,
  },
  // ✕ (left) · view-once eye (right) — no sender profile, no timestamp.
  revealHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  revealXBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  revealBody: {
    flex: 1,
  },
  // Photo / video fill the whole area between the top bar and the safe area.
  revealMediaFull: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  // Text / voice: chat-style bubble — hugs its content like bubbles in the
  // thread (children of a ScrollView stretch by default, hence alignSelf),
  // with the same WhatsApp corner + tail treatment.
  revealBubbleScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  revealBubble: {
    alignSelf: "flex-start",
    maxWidth: "78%",
    borderRadius: layout.borderRadius.sm,
    borderTopLeftRadius: layout.borderRadius.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
  },
  revealTail: {
    position: "absolute",
    top: 0,
    left: -5,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 0,
    borderRightWidth: 7,
  },
  revealBubbleText: {
    marginBottom: spacing.xxs,
  },
  revealBubbleTime: {
    alignSelf: "flex-end",
    fontSize: 10,
    opacity: 0.6,
  },
});
