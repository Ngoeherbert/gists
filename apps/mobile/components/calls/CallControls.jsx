// apps/mobile/components/calls/CallControls.jsx

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function ControlButton({
  icon,
  active = false,
  danger = false,
  onPress,
  accessibilityLabel,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.controlButton,
        active && styles.activeButton,
        danger && styles.dangerButton,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons
        name={icon}
        size={24}
        color={danger ? "#fff" : active ? "#000" : "#fff"}
      />
    </Pressable>
  );
}

export default function CallControls({
  muted = false,
  cameraOff = false,
  speakerOn = false,
  onToggleMute,
  onToggleCamera,
  onToggleSpeaker,
  onSwitchCamera,
  onEndCall,
  showCamera = true,
  showSpeaker = true,
}) {
  return (
    <View style={styles.container}>
      <ControlButton
        icon={muted ? "mic-off" : "mic"}
        active={muted}
        onPress={onToggleMute}
        accessibilityLabel={muted ? "Unmute microphone" : "Mute microphone"}
      />

      {showCamera && (
        <ControlButton
          icon={cameraOff ? "videocam-off" : "videocam"}
          active={cameraOff}
          onPress={onToggleCamera}
          accessibilityLabel={cameraOff ? "Turn camera on" : "Turn camera off"}
        />
      )}

      {showSpeaker && (
        <ControlButton
          icon={speakerOn ? "volume-high" : "volume-medium"}
          active={speakerOn}
          onPress={onToggleSpeaker}
          accessibilityLabel={
            speakerOn ? "Turn speaker off" : "Turn speaker on"
          }
        />
      )}

      <ControlButton
        icon="camera-reverse"
        onPress={onSwitchCamera}
        accessibilityLabel="Switch camera"
      />

      <ControlButton
        icon="call"
        danger
        onPress={onEndCall}
        accessibilityLabel="End call"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  controlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "#fff",
  },
  dangerButton: {
    backgroundColor: "#e53935",
  },
});
