// apps/mobile/components/calls/CallTimer.jsx

import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return [
      hours,
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    String(minutes).padStart(2, "0"),
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

export default function CallTimer({
  startedAt,
  initialSeconds = 0,
  running = true,
}) {
  const [elapsed, setElapsed] = useState(initialSeconds);

  useEffect(() => {
    if (!running) return undefined;

    if (startedAt) {
      const start = new Date(startedAt).getTime();

      if (!Number.isNaN(start)) {
        setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
      }
    }

    const interval = setInterval(() => {
      if (startedAt) {
        const start = new Date(startedAt).getTime();

        if (!Number.isNaN(start)) {
          setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
          return;
        }
      }

      setElapsed((value) => value + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, running]);

  return <Text style={styles.text}>{formatTime(elapsed)}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
