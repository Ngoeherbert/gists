import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ICON_CONFIG = {
  like: {
    icon: "heart",
    color: "#000",
  },
  reaction: {
    icon: "heart",
    color: "#000",
  },
  comment: {
    icon: "chatbubble",
    color: "#000",
  },
  reply: {
    icon: "return-down-forward",
    color: "#000",
  },
  follow: {
    icon: "person-add",
    color: "#000",
  },
  mention: {
    icon: "at",
    color: "#000",
  },
  repost: {
    icon: "repeat",
    color: "#000",
  },
  share: {
    icon: "paper-plane",
    color: "#000",
  },
  message: {
    icon: "chatbubble",
    color: "#000",
  },
  request: {
    icon: "person-add",
    color: "#000",
  },
  invite: {
    icon: "mail",
    color: "#000",
  },
  birthday: {
    icon: "gift",
    color: "#000",
  },
  verification: {
    icon: "checkmark-circle",
    color: "#000",
  },
  monetization: {
    icon: "cash",
    color: "#000",
  },
  system: {
    icon: "notifications",
    color: "#000",
  },
  alert: {
    icon: "alert-circle",
    color: "#000",
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function NotificationIcon({
  type = "system",
  icon,
  size = 44,
  iconSize = 21,
  backgroundColor = "#f3f3f3",
  color,
}) {
  const config = ICON_CONFIG[type] || ICON_CONFIG.system;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Ionicons
        name={icon || config.icon}
        size={iconSize}
        color={color || config.color}
      />
    </View>
  );
}
