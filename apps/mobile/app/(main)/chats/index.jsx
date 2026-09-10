import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import useChatStore from "../../../stores/chatStore";

import ChatList from "../../../components/chats/ChatList";
import ChatItem from "../../../components/chats/ChatItem";

const CHAT_LIST_DUMMY = [
  {
    id: "chat-101",
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=47",
    message: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    unreadCount: 2,
    online: true,
    typing: false,
    pinned: false,
    muted: false,
  },
  {
    id: "chat-102",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=11",
    message: "Did you see the latest reel?",
    timestamp: "Yesterday",
    unreadCount: 0,
    online: false,
    typing: false,
    pinned: true,
    muted: false,
  },
  {
    id: "chat-103",
    name: "Jessica Park",
    avatar: "https://i.pravatar.cc/150?img=32",
    message: "Here's my contact info.",
    timestamp: "2:15 PM",
    unreadCount: 1,
    online: true,
    typing: true,
    pinned: false,
    muted: false,
  },
  {
    id: "chat-104",
    name: "Daniel Smith",
    avatar: "https://i.pravatar.cc/150?img=68",
    message: "Meeting at 3pm?",
    timestamp: "Monday",
    unreadCount: 0,
    online: false,
    typing: false,
    pinned: false,
    muted: true,
  },
  {
    id: "chat-105",
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=44",
    message: "Thanks for the help!",
    timestamp: "Sunday",
    unreadCount: 0,
    online: true,
    typing: false,
    pinned: false,
    muted: false,
  },
  {
    id: "chat-106",
    name: "David Brown",
    avatar: "https://i.pravatar.cc/150?img=15",
    message: "Let's catch up soon.",
    timestamp: "Last week",
    unreadCount: 0,
    online: false,
    typing: false,
    pinned: false,
    muted: false,
  },
];

export default function ChatsScreen() {
  const router = useRouter();
  const conversations = useChatStore((state) => state.conversations);
  const setConversations = useChatStore((state) => state.setConversations);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (conversations.length === 0) {
      setConversations(CHAT_LIST_DUMMY);
    }
  }, [conversations.length, setConversations]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleChatPress = useCallback(
    (id) => {
      router.push(`/(main)/chats/${id}`);
    },
    [router],
  );

  const handleChatLongPress = useCallback((id) => {
    Alert.alert("Chat options", "Long-press actions coming soon.");
  }, []);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();
    return conversations.filter((chat) => {
      const name = (chat.name || chat.username || "").toLowerCase();
      const message = (chat.message || chat.lastMessage || "").toLowerCase();
      return name.includes(query) || message.includes(query);
    });
  }, [conversations, searchQuery]);

  const renderItem = useCallback(
    ({ item }) => (
      <ChatItem
        id={item.id}
        name={item.name || item.username}
        avatar={item.avatar || item.photo || item.profilePhoto}
        message={item.message || item.lastMessage}
        timestamp={item.timestamp || item.lastMessageTime}
        unreadCount={item.unreadCount || item.unread || 0}
        online={item.online}
        muted={item.muted}
        pinned={item.pinned}
        typing={item.typing}
        isGroup={item.isGroup}
        onPress={handleChatPress}
        onLongPress={handleChatLongPress}
      />
    ),
    [handleChatPress, handleChatLongPress],
  );

  const keyExtractor = useCallback(
    (item, index) => String(item.id ?? index),
    [],
  );

  const listEmptyComponent = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No chats yet</Text>
        <Text style={styles.emptyText}>
          Start a conversation with someone to see your chats here.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          <Pressable hitSlop={8} style={styles.headerButton}>
            <Ionicons name="create-outline" size={24} color="#111111" />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#999999" />
          <TextInput
            style={styles.searchTextInput}
            placeholder="Search chats..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={6}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </Pressable>
          )}
        </View>
      </View>

      <ChatList
        chats={filteredChats}
        onChatPress={handleChatPress}
        onChatLongPress={handleChatLongPress}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={listEmptyComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 62,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#111111",
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
  },
  searchTextInput: {
    flex: 1,
    fontSize: 15,
    color: "#111111",
    paddingVertical: 0,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 12,
  },
  emptyTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },
  emptyText: {
    color: "#777777",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
