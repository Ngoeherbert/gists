import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../common/Avatar";
import NotificationIcon from "./NotificationIcon";

export default function NotificationItem({
  notification,
  type = "system",
  user,
  title,
  message,
  timestamp,
  read = false,
  icon,
  action,
  actionLabel,
  onPress,
  onAction,
}) {
  const notificationUser = user || notification?.user || notification?.actor;

  const displayName =
    notificationUser?.name || notificationUser?.username || "Someone";

  const resolvedTitle = title || notification?.title || displayName;

  const resolvedMessage =
    message || notification?.message || notification?.body;

  const resolvedTimestamp =
    timestamp || notification?.timestamp || notification?.createdAt;

  const hasAvatar = Boolean(
    notificationUser?.avatar ||
    notificationUser?.avatarUrl ||
    notificationUser?.image,
  );

  const handleAction = (event) => {
    event?.stopPropagation?.();
    onAction?.(notification);
  };

  return (
    <Pressable
      onPress={() => onPress?.(notification)}
      style={({ pressed }) => [
        styles.container,
        !read && styles.unread,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.leading}>
        {hasAvatar ? (
          <View style={styles.avatarWrapper}>
            <Avatar
              uri={
                notificationUser?.avatar ||
                notificationUser?.avatarUrl ||
                notificationUser?.image
              }
              name={displayName}
              size={48}
            />

            <View style={styles.typeIcon}>
              <Ionicons
                name={
                  icon ||
                  (type === "like"
                    ? "heart"
                    : type === "comment"
                      ? "chatbubble"
                      : type === "follow"
                        ? "person-add"
                        : "notifications")
                }
                size={11}
                color="#fff"
              />
            </View>
          </View>
        ) : (
          <NotificationIcon type={type} icon={icon} size={48} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, !read && styles.unreadTitle]}
            numberOfLines={2}
          >
            {resolvedTitle}
          </Text>

          {!read ? <View style={styles.unreadDot} /> : null}
        </View>

        {resolvedMessage ? (
          <Text style={styles.message} numberOfLines={2}>
            {resolvedMessage}
          </Text>
        ) : null}

        {resolvedTimestamp ? (
          <Text style={styles.timestamp}>{resolvedTimestamp}</Text>
        ) : null}

        {action || actionLabel ? (
          <Pressable
            onPress={handleAction}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionPressed,
            ]}
          >
            {action || <Text style={styles.actionText}>{actionLabel}</Text>}
          </Pressable>
        ) : null}
      </View>

      {onPress ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#999"
          style={styles.chevron}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 78,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },

  unread: {
    backgroundColor: "#fafafa",
    borderColor: "#e6e6e6",
  },

  leading: {
    marginRight: 12,
  },

  avatarWrapper: {
    position: "relative",
  },

  typeIcon: {
    position: "absolute",
    right: -3,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flex: 1,
    color: "#333",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  unreadTitle: {
    color: "#000",
    fontWeight: "800",
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#000",
    marginLeft: 8,
  },

  message: {
    color: "#777",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  timestamp: {
    color: "#999",
    fontSize: 10,
    marginTop: 5,
  },

  actionButton: {
    alignSelf: "flex-start",
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,
  },

  actionText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  actionPressed: {
    opacity: 0.7,
  },

  chevron: {
    marginLeft: 8,
  },

  pressed: {
    opacity: 0.7,
  },
});
