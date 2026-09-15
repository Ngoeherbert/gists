// app/(main)/chats/search.jsx
// Search across conversations and messages.

import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../../constants/spacing";
import useChatStore from "../../../stores/chatStore";
import { Header } from "../../../components/common";
import { EmptyState, Input } from "../../../components/ui";
import ConversationRow from "../../../components/chats/ConversationRow";

export default function ChatSearchScreen() {
  const router = useRouter();
  const conversations = useChatStore((s) => s.conversations);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);

  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return conversations.filter((c) => {
      const peer = c.participants?.[0] || {};
      const haystack = [
        c.name,
        peer.name,
        peer.username,
        c.lastMessage?.text,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [conversations, query]);

  return (
    <View style={styles.container}>
      <Header title="Search chats" showBack />

      <View style={styles.searchWrap}>
        <Input
          placeholder="Search people and messages…"
          value={query}
          onChangeText={setQuery}
          leftIcon="search-outline"
          autoFocus
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationRow
            conversation={item}
            onPress={(c) => {
              setActiveConversation(c.id);
              router.push(`/(main)/chats/${c.id}`);
            }}
          />
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={results.length === 0 ? styles.empty : undefined}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title={query ? "No matches" : "Search your chats"}
            description={
              query
                ? "Try a different name or keyword."
                : "Find a conversation by name, username or message content."
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrap: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
  },
  empty: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
