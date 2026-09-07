// apps/mobile/components/calls/VideoView.jsx

import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VideoView({
  participant,
  muted = false,
  cameraOff = false,
  mirrored = false,
  onPress,
  onDoublePress,
  children,
}) {
  const image =
    participant?.videoUrl ||
    participant?.videoUri ||
    participant?.avatar ||
    participant?.avatarUrl;

  return (
    <Pressable
      onPress={onPress}
      onDoublePress={onDoublePress}
      style={styles.container}
    >
      {cameraOff || !image ? (
        <View style={styles.placeholder}>
          <Ionicons name="person" size={70} color="rgba(255,255,255,0.8)" />
        </View>
      ) : (
        <Image
          source={{ uri: image }}
          style={[styles.media, mirrored && styles.mirrored]}
        />
      )}

      <View style={styles.topOverlay}>
        {muted && (
          <View style={styles.statusBadge}>
            <Ionicons name="mic-off" size={15} color="#fff" />
          </View>
        )}
      </View>

      {cameraOff && (
        <View style={styles.cameraOffLabel}>
          <Ionicons name="videocam-off" size={16} color="#fff" />
        </View>
      )}

      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  media: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252525",
  },
  topOverlay: {
    position: "absolute",
    top: 14,
    right: 14,
  },
  statusBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraOffLabel: {
    position: "absolute",
    left: 14,
    bottom: 14,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
});
