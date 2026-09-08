import React from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StorySettingsScreen() {
  const params = useLocalSearchParams();

  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const uri = Array.isArray(params.uri) ? params.uri[0] : params.uri;
  const text = Array.isArray(params.text) ? params.text[0] : params.text;
  const backgroundColor = Array.isArray(params.backgroundColor)
    ? params.backgroundColor[0]
    : params.backgroundColor;

  const handleBack = () => {
    router.replace("/(main)/feeds/story/edit");
  };

  const handleShare = () => {
    /*
     * Pass the published story back to the feed.
     * Expo Router merges these params into the
     * route that replaces the current screen.
     *
     * FeedsScreen reads `publishedStory` and
     * prepends it to its story list.
     */
    router.replace({
      pathname: "/(main)/feeds",
      params: {
        publishedStory: JSON.stringify({
          id: `story-${Date.now()}`,
          userId: params.userId || "user-001",
          username: params.username || "herbert237",
          avatar: params.avatar || "",
          uri: uri || null,
          type: type || "image",
          text: text || "",
          backgroundColor: backgroundColor || "#000000",
        }),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.headerButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text style={styles.headerTitle}>Story settings</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Share your story</Text>

        <Text style={styles.subtitle}>
          Choose who can see your story and how people can interact with it.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audience</Text>

          <Pressable style={styles.option}>
            <View style={styles.iconContainer}>
              <Ionicons name="globe-outline" size={21} color="#111111" />
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Everyone</Text>

              <Text style={styles.optionSubtitle}>
                Anyone can view your story
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={19} color="#999999" />
          </Pressable>

          <Pressable style={styles.option}>
            <View style={styles.iconContainer}>
              <Ionicons name="people-outline" size={21} color="#111111" />
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Followers</Text>

              <Text style={styles.optionSubtitle}>
                Only people who follow you
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={19} color="#999999" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Story interactions</Text>

          <Pressable style={styles.option}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-outline" size={21} color="#111111" />
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Allow replies</Text>

              <Text style={styles.optionSubtitle}>
                Let people reply to your story
              </Text>
            </View>

            <View style={styles.toggle}>
              <View style={styles.toggleThumb} />
            </View>
          </Pressable>

          <Pressable style={styles.option}>
            <View style={styles.iconContainer}>
              <Ionicons name="paper-plane-outline" size={21} color="#111111" />
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Allow sharing</Text>

              <Text style={styles.optionSubtitle}>
                Let people share your story
              </Text>
            </View>

            <View style={styles.toggle}>
              <View style={styles.toggleThumb} />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.shareButtonPressed,
          ]}
        >
          <Text style={styles.shareButtonText}>Share to Story</Text>

          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 62,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111111",
  },

  headerSpacer: {
    width: 42,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 30,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: "#111111",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#777777",
    maxWidth: 430,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777777",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },

  option: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  optionContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },

  optionSubtitle: {
    fontSize: 12.5,
    color: "#888888",
    marginTop: 3,
  },

  toggle: {
    width: 42,
    height: 25,
    borderRadius: 14,
    backgroundColor: "#111111",
    paddingHorizontal: 3,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  toggleThumb: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
  },

  shareButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
  },

  shareButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  arrowContainer: {
    position: "absolute",
    right: 11,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
});
