// app/(main)/stories/viewer.jsx
// Full-screen story viewer. Each story auto-advances on a timer; tapping left
// or right skips, holding pauses. Progress lives in storyStore.

import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useStoryStore from "../../../stores/storyStore";
import { Avatar, IconButton, Text } from "../../../components/ui";

const STORY_DURATION = 5000;

export default function StoryViewerScreen() {
  const { groupId, index } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const groups = useStoryStore((s) => s.groups);
  const viewerGroupId = useStoryStore((s) => s.viewerGroupId);
  const isPaused = useStoryStore((s) => s.isPaused);
  const openViewer = useStoryStore((s) => s.openViewer);
  const closeViewer = useStoryStore((s) => s.closeViewer);
  const nextStory = useStoryStore((s) => s.nextStory);
  const prevStory = useStoryStore((s) => s.prevStory);
  const togglePause = useStoryStore((s) => s.togglePause);
  const markSeen = useStoryStore((s) => s.markSeen);
  const likeStory = useStoryStore((s) => s.likeStory);
  const currentStory = useStoryStore((s) => s.currentStory);

  const progress = useRef(new Animated.Value(0)).current;

  // Track whether the current press is a long-press so its release resumes
  // playback exactly once; short taps must never toggle pause.
  const isLongPress = useRef(false);

  const handleLongPress = useCallback(() => {
    isLongPress.current = true;
    togglePause();
  }, [togglePause]);

  const handlePressOut = useCallback(() => {
    if (!isLongPress.current) return;
    isLongPress.current = false;
    togglePause();
  }, [togglePause]);

  // Open the requested group when arriving with route params.
  useEffect(() => {
    if (groupId && viewerGroupId !== groupId) {
      openViewer(groupId, Number(index) || 0);
    }
    return () => {
      // Ensure the store reflects a closed viewer when we leave the route.
      closeViewer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const story = currentStory();
  const group = groups.find((g) => g.id === viewerGroupId);
  const author = group?.author || {};

  // Auto-advance timer.
  useEffect(() => {
    if (!story) return undefined;

    markSeen(story.id);
    progress.setValue(0);

    if (isPaused) return undefined;

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      if (finished) nextStory();
    });

    return () => animation.stop();
  }, [story?.id, isPaused, progress, markSeen, nextStory, story]);

  const close = useCallback(() => {
    closeViewer();
    router.back();
  }, [closeViewer, router]);

  if (!story || !group) {
    return (
      <View style={styles.empty}>
        <StatusBar style="light" />
        <Text variant="body" color="secondary_text">
          No story to show.
        </Text>
        <IconButton name="close" color={colors.white} onPress={close} style={styles.emptyClose} />
      </View>
    );
  }

  const startTime = story.createdAt ? new Date(story.createdAt) : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Media placeholder — image/video renders here. */}
      <View style={styles.media}>
        <Ionicons name="image-outline" size={72} color="rgba(255,255,255,0.35)" />
      </View>

      {/* Tap zones: left half = previous, right half = next. */}
      <Pressable
        style={styles.tapLeft}
        onPressIn={() => {
          isLongPress.current = false;
        }}
        onPress={prevStory}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
      />
      <Pressable
        style={styles.tapRight}
        onPressIn={() => {
          isLongPress.current = false;
        }}
        onPress={nextStory}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
      />

      {/* Progress bars */}
      <View style={[styles.progressRow, { top: insets.top + spacing.sm }]}>
        {group.stories.map((s, i) => {
          const isPast = i < group.stories.findIndex((x) => x.id === story.id);
          const isCurrent = s.id === story.id;
          return (
            <View key={s.id} style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: isPast ? "100%" : isCurrent ? undefined : "0%",
                  },
                ]}
              >
                {isCurrent ? (
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: colors.white,
                        width: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      {/* Header */}
      <View style={[styles.header, { top: insets.top + spacing.xl }]}>
        <Avatar uri={author.avatarUrl} name={author.name || author.username} size="sm" />
        <View style={styles.headerMeta}>
          <Text variant="bodySmall" style={styles.headerName}>
            {author.username || author.name || "user"}
          </Text>
          {startTime ? (
            <Text variant="caption" style={styles.headerTime}>
              {Math.max(1, Math.round((Date.now() - startTime.getTime()) / 3600000))}h ago
            </Text>
          ) : null}
        </View>
        <IconButton name="close" color={colors.white} onPress={close} />
      </View>

      {/* Caption */}
      {story.caption ? (
        <View style={[styles.captionWrap, { bottom: insets.bottom + 88 }]}>
          <Text variant="body" style={styles.caption}>
            {story.caption}
          </Text>
        </View>
      ) : null}

      {/* Footer actions */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View style={styles.replyBar}>
          <Text variant="bodySmall" color="tertiary">
            Send a reply…
          </Text>
        </View>
        <IconButton
          name={story.isLiked ? "heart" : "heart-outline"}
          color={story.isLiked ? colors.like : colors.white}
          onPress={() =>
            likeStory({ groupId: viewerGroupId, storyId: story.id, liked: !story.isLiked })
          }
        />
        <IconButton name="paper-plane-outline" color={colors.white} onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black,
  },
  emptyClose: {
    position: "absolute",
    top: spacing.huge,
    right: spacing.lg,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  tapLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "35%",
  },
  tapRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "65%",
  },
  progressRow: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginHorizontal: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  header: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  headerMeta: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerName: {
    color: colors.white,
  },
  headerTime: {
    color: "rgba(255,255,255,0.7)",
  },
  captionWrap: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
  },
  caption: {
    color: colors.white,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  replyBar: {
    flex: 1,
    height: 44,
    borderRadius: layout.borderRadius.round,
    borderWidth: layout.borderWidth.thin,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    marginRight: spacing.md,
  },
});
