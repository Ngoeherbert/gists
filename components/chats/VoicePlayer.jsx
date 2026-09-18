// components/chats/VoicePlayer.jsx
// Play / pause + waveform progress for voice messages. Used by MessageBubble
// (chat thread) and the view-once preview modal.
//
// Two playback modes, unified behind one UI:
//   • real    — the message carries a `mediaUrl`: audio plays through
//               expo-audio (useAudioPlayer + useAudioPlayerStatus, SDK 54).
//   • virtual — no `mediaUrl` (mock recordings / seeded notes): a timer walks
//               the playhead across the message `duration` so play / pause /
//               replay behave identically without an audio file.
//
// Only one voice note plays at a time app-wide: starting one pauses the
// previous active instance via a module-level registry.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import spacing from "../../constants/spacing";
import Text from "../ui/Text";

// Module-level registry of the currently playing instance's pause callback.
let activePause = null;

function claimActive(pause) {
  if (activePause && activePause !== pause) activePause();
  activePause = pause;
}

function releaseActive(pause) {
  if (activePause === pause) activePause = null;
}

function fmt(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function VoicePlayer({
  uri = null,
  duration = 0,
  waveform = [],
  color = "#111118",
  dimOpacity = 0.35,
  style,
}) {
  const bars = waveform?.length
    ? waveform
    : Array.from({ length: 24 }, (_, i) => 0.3 + 0.5 * Math.abs(Math.sin(i * 1.3)));

  // ── Real playback (uri present) — expo-audio ──
  const player = useAudioPlayer(uri ? { uri } : null, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  // ── Virtual playback (no audio file) — timer-driven playhead ──
  const [virtualPlaying, setVirtualPlaying] = useState(false);
  const [virtualTime, setVirtualTime] = useState(0);
  const virtualTimeRef = useRef(0);
  virtualTimeRef.current = virtualTime;

  const total = Math.max(1, duration || 0); // fallback duration (seconds)
  const totalTime = uri && status.duration ? status.duration : total;

  // Walk the virtual playhead while "playing"; reset to 0 when it finishes.
  useEffect(() => {
    if (uri || !virtualPlaying) return undefined;
    const startedAt = Date.now();
    const base = virtualTimeRef.current;
    const id = setInterval(() => {
      const t = base + (Date.now() - startedAt) / 1000;
      if (t >= total) {
        setVirtualTime(0);
        setVirtualPlaying(false);
        releaseActive(pauseSelfRef.current);
      } else {
        setVirtualTime(t);
      }
    }, 100);
    return () => clearInterval(id);
  }, [uri, virtualPlaying, total]);

  // expo-audio does NOT auto-reset at the end (the player stays paused at the
  // last position) — rewind so the next play starts from the top.
  useEffect(() => {
    if (uri && status.didJustFinish) {
      try { player.seekTo(0); } catch { /* native gone */ }
    }
  }, [uri, status.didJustFinish, player]);

  // Pause callback handed to the app-wide "only one playing" registry.
  const pauseSelfRef = useRef(() => {});
  pauseSelfRef.current = () => {
    try {
      if (uri) {
        player?.pause();
      } else {
        setVirtualPlaying(false);
      }
    } catch {
      releaseActive(pauseSelfRef.current);
    }
  };

  // Deregister on unmount so a dead instance never gets paused.
  useEffect(() => () => releaseActive(pauseSelfRef.current), []);

  const isPlaying = uri ? Boolean(status.playing) : virtualPlaying;
  const position = uri ? status.currentTime || 0 : virtualTime;

  const toggle = useCallback(() => {
    if (uri) {
      try {
        if (status.playing) {
          player.pause();
          releaseActive(pauseSelfRef.current);
        } else {
          claimActive(pauseSelfRef.current);
          const dur = status.duration || duration || 0;
          if ((status.currentTime || 0) >= dur - 0.05) {
            try { player.seekTo(0); } catch { /* native gone */ }
          }
          player.play();
        }
      } catch {
        releaseActive(pauseSelfRef.current);
      }
    } else if (virtualPlaying) {
      setVirtualPlaying(false);
      releaseActive(pauseSelfRef.current);
    } else {
      claimActive(pauseSelfRef.current);
      if (virtualTimeRef.current >= total) setVirtualTime(0);
      setVirtualPlaying(true);
    }
  }, [
    uri,
    status.playing,
    status.currentTime,
    status.duration,
    duration,
    player,
    virtualPlaying,
    total,
  ]);

  const ratio = totalTime ? Math.min(1, position / totalTime) : 0;
  const playedBars = Math.floor(ratio * bars.length);

  return (
    <View style={[styles.row, style]}>
      <Pressable
        onPress={toggle}
        hitSlop={10}
        style={styles.btn}
        accessibilityLabel={isPlaying ? "Pause voice message" : "Play voice message"}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={17}
          color={color}
          style={!isPlaying ? styles.nudge : null}
        />
      </Pressable>
      <View style={styles.wave}>
        {bars.map((v, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: Math.max(4, Math.round(26 * v)),
                backgroundColor: color,
                opacity: i < playedBars ? 1 : dimOpacity,
              },
            ]}
          />
        ))}
      </View>
      <Text variant="caption" style={[styles.time, { color }]}>
        {fmt(Math.max(0, totalTime - position))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  btn: {
    width: 26,
    alignItems: "center",
  },
  nudge: {
    // optically center the play glyph inside its slot
    marginLeft: 2,
  },
  wave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
  },
  time: {
    opacity: 0.8,
    minWidth: 34,
    textAlign: "right",
    fontSize: 11,
  },
});

export default VoicePlayer;
