// app/(main)/chats/room/[id].jsx
// Gist room: a shared watch/play session with participants and room controls.
// Room state lives in chatStore.rooms.

import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import layout from "../../../../constants/layout";
import spacing from "../../../../constants/spacing";
import useAppTheme from "../../../../hooks/useAppTheme";
import useChatStore from "../../../../stores/chatStore";
import useAppStore from "../../../../stores/appStore";
import { Header, Screen } from "../../../../components/common";
import { Avatar, Button, Card, EmptyState, IconButton, Text } from "../../../../components/ui";

export default function RoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const room = useChatStore((s) => s.rooms[id]);
  const upsertRoom = useChatStore((s) => s.upsertRoom);
  const setActiveRoom = useChatStore((s) => s.setActiveRoom);
  const showToast = useAppStore((s) => s.showToast);

  useEffect(() => {
    // Entering the route creates the room if it doesn't exist yet.
    if (!room) {
      upsertRoom({
        id,
        name: "Gist room",
        participants: [],
        media: null,
        game: null,
        createdAt: Date.now(),
      });
    }
    setActiveRoom(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const participants = room?.participants ?? [];

  return (
    <Screen
      scroll
      padded={false}
      header={
        <Header
          title={room?.name || "Gist room"}
          subtitle={`${participants.length} in the room`}
          showBack
          right={
            <IconButton
              name="information-circle-outline"
              onPress={() => router.navigate(`/(main)/chats/room/info?id=${id}`)}
            />
          }
        />
      }
    >
      <View style={styles.body}>
        {/* Shared stage */}
        <View
          style={[
            styles.stage,
            { backgroundColor: isDark ? colors.surface : theme.app.surface },
          ]}
        >
          <Ionicons name="tv-outline" size={layout.iconSize.huge} color={theme.text.muted} />
          <Text variant="bodySmall" color="tertiary" style={styles.stageLabel}>
            {room?.media ? "Playing together" : "Nothing playing yet"}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Watch together"
            icon="play-outline"
            variant="outline"
            fullWidth
            onPress={() => showToast("Watch parties aren't wired up yet", "info")}
            style={styles.actionButton}
          />
          <Button
            title="Play a game"
            icon="game-controller-outline"
            variant="outline"
            fullWidth
            onPress={() => router.navigate("/(main)/chats/room/games")}
            style={styles.actionButton}
          />
        </View>

        <Card padding="medium">
          <Text variant="bodyMedium" style={styles.sectionTitle}>
            In the room
          </Text>

          {participants.length === 0 ? (
            <EmptyState
              compact
              icon="people-outline"
              title="It's just you"
              description="Invite friends to join this room."
            />
          ) : (
            participants.map((participant) => (
              <Pressable
                key={participant.id}
                style={styles.participant}
                onPress={() => router.navigate(`/profile/${participant.id}`)}
              >
                <Avatar
                  uri={participant.avatarUrl}
                  name={participant.name || participant.username}
                  size="sm"
                />
                <Text variant="bodySmall" style={styles.participantName}>
                  {participant.name || participant.username}
                </Text>
              </Pressable>
            ))
          )}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.screenHorizontal,
  },
  stage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: layout.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  stageLabel: {
    marginTop: spacing.sm,
  },
  actions: {
    marginBottom: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  participant: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  participantName: {
    marginLeft: spacing.sm,
  },
});
