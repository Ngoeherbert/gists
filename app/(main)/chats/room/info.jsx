// app/(main)/chats/room/info.jsx
// Room details and settings: who's here, invite, and leave/end the room.

import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import layout from "../../../../constants/layout";
import spacing from "../../../../constants/spacing";
import useAppTheme from "../../../../hooks/useAppTheme";
import useChatStore from "../../../../stores/chatStore";
import useAppStore from "../../../../stores/appStore";
import { Header, Screen } from "../../../../components/common";
import { Avatar, Card, Divider, EmptyState, Text } from "../../../../components/ui";

export default function RoomInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useAppTheme();

  const room = useChatStore((s) => s.rooms[id]);
  const leaveRoom = useChatStore((s) => s.leaveRoom);
  const showToast = useAppStore((s) => s.showToast);

  const [openRoom, setOpenRoom] = useState(room?.isPublic ?? true);
  const [allowInvites, setAllowInvites] = useState(true);

  const participants = room?.participants ?? [];

  return (
    <View style={styles.container}>
      <Header title="Room info" showBack />

      <Screen scroll padded={false}>
        <View style={styles.body}>
          <Card padding="medium" style={styles.group}>
            <Text variant="bodyMedium" style={styles.sectionTitle}>
              Members
            </Text>

            {participants.length === 0 ? (
              <EmptyState
                compact
                icon="people-outline"
                title="No one else yet"
                description="Share the room link to invite friends."
              />
            ) : (
              participants.map((participant) => (
                <View key={participant.id} style={styles.member}>
                  <Avatar
                    uri={participant.avatarUrl}
                    name={participant.name || participant.username}
                    size="sm"
                  />
                  <Text variant="bodySmall" style={styles.memberName}>
                    {participant.name || participant.username}
                  </Text>
                </View>
              ))
            )}
          </Card>

          <Card padding="none" style={styles.group}>
            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Open room
              </Text>
              <Switch
                value={openRoom}
                onValueChange={setOpenRoom}
                trackColor={{ true: theme.colors.primary, false: colors.border }}
              />
            </View>
            <Divider />
            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Allow invites
              </Text>
              <Switch
                value={allowInvites}
                onValueChange={setAllowInvites}
                trackColor={{ true: theme.colors.primary, false: colors.border }}
              />
            </View>
          </Card>

          <Card padding="none">
            <Pressable
              style={styles.row}
              onPress={() => {
                showToast("Invite link copied", "success");
              }}
            >
              <Ionicons
                name="link-outline"
                size={layout.iconSize.md}
                color={theme.text.secondary}
                style={styles.rowIcon}
              />
              <Text variant="bodyMedium" style={styles.rowLabel}>
                Copy invite link
              </Text>
            </Pressable>
            <Divider />
            <Pressable
              style={styles.row}
              onPress={() => {
                leaveRoom(id);
                showToast("You left the room", "info");
                router.back();
              }}
            >
              <Ionicons
                name="exit-outline"
                size={layout.iconSize.md}
                color={theme.status.error}
                style={styles.rowIcon}
              />
              <Text variant="bodyMedium" color="error" style={styles.rowLabel}>
                Leave room
              </Text>
            </Pressable>
          </Card>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: spacing.screenHorizontal,
  },
  group: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  member: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  memberName: {
    marginLeft: spacing.sm,
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
