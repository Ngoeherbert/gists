// app/(main)/chats/call/video.jsx
// Video call surface: remote view fills the screen, self-view floats on top.

import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import layout from "../../../../constants/layout";
import spacing from "../../../../constants/spacing";
import useChatStore from "../../../../stores/chatStore";
import { IconButton, Text } from "../../../../components/ui";

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const call = useChatStore((s) => s.call);
  const conversation = useChatStore((s) => s.conversationsById[id]);
  const startCall = useChatStore((s) => s.startCall);
  const setCallStatus = useChatStore((s) => s.setCallStatus);
  const toggleCallMute = useChatStore((s) => s.toggleCallMute);
  const toggleCamera = useChatStore((s) => s.toggleCamera);
  const endCall = useChatStore((s) => s.endCall);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!call) {
      const peer = conversation?.participants?.[0] || {};
      startCall({ kind: "video", peer, callId: id ? `call-${id}` : undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setCallStatus("active"), 1200);
    return () => clearTimeout(t);
  }, [setCallStatus]);

  useEffect(() => {
    if (call?.status !== "active") return undefined;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [call?.status]);

  const peer = call?.peer || conversation?.participants?.[0] || {};
  const statusLabel =
    call?.status === "active"
      ? `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
      : "Connecting…";

  const hangUp = () => {
    endCall();
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Remote video placeholder fills the screen. */}
      <View style={styles.remote}>
        <Ionicons name="videocam-outline" size={64} color={colors.textMuted} />
        <Text variant="title" style={styles.name}>
          {peer.name || peer.username || "Unknown"}
        </Text>
        <Text variant="bodySmall" color="secondary_text">
          {statusLabel}
        </Text>
      </View>

      {/* Self-view */}
      <View
        style={[
          styles.selfView,
          {
            top: insets.top + spacing.md,
            opacity: call?.isCameraOn ? 1 : 0.4,
          },
        ]}
      >
        <Ionicons
          name={call?.isCameraOn ? "person-outline" : "videocam-off-outline"}
          size={layout.iconSize.lg}
          color={colors.white}
        />
      </View>

      <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <IconButton
          name={call?.isMuted ? "mic-off" : "mic"}
          size="large"
          background={colors.surfaceLight}
          color={colors.white}
          onPress={toggleCallMute}
        />
        <IconButton
          name={call?.isCameraOn ? "videocam" : "videocam-off"}
          size="large"
          background={colors.surfaceLight}
          color={colors.white}
          onPress={toggleCamera}
        />
        <IconButton
          name="camera-reverse-outline"
          size="large"
          background={colors.surfaceLight}
          color={colors.white}
          onPress={() => {}}
        />
        <IconButton
          name="call"
          size="large"
          background={colors.error}
          color={colors.white}
          onPress={hangUp}
          style={styles.hangup}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  remote: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    color: colors.white,
  },
  selfView: {
    position: "absolute",
    right: spacing.md,
    width: 100,
    height: 150,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: spacing.lg,
  },
  hangup: {
    transform: [{ rotate: "135deg" }],
  },
});
