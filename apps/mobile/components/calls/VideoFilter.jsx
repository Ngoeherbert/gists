// apps/mobile/components/calls/VideoFilter.jsx

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const FILTERS = [
  { id: "none", label: "Original" },
  { id: "mono", label: "Mono" },
  { id: "warm", label: "Warm" },
  { id: "cool", label: "Cool" },
  { id: "vintage", label: "Vintage" },
  { id: "dramatic", label: "Dramatic" },
];

export default function VideoFilter({
  selected = "none",
  onSelect,
  filters = FILTERS,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video filters</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {filters.map((filter) => {
          const active = selected === filter.id;

          return (
            <Pressable
              key={filter.id}
              onPress={() => onSelect?.(filter.id)}
              style={[styles.item, active && styles.activeItem]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <View style={[styles.preview, active && styles.activePreview]}>
                <Text
                  style={[
                    styles.previewText,
                    active && styles.activePreviewText,
                  ]}
                >
                  Aa
                </Text>
              </View>

              <Text style={[styles.label, active && styles.activeLabel]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 10,
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    alignItems: "center",
  },
  preview: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activePreview: {
    borderColor: "#fff",
    backgroundColor: "#111",
  },
  previewText: {
    color: "#111",
    fontSize: 18,
    fontWeight: "700",
  },
  activePreviewText: {
    color: "#fff",
  },
  label: {
    marginTop: 6,
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "700",
  },
});
