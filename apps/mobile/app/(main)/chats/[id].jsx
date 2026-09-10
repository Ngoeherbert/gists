import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";

import useChatStore from "../../../stores/chatStore";
import useAuthStore from "../../../stores/authStore";

import ChatHeader from "../../../components/chats/ChatHeader";
import MessageList from "../../../components/chats/MessageList";
import MessageBubble from "../../../components/chats/MessageBubble";
import MessageInput from "../../../components/chats/MessageInput";
import MediaMessage from "../../../components/chats/MediaMessage";
import VoiceMessage from "../../../components/chats/VoiceMessage";
import FileMessage from "../../../components/chats/FileMessage";

const CHAT_DUMMY = {
  "chat-101": {
    id: "chat-101",
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=47",
    online: true,
    typing: false,
    messages: [
      {
        id: "m1",
        senderId: "user-002",
        text: "Hey! How are you doing?",
        type: "text",
        timestamp: "10:30 AM",
        createdAt: Date.now() - 3600000,
        isMine: false,
      },
      {
        id: "m2",
        senderId: "user-001",
        text: "I'm good, thanks! Working on the new project.",
        type: "text",
        timestamp: "10:32 AM",
        createdAt: Date.now() - 3500000,
        isMine: true,
      },
      {
        id: "m3",
        senderId: "user-002",
        text: "Check out this photo!",
        type: "image",
        uri: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600",
        timestamp: "10:33 AM",
        createdAt: Date.now() - 3400000,
        isMine: false,
      },
      {
        id: "m4",
        senderId: "user-001",
        text: "Great view! Here's a voice note.",
        type: "audio",
        uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: "0:15",
        timestamp: "10:35 AM",
        createdAt: Date.now() - 3300000,
        isMine: true,
      },
      {
        id: "m5",
        senderId: "user-002",
        text: "Here's the project file.",
        type: "file",
        name: "project_brief.pdf",
        size: 245000,
        extension: "PDF",
        timestamp: "10:38 AM",
        createdAt: Date.now() - 3200000,
        isMine: false,
      },
      {
        id: "m6",
        senderId: "user-001",
        text: "I'm at the office now.",
        type: "location",
        latitude: 4.05,
        longitude: 9.7,
        address: "Buea, Cameroon",
        timestamp: "10:40 AM",
        createdAt: Date.now() - 3100000,
        isMine: true,
      },
      {
        id: "m7",
        senderId: "user-002",
        text: "What do you think about this poll?",
        type: "poll",
        pollQuestion: "Best time for the meeting?",
        pollOptions: [
          { id: "p1", text: "9:00 AM", votes: 3 },
          { id: "p2", text: "2:00 PM", votes: 5 },
          { id: "p3", text: "4:00 PM", votes: 2 },
        ],
        timestamp: "10:42 AM",
        createdAt: Date.now() - 3000000,
        isMine: false,
      },
    ],
  },
  "chat-102": {
    id: "chat-102",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=11",
    online: false,
    typing: false,
    messages: [
      {
        id: "m8",
        senderId: "user-003",
        text: "Did you see the latest reel?",
        type: "text",
        timestamp: "Yesterday",
        createdAt: Date.now() - 86400000,
        isMine: false,
      },
      {
        id: "m9",
        senderId: "user-001",
        text: "Yes! It was hilarious 😂",
        type: "text",
        timestamp: "Yesterday",
        createdAt: Date.now() - 85000000,
        isMine: true,
      },
    ],
  },
  "chat-103": {
    id: "chat-103",
    name: "Jessica Park",
    avatar: "https://i.pravatar.cc/150?img=32",
    online: true,
    typing: true,
    messages: [
      {
        id: "m10",
        senderId: "user-004",
        text: "Here's my contact info.",
        type: "contact",
        contactName: "Jessica Park",
        contactPhone: "+237 680 000 000",
        timestamp: "2:15 PM",
        createdAt: Date.now() - 7200000,
        isMine: false,
      },
      {
        id: "m11",
        senderId: "user-001",
        text: "Thanks! Saved it.",
        type: "text",
        timestamp: "2:16 PM",
        createdAt: Date.now() - 7100000,
        isMine: true,
      },
    ],
  },
};

function getFileType(extension) {
  const ext = String(extension || "").toLowerCase();
  if (["pdf"].includes(ext)) return "pdf";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["xls", "xlsx", "csv"].includes(ext)) return "excel";
  if (["ppt", "pptx"].includes(ext)) return "powerpoint";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["txt", "rtf"].includes(ext)) return "text";
  return "generic";
}

function formatFileSize(bytes) {
  if (!bytes || bytes < 1) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderMessageContent(message, handlers) {
  const {
    isMine,
    onImagePress,
    onVideoPress,
    onFilePress,
    onLocationPress,
    onContactPress,
    onPollVote,
  } = handlers;

  if (message.type === "image") {
    return (
      <MediaMessage
        uri={message.uri}
        type="image"
        isMine={isMine}
        onPress={() => onImagePress?.(message)}
      />
    );
  }

  if (message.type === "video") {
    return (
      <MediaMessage
        uri={message.uri}
        type="video"
        isMine={isMine}
        onPress={() => onVideoPress?.(message)}
      />
    );
  }

  if (message.type === "audio") {
    return (
      <VoiceMessage
        duration={message.duration || "0:00"}
        isMine={isMine}
        onPress={() => {}}
      />
    );
  }

  if (message.type === "file") {
    const fileType = getFileType(message.extension);
    const isPDF = fileType === "pdf";
    return (
      <FileMessage
        name={message.name || "File"}
        size={message.size}
        extension={isPDF ? "PDF" : message.extension?.toUpperCase()}
        isMine={isMine}
        onPress={() => onFilePress?.(message)}
      />
    );
  }

  if (message.type === "location") {
    return (
      <TouchableOpacity
        onPress={() => onLocationPress?.(message)}
        style={[
          styles.locationBubble,
          isMine ? styles.mineLocation : styles.theirLocation,
        ]}
      >
        <View style={styles.locationIcon}>
          <Ionicons
            name="location"
            size={22}
            color={isMine ? "#111111" : "#FFFFFF"}
          />
        </View>
        <View style={styles.locationContent}>
          <Text
            numberOfLines={2}
            style={[
              styles.locationAddress,
              isMine ? styles.mineText : styles.theirText,
            ]}
          >
            {message.address || "Location"}
          </Text>
          <Text
            style={[
              styles.locationMeta,
              isMine ? styles.mineMeta : styles.theirMeta,
            ]}
          >
            {message.latitude?.toFixed(4)}, {message.longitude?.toFixed(4)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (message.type === "contact") {
    return (
      <TouchableOpacity
        onPress={() => onContactPress?.(message)}
        style={[
          styles.contactBubble,
          isMine ? styles.mineContact : styles.theirContact,
        ]}
      >
        <View style={styles.contactAvatar}>
          <Ionicons
            name="person"
            size={24}
            color={isMine ? "#111111" : "#FFFFFF"}
          />
        </View>
        <View style={styles.contactContent}>
          <Text
            numberOfLines={1}
            style={[
              styles.contactName,
              isMine ? styles.mineText : styles.theirText,
            ]}
          >
            {message.contactName || "Contact"}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.contactPhone,
              isMine ? styles.mineMeta : styles.theirMeta,
            ]}
          >
            {message.contactPhone || ""}
          </Text>
        </View>
        <Ionicons
          name="person-add-outline"
          size={20}
          color={isMine ? "#FFFFFF" : "#111111"}
        />
      </TouchableOpacity>
    );
  }

  if (message.type === "poll") {
    const totalVotes = (message.pollOptions || []).reduce(
      (sum, opt) => sum + (opt.votes || 0),
      0,
    );
    return (
      <View
        style={[styles.pollBubble, isMine ? styles.minePoll : styles.theirPoll]}
      >
        <Text
          style={[
            styles.pollQuestion,
            isMine ? styles.mineText : styles.theirText,
          ]}
        >
          {message.pollQuestion || "Poll"}
        </Text>
        {(message.pollOptions || []).map((option) => {
          const percentage =
            totalVotes > 0
              ? Math.round(((option.votes || 0) / totalVotes) * 100)
              : 0;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onPollVote?.(message, option.id)}
              style={styles.pollOption}
            >
              <View
                style={[styles.pollOptionBar, { width: `${percentage}%` }]}
              />
              <Text
                style={[
                  styles.pollOptionText,
                  isMine ? styles.mineText : styles.theirText,
                ]}
              >
                {option.text}
              </Text>
              <Text
                style={[
                  styles.pollPercentage,
                  isMine ? styles.mineMeta : styles.theirMeta,
                ]}
              >
                {percentage}%
              </Text>
            </TouchableOpacity>
          );
        })}
        <Text
          style={[
            styles.pollTotal,
            isMine ? styles.mineMeta : styles.theirMeta,
          ]}
        >
          {totalVotes} votes
        </Text>
      </View>
    );
  }

  return (
    <MessageBubble
      message={message.text || message.message}
      isMine={isMine}
      timestamp={message.timestamp}
      reply={message.reply}
    />
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const currentUser = useAuthStore((state) => state.user);
  const conversations = useChatStore((state) => state.conversations);
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const removeMessage = useChatStore((state) => state.removeMessage);

  const chatId = Array.isArray(params.id)
    ? params.id[0]
    : params.id || "chat-101";
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [lightboxUri, setLightboxUri] = useState(null);

  const conversation =
    conversations.find((item) => item.id === chatId) || CHAT_DUMMY[chatId];
  const chatMessages =
    messages[chatId] ||
    conversation?.messages ||
    CHAT_DUMMY[chatId]?.messages ||
    [];

  useEffect(() => {
    const dummy = CHAT_DUMMY[chatId];
    if (!dummy || !dummy.messages) return;

    if (!messages[chatId]) {
      useChatStore.getState().setMessages(chatId, dummy.messages);
    }
  }, [chatId, messages]);

  const otherUser = conversation || CHAT_DUMMY[chatId] || {};
  const displayName = otherUser.name || otherUser.username || "Chat";

  const handleSend = useCallback(
    (payload) => {
      const isPlainPayload =
        payload &&
        typeof payload === "object" &&
        !Array.isArray(payload) &&
        !("nativeEvent" in payload) &&
        !("preventDefault" in payload);

      const safePayload = isPlainPayload ? payload : null;

      if (!text.trim() && !safePayload?.type) return;

      const normalizedReply =
        replyTo && typeof replyTo === "object" && !Array.isArray(replyTo)
          ? {
              id: replyTo.id || `reply-${Date.now()}`,
              text: replyTo.text || replyTo.message || "Replied message",
              senderId: replyTo.senderId || "user-001",
            }
          : null;

      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser?.id || "user-001",
        text: text.trim() || (safePayload?.type === "text" ? "" : "Media"),
        type: safePayload?.type || "text",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        createdAt: Date.now(),
        isMine: true,
        reply: normalizedReply || safePayload?.reply || null,
        ...safePayload,
      };
      addMessage(chatId, newMessage);
      setText("");
      setReplyTo(null);
    },
    [text, chatId, addMessage, currentUser?.id, replyTo],
  );

  const handleImagePick = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets?.[0]) {
      handleSend({
        type: "image",
        uri: result.assets[0].uri,
      });
    }
  }, [handleSend]);

  const handleVideoPick = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 0.9,
      allowsMultipleSelection: false,
      videoMaxDuration: 60,
    });
    if (!result.canceled && result.assets?.[0]) {
      handleSend({
        type: "video",
        uri: result.assets[0].uri,
      });
    }
  }, [handleSend]);

  const handleFilePick = useCallback(async () => {
    Alert.alert("Attach file", "Choose a file to attach.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Choose file",
        onPress: async () => {
          const result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
            copyToCacheDirectory: true,
          });

          if (result.canceled || !result.assets?.[0]) return;

          const document = result.assets[0];
          const name = document.name || "file";
          const extension = name.includes(".")
            ? name.split(".").pop() || "file"
            : document.mimeType?.split("/").pop() || "file";

          handleSend({
            type: "file",
            uri: document.uri,
            name,
            size: document.size ?? 0,
            extension: extension.toUpperCase(),
          });
        },
      },
    ]);
  }, [handleSend]);

  const handleLocationPick = useCallback(() => {
    Alert.alert("Share location", "Choose a location to share.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Use current location",
        onPress: () => {
          handleSend({
            type: "location",
            latitude: 4.05,
            longitude: 9.7,
            address: "Buea, Cameroon",
          });
        },
      },
      {
        text: "Choose on map",
        onPress: () => {
          Alert.alert("Map", "Map picker coming soon.");
        },
      },
    ]);
  }, [handleSend]);

  const handleContactPick = useCallback(() => {
    handleSend({
      type: "contact",
      contactName: currentUser?.name || currentUser?.username || "User",
      contactPhone: "+237 000 000 000",
    });
  }, [handleSend, currentUser]);

  const [pollDraft, setPollDraft] = useState({
    visible: false,
    question: "",
    option1: "",
    option2: "",
  });

  const handlePollCreate = useCallback(() => {
    setPollDraft({ visible: true, question: "", option1: "", option2: "" });
  }, []);

  const handlePollSubmit = useCallback(() => {
    const question = pollDraft.question.trim();
    const option1 = pollDraft.option1.trim();
    const option2 = pollDraft.option2.trim();

    if (!question || !option1 || !option2) return;

    handleSend({
      type: "poll",
      pollQuestion: question,
      pollOptions: [
        { id: `opt-${Date.now()}-1`, text: option1, votes: 0 },
        { id: `opt-${Date.now()}-2`, text: option2, votes: 0 },
      ],
    });

    setPollDraft({ visible: false, question: "", option1: "", option2: "" });
  }, [handleSend, pollDraft]);

  const handleVoiceRecord = useCallback(async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Microphone permission is required to record voice.",
        );
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recordingOptions = Platform.select({
        ios: {
          isMeteringEnabled: true,
          extension: ".m4a",
          outputFormat: 2,
          audioEncoder: 2,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        android: {
          isMeteringEnabled: true,
          extension: ".m4a",
          outputFormat: 2,
          audioEncoder: 2,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        default: {},
      });
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      Alert.alert("Recording", "Tap OK to stop recording.", [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => recording.stopAndUnloadAsync(),
        },
        {
          text: "Stop",
          onPress: async () => {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            if (uri) {
              const status = await recording.getStatusAsync();
              handleSend({
                type: "audio",
                uri,
                duration: status.durationMillis
                  ? `${Math.floor(status.durationMillis / 1000)}s`
                  : "0:00",
              });
            }
          },
        },
      ]);
    } catch (error) {
      console.warn("Voice record error:", error);
    }
  }, [handleSend]);

  const handleMessageLongPress = useCallback((message) => {
    setSelectedMessage(message);
  }, []);

  const handleReply = useCallback(() => {
    if (selectedMessage) {
      setReplyTo(selectedMessage);
      setSelectedMessage(null);
    }
  }, [selectedMessage]);

  const handleForward = useCallback(() => {
    setSelectedMessage(null);
    Alert.alert("Forward", "Select a chat to forward to.");
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedMessage) {
      removeMessage(chatId, selectedMessage.id);
      setSelectedMessage(null);
    }
  }, [selectedMessage, chatId, removeMessage]);

  const handleImagePress = useCallback((message) => {
    setLightboxUri(message.uri);
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      const isMine =
        item.isMine ??
        String(item.senderId) === String(currentUser?.id || "user-001");
      return (
        <View>
          {renderMessageContent(item, {
            isMine,
            onImagePress: handleImagePress,
            onVideoPress: handleImagePress,
            onFilePress: (msg) =>
              Alert.alert("File", `Open ${msg.name || "file"}?`),
            onLocationPress: (msg) =>
              Alert.alert("Location", msg.address || "Open in maps?"),
            onContactPress: (msg) =>
              Alert.alert("Contact", `Save ${msg.contactName || "contact"}?`),
            onPollVote: (msg, optionId) => {
              const updatedOptions = (msg.pollOptions || []).map((opt) =>
                opt.id === optionId
                  ? { ...opt, votes: (opt.votes || 0) + 1 }
                  : opt,
              );
              const updatedMessage = { ...msg, pollOptions: updatedOptions };
              updateMessage(chatId, msg.id, { pollOptions: updatedOptions });
              addMessage(chatId, {
                ...updatedMessage,
                id: `msg-${Date.now()}`,
                isMine: true,
                _voteUpdate: true,
              });
            },
          })}
        </View>
      );
    },
    [chatId, currentUser?.id, handleImagePress, updateMessage, addMessage],
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No messages yet</Text>
        <Text style={styles.emptyText}>
          Say hello to start the conversation.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ChatHeader
        name={displayName}
        avatar={otherUser.avatar}
        online={otherUser.online}
        onBack={() => router.back()}
        onCall={() => Alert.alert("Voice call", "Calling...")}
        onVideo={() => Alert.alert("Video call", "Starting video call...")}
      />

      <MessageList
        messages={chatMessages}
        currentUserId={currentUser?.id || "user-001"}
        onMessageLongPress={handleMessageLongPress}
        renderItemOverride={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />

      {pollDraft.visible ? (
        <Modal
          transparent
          visible={pollDraft.visible}
          animationType="fade"
          onRequestClose={() =>
            setPollDraft((current) => ({ ...current, visible: false }))
          }
        >
          <Pressable
            style={styles.pollModalOverlay}
            onPress={() =>
              setPollDraft((current) => ({ ...current, visible: false }))
            }
          >
            <Pressable
              style={styles.pollModal}
              onPress={(event) => event.stopPropagation()}
            >
              <Text style={styles.pollModalTitle}>Create poll</Text>

              <TextInput
                value={pollDraft.question}
                onChangeText={(value) =>
                  setPollDraft((current) => ({ ...current, question: value }))
                }
                placeholder="Poll question"
                style={styles.pollInput}
              />
              <TextInput
                value={pollDraft.option1}
                onChangeText={(value) =>
                  setPollDraft((current) => ({ ...current, option1: value }))
                }
                placeholder="Option 1"
                style={styles.pollInput}
              />
              <TextInput
                value={pollDraft.option2}
                onChangeText={(value) =>
                  setPollDraft((current) => ({ ...current, option2: value }))
                }
                placeholder="Option 2"
                style={styles.pollInput}
              />

              <View style={styles.pollModalActions}>
                <TouchableOpacity
                  onPress={() =>
                    setPollDraft((current) => ({ ...current, visible: false }))
                  }
                >
                  <Text style={styles.pollModalCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePollSubmit}>
                  <Text style={styles.pollModalSubmit}>Create</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}

      <MessageInput
        value={text}
        onChangeText={setText}
        onSend={handleSend}
        onAttachment={handleFilePick}
        onCamera={handleVideoPick}
        onVoice={handleVoiceRecord}
        pollAction={handlePollCreate}
        replyingTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />

      {selectedMessage ? (
        <View style={styles.actionMenu}>
          <TouchableOpacity style={styles.actionMenuItem} onPress={handleReply}>
            <Ionicons name="arrow-undo-outline" size={20} color="#111111" />
            <Text style={styles.actionMenuText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionMenuItem}
            onPress={handleForward}
          >
            <Ionicons name="share-outline" size={20} color="#111111" />
            <Text style={styles.actionMenuText}>Forward</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionMenuItem}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#D64545" />
            <Text style={[styles.actionMenuText, styles.dangerText]}>
              Delete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionMenuItem}
            onPress={() => setSelectedMessage(null)}
          >
            <Ionicons name="close" size={20} color="#111111" />
            <Text style={styles.actionMenuText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {lightboxUri ? (
        <TouchableOpacity
          style={styles.lightbox}
          onPress={() => setLightboxUri(null)}
        >
          <Image
            source={{ uri: lightboxUri }}
            style={styles.lightboxImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.lightboxClose}
            onPress={() => setLightboxUri(null)}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 10,
  },
  emptyTitle: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    color: "#777777",
    fontSize: 13,
    textAlign: "center",
  },
  pollModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  pollModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
  },
  pollModalTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  pollInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111111",
    marginBottom: 10,
  },
  pollModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    marginTop: 8,
  },
  pollModalCancel: {
    color: "#666666",
    fontSize: 15,
    fontWeight: "600",
  },
  pollModalSubmit: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  actionMenu: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
  },
  actionMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  actionMenuText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },
  dangerText: {
    color: "#D64545",
  },
  lightbox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 300,
  },
  lightboxImage: {
    width: "100%",
    height: "100%",
  },
  lightboxClose: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  locationBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 18,
    maxWidth: 260,
  },
  mineLocation: {
    backgroundColor: "#111111",
    borderBottomRightRadius: 5,
  },
  theirLocation: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  locationContent: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  locationMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  contactBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 18,
    maxWidth: 260,
  },
  mineContact: {
    backgroundColor: "#111111",
    borderBottomRightRadius: 5,
  },
  theirContact: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 13,
    fontWeight: "700",
  },
  contactPhone: {
    fontSize: 11,
    marginTop: 2,
  },
  pollBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: 280,
    gap: 10,
  },
  minePoll: {
    backgroundColor: "#111111",
    borderBottomRightRadius: 5,
  },
  theirPoll: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
  },
  pollQuestion: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  pollOption: {
    position: "relative",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  pollOptionBar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  pollOptionText: {
    fontSize: 13,
    fontWeight: "600",
    position: "relative",
    zIndex: 1,
  },
  pollPercentage: {
    fontSize: 11,
    fontWeight: "700",
    position: "relative",
    zIndex: 1,
  },
  pollTotal: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  mineText: {
    color: "#FFFFFF",
  },
  theirText: {
    color: "#111111",
  },
  mineMeta: {
    color: "#CFCFCF",
  },
  theirMeta: {
    color: "#777777",
  },
});
