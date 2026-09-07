import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SettingRow({
  icon,
  title,
  description,
  onPress,
  right,
  danger = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.pressed,
      ]}
    >
      <View
        style={[styles.iconContainer, danger && styles.dangerIconContainer]}
      >
        <Ionicons name={icon} size={19} color={danger ? "#E53935" : "#000"} />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, danger && styles.dangerText]}>{title}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      {right}
    </Pressable>
  );
}

export default function RoomSettings({
  notifications = true,
  muted = false,
  onlyAdminsCanSend = false,
  isAdmin = false,
  onNotificationsChange,
  onMutedChange,
  onOnlyAdminsCanSendChange,
  onInvite,
  onLeave,
  onDelete,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Room settings</Text>

      <SettingRow
        icon="notifications-outline"
        title="Notifications"
        description="Receive notifications for room activity"
        right={
          <Switch value={notifications} onValueChange={onNotificationsChange} />
        }
      />

      <SettingRow
        icon="volume-mute-outline"
        title="Mute room"
        description="Stop notifications temporarily"
        right={<Switch value={muted} onValueChange={onMutedChange} />}
      />

      {isAdmin && (
        <>
          <Text style={styles.sectionTitle}>Permissions</Text>

          <SettingRow
            icon="shield-checkmark-outline"
            title="Admin-only messages"
            description="Only admins can send messages"
            right={
              <Switch
                value={onlyAdminsCanSend}
                onValueChange={onOnlyAdminsCanSendChange}
              />
            }
          />
        </>
      )}

      <Text style={styles.sectionTitle}>Room actions</Text>

      <SettingRow
        icon="person-add-outline"
        title="Invite people"
        description="Invite more people to this room"
        onPress={onInvite}
        right={<Ionicons name="chevron-forward" size={19} color="#999" />}
      />

      <SettingRow
        icon="exit-outline"
        title="Leave room"
        description="Leave this Gist Room"
        onPress={onLeave}
        danger
        right={<Ionicons name="chevron-forward" size={19} color="#E53935" />}
      />

      {isAdmin && (
        <SettingRow
          icon="trash-outline"
          title="Delete room"
          description="Permanently delete this Gist Room"
          onPress={onDelete}
          danger
          right={<Ionicons name="chevron-forward" size={19} color="#E53935" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 20,
  },

  sectionTitle: {
    color: "#777",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 8,
  },

  row: {
    minHeight: 68,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },

  dangerIconContainer: {
    backgroundColor: "#FFF0F0",
  },

  textContainer: {
    flex: 1,
    marginHorizontal: 13,
  },

  title: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },

  dangerText: {
    color: "#E53935",
  },

  description: {
    color: "#777",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  pressed: {
    opacity: 0.6,
  },
});
