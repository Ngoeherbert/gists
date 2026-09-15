// app/(main)/feeds/discover.jsx
// Discover hub: trending topics, suggested accounts and explore posts.

import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import spacing from "../../../constants/spacing";
import { Header, Screen } from "../../../components/common";
import { Card, Text } from "../../../components/ui";

const TOPICS = [
  { id: "1", name: "React Native", posts: "12.4K posts" },
  { id: "2", name: "Expo", posts: "8.2K posts" },
  { id: "3", name: "Design", posts: "15.7K posts" },
  { id: "4", name: "Startups", posts: "9.1K posts" },
];

const SUGGESTIONS = [
  { id: "1", name: "Ada Lovelace", username: "ada", bio: "Computer scientist & mathematician" },
  { id: "2", name: "Linus Torvalds", username: "linus", bio: "Creator of Linux & Git" },
  { id: "3", name: "Grace Hopper", username: "grace", bio: "Pioneer of compiler tech" },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <Screen
      padded={false}
      header={<Header title="Discover" showBack />}
    >
      <View style={styles.body}>
        <View style={styles.section}>
          <Text variant="title" style={styles.sectionTitle}>
            Topics
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TOPICS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable style={styles.chip} onPress={() => router.push(`/(main)/feeds/post/${item.id}`)}>
                <Text variant="bodyMedium">{item.name}</Text>
                <Text variant="caption" color="tertiary">
                  {item.posts}
                </Text>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text variant="title" style={styles.sectionTitle}>
            Suggested accounts
          </Text>
          <FlatList
            data={SUGGESTIONS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.suggestion}
                onPress={() => router.push(`/profile/${item.id}`)}
              >
                <View style={styles.suggestionInfo}>
                  <Text variant="bodyMedium" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text variant="caption" color="secondary_text" numberOfLines={1}>
                    @{item.username} · {item.bio}
                  </Text>
                </View>
                <Text variant="caption" color="primary">
                  View
                </Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  chip: {
    marginRight: spacing.sm,
    padding: spacing.md,
    borderRadius: 999,
    backgroundColor: "rgba(128,128,128,0.08)",
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.2)",
  },
  suggestionInfo: {
    flex: 1,
  },
});