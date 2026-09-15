// app/(main)/chats/call/voice.jsx
// Voice call surface. Reads/writes chatStore.call for status, mute and duration.

import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import colors from "../../../../constants/colors";
import spacing from "../../../../constants/spacing";
import useChatStore from "../../../../stores/chatStore";
import { Avatar, IconButton, Text } from "../../../../components/ui";

export default function VoiceCallScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const call = useChatStore((s) => s.call);
  const conversation = useChatStore((s) => s.conversationsById[id]);
  const startCall = useChatStore((s) => s.startCall);
  const setCallStatus = useChatStore((s) => s.setCallStatus);
  const toggleCallMute = useChatStore((s) => s.toggleCallMute);
  const endCall = useChatStore((s) => s.endCall);

  const [seconds, setSeconds] = useState(0);

  // Establish the call if we arrived here directly.
  useEffect(() => {
    if (!call) {
      const peer = conversation?.participants?.[0] || {};
      startCall({ kind: "voice", peer, callId: id ? `call-${id}` : undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flip to active shortly after "connecting" so the timer can run.
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
      : "Calling…";

  const hangUp = () => {
    endCall();
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.top}>
        <Avatar uri={peer.avatarUrl} name={peer.name || peer.username} size="huge" />
        <Text variant="heading" style={styles.name}>
          {peer.name || peer.username || "Unknown"}
        </Text>
        <Text variant="body" color="secondary_text">
          {statusLabel}
        </Text>
      </View>

      <View style={styles.controls}>
        <IconButton
          name={call?.isMuted ? "mic-off" : "mic"}
          size="large"
          background={colors.surfaceLight}
          color={colors.white}
          onPress={toggleCallMute}
        />
        <IconButton
          name="volume-high"
          size="large"
          background={colors.surfaceLight}
          color={colors.white}
          onPress={() => {}}
        />

        <View style={styles.hangupWrap}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xxl,
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  hangupWrap: {
    marginLeft: spacing.xl,
  },
  hangup: {
    transform: [{ rotate: "135deg" }],
  },
});
