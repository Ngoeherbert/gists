import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const DEFAULT_STORY = {
  username: "Herbert",
  avatar: "https://i.pravatar.cc/150?img=12",
  uri: null,
  type: "image",
  text: "",
  backgroundColor: "#000000",
};

export default function StoryViewerScreen() {
  const params = useLocalSearchParams();

  const [story, setStory] = useState({
    ...DEFAULT_STORY,
    username:
      typeof params.username === "string"
        ? params.username
        : DEFAULT_STORY.username,
    avatar:
      typeof params.avatar === "string" ? params.avatar : DEFAULT_STORY.avatar,
    uri: typeof params.uri === "string" ? params.uri : null,
    type: typeof params.type === "string" ? params.type : "image",
    text: typeof params.text === "string" ? params.text : "",
    backgroundColor:
      typeof params.backgroundColor === "string"
        ? params.backgroundColor
        : "#000000",
  });

  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setProgress(0);

    if (paused) {
      return;
    }

    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 1) {
          clearInterval(interval);
          return 1;
        }

        return current + 0.01;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story.uri, story.text, paused]);

  const handleClose = () => {
    router.replace("/(main)/feeds");
  };

  const handlePrevious = () => {
    setProgress(0);
  };

  const handleNext = () => {
    setProgress(1);
  };

  const togglePause = () => {
    setPaused((current) => !current);
  };

  const isTextStory = story.type === "text" || Boolean(story.text);

  return (
    <View
      style={[
        styles.container,
        isTextStory && {
          backgroundColor: story.backgroundColor,
        },
      ]}
    >
      {/* STORY CONTENT */}
      {isTextStory ? (
        <View style={styles.textStory}>
          <Text style={styles.storyText}>{story.text}</Text>
        </View>
      ) : story.uri ? (
        <Image
          source={{ uri: story.uri }}
          style={styles.media}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.emptyStory}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      )}

      <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
        {/* PROGRESS */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image source={{ uri: story.avatar }} style={styles.avatar} />

            <View style={styles.userText}>
              <Text style={styles.username}>{story.username}</Text>

              <Text style={styles.time}>Just now</Text>
            </View>
          </View>

          <Pressable
            onPress={handleClose}
            hitSlop={10}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Close Story"
          >
            <Ionicons name="close" size={29} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* TAP ZONES */}
        <View style={styles.tapZones} pointerEvents="box-none">
          <Pressable
            onPress={handlePrevious}
            onLongPress={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
            style={styles.leftZone}
            accessibilityLabel="Previous Story"
          />

          <Pressable
            onPress={handleNext}
            onLongPress={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
            style={styles.rightZone}
            accessibilityLabel="Next Story"
          />
        </View>

        {/* PAUSE INDICATOR */}
        {paused ? (
          <View style={styles.pauseIndicator}>
            <Ionicons name="pause" size={28} color="#FFFFFF" />
          </View>
        ) : null}

        {/* BOTTOM ACTIONS */}
        <View style={styles.bottomArea}>
          <Pressable style={styles.replyButton} onPress={togglePause}>
            <Ionicons
              name={paused ? "play" : "chatbubble-outline"}
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.replyText}>{paused ? "Resume" : "Reply"}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Share Story"
          >
            <Ionicons name="paper-plane-outline" size={23} color="#FFFFFF" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="More Story options"
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  media: {
    width,
    height,
    backgroundColor: "#000000",
  },

  emptyStory: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },

  textStory: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 34,
  },

  storyText: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "800",
    textAlign: "center",
  },

  progressContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 5,
  },

  progressTrack: {
    width: "100%",
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },

  header: {
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  userText: {
    marginLeft: 10,
  },

  username: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  time: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    marginTop: 2,
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    zIndex: -1,
  },

  leftZone: {
    width: "35%",
    height: "100%",
  },

  rightZone: {
    flex: 1,
    height: "100%",
  },

  pauseIndicator: {
    position: "absolute",
    top: "48%",
    left: "50%",
    marginLeft: -28,
    marginTop: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomArea: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  replyButton: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "rgba(0,0,0,0.28)",
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  replyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  actionButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.95 }],
  },
});
