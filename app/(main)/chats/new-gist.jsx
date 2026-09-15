// app/(main)/chats/new-gist.jsx
// Start a new conversation or gist room: pick recipients from your circle.

import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useChatStore from "../../../stores/chatStore";
import useProfileStore from "../../../stores/profileStore";
import useAppStore from "../../../stores/appStore";
import { Header } from "../../../components/common";
import { Avatar, Button, Chip, EmptyState, Input, Text } from "../../../components/ui";

export default function NewGistScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const following = useProfileStore((s) => s.following);
  const upsertConversation = useChatStore((s) => s.upsertConversation);
  const showToast = useAppStore((s) => s.showToast);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");

  // Without an API there are no contacts to list; show the flow anyway.
  const contacts = useMemo(() => [], [following]);

  const toggle = (contact) => {
    setSelected((s) =>
      s.some((c) => c.id === contact.id)
        ? s.filter((c) => c.id !== contact.id)
        : [...s, contact]
    );
  };

  const start = () => {
    const isGroup = selected.length > 1;
    const id = `conv-${Date.now()}`;
    upsertConversation({
      id,
      type: isGroup ? "group" : "direct",
      name: isGroup ? groupName.trim() || "New group" : undefined,
      participants: selected,
      unreadCount: 0,
      updatedAt: Date.now(),
    });
    showToast("Conversation created", "success");
    router.replace(`/(main)/chats/${id}`);
  };

  return (
    <View style={styles.container}>
      <Header title="New gist" showBack />

      <View style={styles.body}>
        <Input
          placeholder="Search people…"
          value={query}
          onChangeText={setQuery}
          leftIcon="search-outline"
          autoCapitalize="none"
        />

        {selected.length > 0 ? (
          <View style={styles.selectedWrap}>
            {selected.map((contact) => (
              <Chip
                key={contact.id}
                label={contact.name || contact.username}
                selected
                onRemove={() => toggle(contact)}
                style={styles.chip}
              />
            ))}
          </View>
        ) : null}

        {selected.length > 1 ? (
          <Input
            label="Group name"
            placeholder="Weekend crew"
            value={groupName}
            onChangeText={setGroupName}
            containerStyle={styles.groupName}
          />
        ) : null}

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={contacts.length === 0 ? styles.empty : undefined}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No contacts yet"
              description="People you follow will appear here so you can start a chat."
            />
          }
          renderItem={({ item }) => {
            const isSelected = selected.some((c) => c.id === item.id);
            return (
              <Pressable style={styles.row} onPress={() => toggle(item)}>
                <Avatar uri={item.avatarUrl} name={item.name || item.username} size="md" />
                <View style={styles.rowBody}>
                  <Text variant="bodyMedium">{item.name || item.username}</Text>
                  <Text variant="caption" color="tertiary">
                    @{item.username}
                  </Text>
                </View>
                <Ionicons
                  name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                  size={layout.iconSize.md}
                  color={isSelected ? theme.colors.primary : colors.borderLight}
                />
              </Pressable>
            );
          }}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title={selected.length > 1 ? "Create group" : "Start chat"}
          size="large"
          fullWidth
          disabled={selected.length === 0}
          onPress={start}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
  },
  selectedWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
  },
  chip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  groupName: {
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  rowBody: {
    flex: 1,
    marginLeft: spacing.md,
  },
  empty: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: spacing.xxxl,
  },
  footer: {
    padding: spacing.screenHorizontal,
  },
});
