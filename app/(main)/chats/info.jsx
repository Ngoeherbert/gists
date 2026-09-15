// app/(main)/chats/info.jsx
// Conversation details: participants, media, and per-chat controls.

import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useChatStore from "../../../stores/chatStore";
import useAppStore from "../../../stores/appStore";
import { Header, Screen } from "../../../components/common";
import { Avatar, Card, Divider, Text } from "../../../components/ui";

export default function ChatInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useAppTheme();
  const showToast = useAppStore((s) => s.showToast);

  const conversation = useChatStore((s) => s.conversationsById[id]);
  const toggleMute = useChatStore((s) => s.toggleMute);
  const togglePin = useChatStore((s) => s.togglePin);
  const removeConversation = useChatStore((s) => s.removeConversation);
  const mutedList = useChatStore((s) => s.muted);
  const pinnedList = useChatStore((s) => s.pinned);

  const [muted, setMuted] = useState(mutedList.includes(id));
  const [pinned, setPinned] = useState(pinnedList.includes(id));

  const participants = conversation?.participants ?? [];

  const confirmDeleteChat = () => {
    Alert.alert(
      "Delete chat?",
      "This conversation and its messages will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeConversation(id);
            showToast("Chat deleted", "success");
            router.back();
          },
        },
      ]
    );
  };

  return (
    <Screen scroll padded={false} header={<Header title="Chat info" showBack />}>
      <View style={styles.body}>
          <View style={styles.hero}>
            <Avatar
              uri={participants[0]?.avatarUrl}
              name={conversation?.name || participants[0]?.name}
              size="huge"
            />
            <Text variant="title" style={styles.heroName}>
              {conversation?.name || participants[0]?.name || "Conversation"}
            </Text>
            {participants[0]?.username ? (
              <Text variant="bodySmall" color="secondary_text">
                @{participants[0].username}
              </Text>
            ) : null}
          </View>

          <Card padding="none" style={styles.group}>
            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Mute notifications
              </Text>
              <Switch
                value={muted}
                onValueChange={(v) => {
                  setMuted(v);
                  toggleMute(id);
                }}
                trackColor={{ true: theme.colors.primary, false: colors.border }}
              />
            </View>
            <Divider />
            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Pin to top
              </Text>
              <Switch
                value={pinned}
                onValueChange={(v) => {
                  setPinned(v);
                  togglePin(id);
                }}
                trackColor={{ true: theme.colors.primary, false: colors.border }}
              />
            </View>
          </Card>

          <Card padding="none" style={styles.group}>
            <Pressable
              style={styles.row}
              onPress={() => showToast("Media gallery coming soon", "info")}
            >
              <Ionicons
                name="images-outline"
                size={layout.iconSize.md}
                color={theme.text.secondary}
                style={styles.rowIcon}
              />
              <Text variant="bodyMedium" style={styles.rowLabel}>
                Shared media
              </Text>
              <Ionicons name="chevron-forward" size={layout.iconSize.md} color={theme.text.tertiary} />
            </Pressable>
            <Divider />
            <Pressable
              style={styles.row}
              onPress={confirmDeleteChat}
            >
              <Ionicons
                name="trash-outline"
                size={layout.iconSize.md}
                color={theme.status.error}
                style={styles.rowIcon}
              />
              <Text variant="bodyMedium" color="error" style={styles.rowLabel}>
                Delete chat
              </Text>
            </Pressable>
          </Card>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.screenHorizontal,
  },
  hero: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  heroName: {
    marginTop: spacing.md,
  },
  group: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.cardPadding,
    paddingVertical: spacing.lg,
  },
  rowIcon: {
    marginRight: spacing.md,
  },
  rowLabel: {
    flex: 1,
  },
  label: {
    flex: 1,
  },
});
