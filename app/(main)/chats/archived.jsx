// app/(main)/chats/archived.jsx
// Archived conversations screen.

import React, { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import spacing from "../../../constants/spacing";
import useChatStore from "../../../stores/chatStore";
import { Header, Screen } from "../../../components/common";
import { EmptyState, Loading } from "../../../components/ui";
import ConversationRow from "../../../components/chats/ConversationRow";
import useAppTheme from "../../../hooks/useAppTheme";

export default function ArchivedChatsScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const conversations = useChatStore((s) => s.conversations);
  const isLoading = useChatStore((s) => s.isLoadingConversations);
  const muted = useChatStore((s) => s.muted);
  const archived = useChatStore((s) => s.archived);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const toggleArchive = useChatStore((s) => s.toggleArchive);
  const fetchConversations = useChatStore((s) => s.fetchConversations);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const archivedConversations = conversations
    .filter((c) => archived.includes(c.id))
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

  const openConversation = useCallback(
    (conversation) => {
      setActiveConversation(conversation.id);
      router.navigate(`/(main)/chats/${conversation.id}`);
    },
    [setActiveConversation, router]
  );

  const handleUnarchive = useCallback(
    (conversationId) => {
      toggleArchive(conversationId);
    },
    [toggleArchive]
  );

  const renderItem = ({ item }) => (
    <ConversationRow
      conversation={item}
      muted={muted.includes(item.id)}
      onPress={openConversation}
      onLongPress={() => handleUnarchive(item.id)}
    />
  );

return (
    <Screen
      padded={false}
      edges={["top"]}
      header={
        <Header
          title="Archived"
          showBack
          right={
            archivedConversations.length > 0 ? (
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme.text.tertiary}
                style={{ paddingRight: spacing.md }}
              />
            ) : null
          }
        />
      }
    >
      {isLoading && archivedConversations.length === 0 ? (
        <Loading label="Loading…" />
      ) : (
        <FlatList
          data={archivedConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={archivedConversations.length === 0 ? styles.empty : undefined}
          ListEmptyComponent={
            <EmptyState
              icon="archive-outline"
              title="No archived chats"
              description="Swipe left on a chat or long press to archive it."
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    flexGrow: 1,
    justifyContent: "center",
  },
});