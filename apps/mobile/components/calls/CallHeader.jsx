// apps/mobile/components/calls/CallHeader.jsx

import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CallHeader({
  user,
  title,
  subtitle,
  callType = "video",
  onBack,
  onMore,
}) {
  const displayName = title || user?.name || user?.username || "Gist Call";

  const secondaryText =
    subtitle || (callType === "voice" ? "Voice call" : "Video call");

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </Pressable>

      <View style={styles.center}>
        {user?.avatar || user?.avatarUrl ? (
          <Image
            source={{ uri: user.avatar || user.avatarUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {displayName}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {secondaryText}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onMore}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="More call options"
      >
        <Ionicons name="ellipsis-vertical" size={23} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 70,
    paddingHorizontal: 14,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  center: {
    flex: 1,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  textContainer: {
    marginLeft: 10,
    maxWidth: "70%",
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 2,
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
  },
});
