// app/(main)/chats/index.jsx
// Conversations list with search, gist-room and AI entry points.

import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../../constants/spacing";
import useChatStore from "../../../stores/chatStore";
import { Header, Screen } from "../../../components/common";
import { EmptyState, IconButton, Loading } from "../../../components/ui";
import ConversationRow from "../../../components/chats/ConversationRow";

export default function ChatsScreen() {
  const router = useRouter();

  const conversations = useChatStore((s) => s.conversations);
  const isLoading = useChatStore((s) => s.isLoadingConversations);
  const pinned = useChatStore((s) => s.pinned);
  const muted = useChatStore((s) => s.muted);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);

  const sorted = [...conversations].sort((a, b) => {
    const aPinned = pinned.includes(a.id) ? 1 : 0;
    const bPinned = pinned.includes(b.id) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
  });

  const openConversation = useCallback(
    (conversation) => {
      setActiveConversation(conversation.id);
      router.navigate(`/(main)/chats/${conversation.id}`);
    },
    [setActiveConversation, router]
  );

return (
    <Screen
      padded={false}
      edges={["top"]}
      header={
        <Header
          title="Chats"
          right={
            <View style={styles.actions}>
              <IconButton
                name="sparkles-outline"
                onPress={() => router.navigate("/(main)/chats/ai")}
              />
              <IconButton
                name="create-outline"
                onPress={() => router.navigate("/(main)/chats/new-gist")}
              />
            </View>
          }
        />
      }
    >
      <View style={styles.searchBar}>
        <IconButton
          name="search-outline"
          onPress={() => router.navigate("/(main)/chats/search")}
          style={styles.searchIcon}
        />
      </View>

      {isLoading && sorted.length === 0 ? (
        <Loading label="Loading chats…" />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationRow
              conversation={item}
              muted={muted.includes(item.id)}
              onPress={openConversation}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={sorted.length === 0 ? styles.empty : undefined}
          ListEmptyComponent={
            <EmptyState
              icon="chatbubbles-outline"
              title="No conversations yet"
              description="Start a chat with someone you follow, or open a gist room."
              actionLabel="New message"
              onAction={() => router.navigate("/(main)/chats/new-gist")}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    alignSelf: "flex-start",
  },
  empty: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
