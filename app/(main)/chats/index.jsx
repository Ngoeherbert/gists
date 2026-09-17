// app/(main)/chats/index.jsx
// Conversations list with search, gist-room and AI entry points.

import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../constants/colors";
import spacing from "../../../constants/spacing";
import layout from "../../../constants/layout";
import useChatStore from "../../../stores/chatStore";
import { Header, Screen } from "../../../components/common";
import { EmptyState, IconButton, Loading } from "../../../components/ui";
import ConversationRow from "../../../components/chats/ConversationRow";
import Chip from "../../../components/ui/Chip";
import Text from "../../../components/ui/Text";
import useAppTheme from "../../../hooks/useAppTheme";

export default function ChatsScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const conversations = useChatStore((s) => s.conversations);
  const isLoading = useChatStore((s) => s.isLoadingConversations);
  const pinned = useChatStore((s) => s.pinned);
  const muted = useChatStore((s) => s.muted);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const fetchConversations = useChatStore((s) => s.fetchConversations);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const sorted = [...conversations].sort((a, b) => {
    const aPinned = pinned.includes(a.id) ? 1 : 0;
    const bPinned = pinned.includes(b.id) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
  });

  const archived = useChatStore((s) => s.archived);
  const archivedConversations = conversations.filter((c) =>
    archived.includes(c.id),
  );

  // Filter out archived from main list
  const nonArchived = sorted.filter((c) => !archived.includes(c.id));

  const filtered = nonArchived.filter((c) => {
    if (filter === "unread") return (c.unreadCount ?? 0) > 0;
    if (filter === "groups") return c.type === "group";
    if (filter === "fav") return pinned.includes(c.id);
    if (filter === "updates")
      return c.type === "group" || c.name?.includes("Gist");
    return true;
  });

  const openConversation = useCallback(
    (conversation) => {
      setActiveConversation(conversation.id);
      router.navigate(`/(main)/chats/${conversation.id}`);
    },
    [setActiveConversation, router],
  );

  const openArchived = useCallback(() => {
    router.navigate("/(main)/chats/archived");
  }, [router]);

  const renderFilterPills = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContent}
    >
      <Chip
        label="All"
        selected={filter === "all"}
        onPress={() => setFilter("all")}
        size="small"
      />
      <Chip
        label="Unread"
        selected={filter === "unread"}
        onPress={() => setFilter("unread")}
        size="small"
      />
      <Chip
        label="Groups"
        selected={filter === "groups"}
        onPress={() => setFilter("groups")}
        size="small"
      />
      <Chip
        label="Fav"
        selected={filter === "fav"}
        onPress={() => setFilter("fav")}
        size="small"
      />
      <Chip
        label="Updates"
        selected={filter === "updates"}
        onPress={() => setFilter("updates")}
        size="small"
      />
    </ScrollView>
  );

  const renderArchivedEntry = () => {
    if (filter !== "all" || archivedConversations.length === 0) return null;
    const iconBg = isDark ? "#2a2a2a" : "#f0f0f0";
    return (
      <TouchableOpacity style={styles.archivedEntry} onPress={openArchived}>
        <View style={[styles.archivedEntryIcon, { backgroundColor: iconBg }]}>
          <Ionicons
            name="archive-outline"
            size={20}
            color={isDark ? theme.text.tertiary : "#888"}
          />
        </View>
        <View style={styles.archivedEntryContent}>
          <Text
            variant="bodyMedium"
            color="default"
            style={styles.archivedEntryLabel}
          >
            Archived
          </Text>
          <Text variant="caption" color="tertiary">
            {archivedConversations.length}{" "}
            {archivedConversations.length === 1 ? "chat" : "chats"}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? theme.text.tertiary : "#888"}
        />
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => (
    <View>
      {renderFilterPills()}
      {renderArchivedEntry()}
    </View>
  );

  return (
    <Screen
      padded={false}
      edges={["top"]}
      header={
        <Header
          title="Gists"
          titleVariant="heading"
          titleStyle={{ fontWeight: "800" }}
          border={false}
          compactTitle
          right={
            <View style={styles.actions}>
              <IconButton
                name="search-outline"
                onPress={() => router.navigate("/(main)/chats/search")}
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
      {isLoading && filtered.length === 0 ? (
        <Loading label="Loading chats…" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationRow
              conversation={item}
              muted={muted.includes(item.id)}
              onPress={openConversation}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filtered.length === 0 ? styles.empty : undefined
          }
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={
            <EmptyState
              icon="chatbubbles-outline"
              title="No conversations"
              description={
                filter === "all"
                  ? "Start a chat with someone you follow, or open a gist room."
                  : `No ${filter.toLowerCase()} conversations.`
              }
              actionLabel="New message"
              onAction={() => router.navigate("/(main)/chats/new-gist")}
            />
          }
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.navigate("/(main)/chats/ai")}
      >
        <Ionicons name="sparkles" size={24} color={colors.white} />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  empty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    marginLeft: -spacing.m,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingVertical: spacing.xl,
    flexDirection: "row",
  },
  archivedEntry: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  archivedEntryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  archivedEntryContent: {
    flex: 1,
  },
  archivedEntryLabel: {
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: layout.tabBarHeight + spacing.huge,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
