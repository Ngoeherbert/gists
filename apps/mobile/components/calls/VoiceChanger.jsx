// apps/mobile/components/calls/VoiceChanger.jsx

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const VOICES = [
  { id: "normal", label: "Normal", icon: "person-outline" },
  { id: "deep", label: "Deep", icon: "mic-outline" },
  { id: "high", label: "High", icon: "sparkles-outline" },
  { id: "robot", label: "Robot", icon: "hardware-chip-outline" },
  { id: "echo", label: "Echo", icon: "radio-outline" },
];

export default function VoiceChanger({
  selected = "normal",
  onSelect,
  voices = VOICES,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice changer</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {voices.map((voice) => {
          const active = selected === voice.id;

          return (
            <Pressable
              key={voice.id}
              onPress={() => onSelect?.(voice.id)}
              style={[styles.item, active && styles.activeItem]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.icon, active && styles.activeIcon]}>
                {voice.icon === "person-outline"
                  ? "●"
                  : voice.icon === "mic-outline"
                    ? "◉"
                    : voice.icon === "sparkles-outline"
                      ? "✦"
                      : voice.icon === "hardware-chip-outline"
                        ? "▣"
                        : "◌"}
              </Text>

              <Text style={[styles.label, active && styles.activeLabel]}>
                {voice.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.note}>
        Voice effects may depend on the call audio system.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingBottom: 18,
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 12,
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
  },
  item: {
    minWidth: 82,
    height: 78,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeItem: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  icon: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 6,
  },
  activeIcon: {
    color: "#000",
  },
  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontWeight: "500",
  },
  activeLabel: {
    color: "#000",
    fontWeight: "700",
  },
  note: {
    paddingHorizontal: 16,
    marginTop: 12,
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    lineHeight: 16,
  },
});
