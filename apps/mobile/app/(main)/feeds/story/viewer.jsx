import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const STORY_DURATION = 7000;

const DEFAULT_STORY = {
  id: "default-story",
  username: "Herbert",
  avatar: "https://i.pravatar.cc/150?img=12",
  uri: null,
  type: "image",
  text: "",
  backgroundColor: "#000000",
};

const REACTIONS = [
  {
    id: "like",
    emoji: "👍",
    label: "Like",
  },
  {
    id: "love",
    emoji: "❤️",
    label: "Love",
  },
  {
    id: "laugh",
    emoji: "😂",
    label: "Haha",
  },
  {
    id: "wow",
    emoji: "😮",
    label: "Wow",
  },
  {
    id: "sad",
    emoji: "😢",
    label: "Sad",
  },
  {
    id: "fire",
    emoji: "🔥",
    label: "Fire",
  },
];

export default function StoryViewerScreen() {
  const params = useLocalSearchParams();

  /*
   * --------------------------------------------------
   * CURRENT USER
   *
   * Used to detect whether the viewer is
   * showing the user's own stories.
   * --------------------------------------------------
   */

  const currentUser = useMemo(() => {
    const raw = params.currentUser;

    if (typeof raw !== "string" || !raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("Unable to parse currentUser:", error);

      return null;
    }
  }, [params.currentUser]);

  const currentUserId = currentUser?.id ?? currentUser?.userId ?? null;

  /*
   * --------------------------------------------------
   * STORIES
   * --------------------------------------------------
   */

  const stories = useMemo(() => {
    if (typeof params.stories === "string") {
      try {
        const parsed = JSON.parse(params.stories);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, index) => {
            const storyItem = item || {};

            const uri =
              storyItem?.uri ||
              storyItem?.url ||
              storyItem?.mediaUrl ||
              storyItem?.imageUrl ||
              storyItem?.media?.url ||
              null;

            return {
              ...DEFAULT_STORY,
              ...storyItem,

              id: storyItem?.id || `story-${index}`,

              uri,

              username:
                storyItem?.username ||
                storyItem?.user?.username ||
                DEFAULT_STORY.username,

              avatar:
                storyItem?.avatar ||
                storyItem?.avatarUrl ||
                storyItem?.user?.avatar ||
                DEFAULT_STORY.avatar,

              userId: storyItem?.userId || storyItem?.user?.id || null,

              type: storyItem?.type || DEFAULT_STORY.type,

              text: storyItem?.text || "",

              backgroundColor:
                storyItem?.backgroundColor || DEFAULT_STORY.backgroundColor,
            };
          });
        }
      } catch (error) {
        console.warn("Unable to parse stories:", error);
      }
    }

    /*
     * Backward compatibility.
     */
    return [
      {
        ...DEFAULT_STORY,

        username:
          typeof params.username === "string"
            ? params.username
            : DEFAULT_STORY.username,

        avatar:
          typeof params.avatar === "string"
            ? params.avatar
            : DEFAULT_STORY.avatar,

        uri: typeof params.uri === "string" ? params.uri : null,

        type:
          typeof params.type === "string" ? params.type : DEFAULT_STORY.type,

        text:
          typeof params.text === "string" ? params.text : DEFAULT_STORY.text,

        backgroundColor:
          typeof params.backgroundColor === "string"
            ? params.backgroundColor
            : DEFAULT_STORY.backgroundColor,

        userId: typeof params.userId === "string" ? params.userId : null,
      },
    ];
  }, [
    params.stories,
    params.username,
    params.avatar,
    params.uri,
    params.type,
    params.text,
    params.backgroundColor,
    params.userId,
  ]);

  /*
   * --------------------------------------------------
   * INITIAL INDEX
   * --------------------------------------------------
   */

  const initialIndex = useMemo(() => {
    const parsedIndex =
      typeof params.index === "string" ? Number.parseInt(params.index, 10) : 0;

    if (Number.isNaN(parsedIndex)) {
      return 0;
    }

    return Math.max(0, Math.min(parsedIndex, stories.length - 1));
  }, [params.index, stories.length]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  /*
   * If params.index changes because
   * Expo Router reuses the screen,
   * keep the viewer synchronized.
   */
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const story = stories[currentIndex] || DEFAULT_STORY;

  /*
   * --------------------------------------------------
   * STORY TYPE
   * --------------------------------------------------
   */

  const isTextStory = story.type === "text" || Boolean(story.text);

  /*
   * --------------------------------------------------
   * MEDIA STATE
   * --------------------------------------------------
   */

  const [mediaLoading, setMediaLoading] = useState(false);

  const [mediaError, setMediaError] = useState(false);

  const [mediaReady, setMediaReady] = useState(false);

  /*
   * Every time the active story changes,
   * reset its media state.
   */
  useEffect(() => {
    if (isTextStory) {
      setMediaLoading(false);
      setMediaError(false);
      setMediaReady(true);
      return;
    }

    if (story?.uri) {
      setMediaLoading(true);
      setMediaError(false);
      setMediaReady(false);
    } else {
      /*
       * No URI means this story cannot load.
       * Do not keep the viewer spinning forever.
       */
      setMediaLoading(false);
      setMediaError(true);
      setMediaReady(true);
    }
  }, [story?.id, story?.uri, story?.type, isTextStory]);

  /*
   * --------------------------------------------------
   * USER GROUPS
   * --------------------------------------------------
   */

  const userGroups = useMemo(() => {
    const groups = [];
    const map = new Map();

    stories.forEach((item) => {
      const key = String(item?.userId ?? item?.id);

      if (!map.has(key)) {
        const group = [];

        map.set(key, group);

        groups.push(group);
      }

      map.get(key).push(item);
    });

    return groups;
  }, [stories]);

  /*
   * --------------------------------------------------
   * ACTIVE USER GROUP
   * --------------------------------------------------
   */

  const activeGroup = useMemo(() => {
    const currentKey = String(story?.userId ?? story?.id);

    const group = userGroups.find(
      (item) => String(item[0]?.userId ?? item[0]?.id) === currentKey,
    );

    return group && group.length > 0 ? group : [story];
  }, [userGroups, story]);

  /*
   * --------------------------------------------------
   * GROUP STORY INDEX
   * --------------------------------------------------
   */

  const groupStoryIndex = useMemo(() => {
    const index = activeGroup.findIndex(
      (item) => String(item?.id) === String(story?.id),
    );

    return index >= 0 ? index : 0;
  }, [activeGroup, story?.id]);

  /*
   * --------------------------------------------------
   * STORY TRANSITION
   * --------------------------------------------------
   */

  const transitionOpacity = useRef(new Animated.Value(0)).current;

  const transitionTranslateX = useRef(new Animated.Value(0)).current;

  const previousStoryIdRef = useRef(story?.id);

  useEffect(() => {
    const previousStoryId = previousStoryIdRef.current;

    previousStoryIdRef.current = story?.id;

    if (previousStoryId === story?.id) {
      transitionOpacity.setValue(1);
      transitionTranslateX.setValue(0);
      return;
    }

    const previousIndex = stories.findIndex(
      (item) => String(item?.id) === String(previousStoryId),
    );

    const direction = previousIndex < currentIndex ? 1 : -1;

    transitionOpacity.setValue(0);

    transitionTranslateX.setValue(46 * direction);

    Animated.parallel([
      Animated.timing(transitionOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(transitionTranslateX, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    story?.id,
    currentIndex,
    stories,
    transitionOpacity,
    transitionTranslateX,
  ]);

  /*
   * --------------------------------------------------
   * PROGRESS
   * --------------------------------------------------
   */

  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);

  const [paused, setPaused] = useState(false);

  const storyStartedAtRef = useRef(Date.now());

  const storyFinishedRef = useRef(false);

  /*
   * --------------------------------------------------
   * COMMENT
   * --------------------------------------------------
   */

  const [commentInputVisible, setCommentInputVisible] = useState(false);

  const [comment, setComment] = useState("");

  /*
   * --------------------------------------------------
   * REACTION
   * --------------------------------------------------
   */

  const [reactionModalVisible, setReactionModalVisible] = useState(false);

  const [selectedReaction, setSelectedReaction] = useState(null);

  /*
   * --------------------------------------------------
   * MORE
   * --------------------------------------------------
   */

  const [moreModalVisible, setMoreModalVisible] = useState(false);

  /*
   * --------------------------------------------------
   * REACTION PICKER ANIMATION
   * --------------------------------------------------
   */

  const reactionScale = useRef(new Animated.Value(0.72)).current;

  const reactionOpacity = useRef(new Animated.Value(0)).current;

  const reactionTranslateY = useRef(new Animated.Value(18)).current;

  /*
   * --------------------------------------------------
   * FLOATING REACTION
   * --------------------------------------------------
   */

  const reactionFloatScale = useRef(new Animated.Value(0.65)).current;

  const reactionFloatOpacity = useRef(new Animated.Value(0)).current;

  const reactionFloatTranslateY = useRef(new Animated.Value(35)).current;

  /*
   * --------------------------------------------------
   * MORE MENU ANIMATION
   * --------------------------------------------------
   */

  const moreScale = useRef(new Animated.Value(0.92)).current;

  const moreOpacity = useRef(new Animated.Value(0)).current;

  /*
   * --------------------------------------------------
   * RESET TIMER
   * --------------------------------------------------
   */

  const resetStoryTimer = useCallback(() => {
    progressRef.current = 0;

    setProgress(0);

    storyFinishedRef.current = false;

    storyStartedAtRef.current = Date.now();
  }, []);

  /*
   * --------------------------------------------------
   * NEXT STORY
   * --------------------------------------------------
   */

  const handleNextStory = useCallback(() => {
    if (storyFinishedRef.current) {
      return;
    }

    storyFinishedRef.current = true;

    if (currentIndex < stories.length - 1) {
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);

      progressRef.current = 0;
      setProgress(0);

      storyStartedAtRef.current = Date.now();

      storyFinishedRef.current = false;

      setReactionModalVisible(false);

      setMoreModalVisible(false);

      setCommentInputVisible(false);

      setComment("");

      return;
    }

    /*
     * No more stories.
     *
     * Go back instead of replace().
     * This keeps the feed in the navigation
     * stack and makes the X behave naturally.
     */
    setPaused(true);

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(main)/feeds");
    }
  }, [currentIndex, stories.length]);

  /*
   * --------------------------------------------------
   * PREVIOUS STORY
   * --------------------------------------------------
   */

  const handlePreviousStory = useCallback(() => {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;

      setCurrentIndex(previousIndex);

      progressRef.current = 0;
      setProgress(0);

      storyStartedAtRef.current = Date.now();

      storyFinishedRef.current = false;

      setReactionModalVisible(false);

      setMoreModalVisible(false);

      setCommentInputVisible(false);

      setComment("");

      return;
    }

    resetStoryTimer();
  }, [currentIndex, resetStoryTimer]);

  /*
   * --------------------------------------------------
   * STORY TIMER
   * --------------------------------------------------
   *
   * IMPORTANT:
   * The timer does not start until
   * the story media is ready.
   */

  useEffect(() => {
    if (paused) {
      return;
    }

    if (!mediaReady) {
      return;
    }

    storyStartedAtRef.current =
      Date.now() - progressRef.current * STORY_DURATION;

    storyFinishedRef.current = false;

    const interval = setInterval(() => {
      const elapsed = Date.now() - storyStartedAtRef.current;

      const nextProgress = Math.min(elapsed / STORY_DURATION, 1);

      progressRef.current = nextProgress;

      setProgress(nextProgress);

      if (nextProgress >= 1 && !storyFinishedRef.current) {
        clearInterval(interval);

        handleNextStory();
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [paused, currentIndex, mediaReady, handleNextStory]);

  /*
   * --------------------------------------------------
   * CLOSE VIEWER
   * --------------------------------------------------
   */

  const handleClose = useCallback(() => {
    /*
     * Stop all story activity first.
     */
    setPaused(true);

    setReactionModalVisible(false);

    setMoreModalVisible(false);

    setCommentInputVisible(false);

    /*
     * The viewer was opened with router.push(),
     * therefore router.back() is the correct way
     * to close it.
     */
    if (router.canGoBack()) {
      router.back();
      return;
    }

    /*
     * Fallback in case the screen
     * was opened directly.
     */
    router.replace("/(main)/feeds");
  }, []);

  /*
   * --------------------------------------------------
   * ADD STORY
   *
   * Opens the story creator when the user
   * is viewing their own stories.
   * --------------------------------------------------
   */

  const isOwnStory = Boolean(
    currentUserId &&
      String(story?.userId ?? story?.id) === String(currentUserId),
  );

  const handleAddStory = useCallback(() => {
    router.push("/(main)/feeds/story/create");
  }, []);

  /*
   * --------------------------------------------------
   * TAP NEXT
   * --------------------------------------------------
   */

  const handleTapNext = useCallback(() => {
    if (reactionModalVisible || moreModalVisible || commentInputVisible) {
      return;
    }

    handleNextStory();
  }, [
    reactionModalVisible,
    moreModalVisible,
    commentInputVisible,
    handleNextStory,
  ]);

  /*
   * --------------------------------------------------
   * TAP PREVIOUS
   * --------------------------------------------------
   */

  const handleTapPrevious = useCallback(() => {
    if (reactionModalVisible || moreModalVisible || commentInputVisible) {
      return;
    }

    handlePreviousStory();
  }, [
    reactionModalVisible,
    moreModalVisible,
    commentInputVisible,
    handlePreviousStory,
  ]);

  /*
   * --------------------------------------------------
   * REACTIONS
   * --------------------------------------------------
   */

  const openReactions = useCallback(() => {
    setMoreModalVisible(false);

    setCommentInputVisible(false);

    setPaused(true);

    setReactionModalVisible(true);

    reactionScale.setValue(0.72);

    reactionOpacity.setValue(0);

    reactionTranslateY.setValue(18);

    Animated.parallel([
      Animated.spring(reactionScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),

      Animated.timing(reactionOpacity, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),

      Animated.spring(reactionTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [reactionScale, reactionOpacity, reactionTranslateY]);

  const closeReactions = useCallback(() => {
    Animated.parallel([
      Animated.timing(reactionScale, {
        toValue: 0.75,
        duration: 90,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),

      Animated.timing(reactionOpacity, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),

      Animated.timing(reactionTranslateY, {
        toValue: 10,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setReactionModalVisible(false);

      setPaused(false);
    });
  }, [reactionScale, reactionOpacity, reactionTranslateY]);

  /*
   * --------------------------------------------------
   * SELECT REACTION
   * --------------------------------------------------
   */

  const handleReaction = useCallback(
    (reaction) => {
      setSelectedReaction(reaction);

      setReactionModalVisible(false);

      setPaused(true);

      reactionFloatScale.setValue(0.72);

      reactionFloatOpacity.setValue(0);

      reactionFloatTranslateY.setValue(30);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(reactionFloatScale, {
            toValue: 1.02,
            duration: 150,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),

          Animated.timing(reactionFloatScale, {
            toValue: 0.92,
            duration: 750,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(reactionFloatOpacity, {
            toValue: 1,
            duration: 80,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),

          Animated.timing(reactionFloatOpacity, {
            toValue: 0,
            duration: 820,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),

        Animated.timing(reactionFloatTranslateY, {
          toValue: -170,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPaused(false);
      });
    },
    [reactionFloatScale, reactionFloatOpacity, reactionFloatTranslateY],
  );

  /*
   * --------------------------------------------------
   * COMMENTS
   * --------------------------------------------------
   */

  const openComments = useCallback(() => {
    setReactionModalVisible(false);

    setMoreModalVisible(false);

    setPaused(true);

    setCommentInputVisible(true);
  }, []);

  const closeComments = useCallback(() => {
    setCommentInputVisible(false);

    setComment("");

    setPaused(false);
  }, []);

  const handleSendComment = useCallback(() => {
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      return;
    }

    /*
     * Connect comment API here.
     */

    setComment("");

    setCommentInputVisible(false);

    setPaused(false);
  }, [comment]);

  /*
   * --------------------------------------------------
   * MORE MENU
   * --------------------------------------------------
   */

  const openMore = useCallback(() => {
    setReactionModalVisible(false);

    setCommentInputVisible(false);

    setPaused(true);

    setMoreModalVisible(true);

    moreScale.setValue(0.92);

    moreOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(moreScale, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(moreOpacity, {
        toValue: 1,
        duration: 130,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [moreScale, moreOpacity]);

  const closeMore = useCallback(() => {
    Animated.parallel([
      Animated.timing(moreScale, {
        toValue: 0.94,
        duration: 100,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),

      Animated.timing(moreOpacity, {
        toValue: 0,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMoreModalVisible(false);

      setPaused(false);
    });
  }, [moreScale, moreOpacity]);

  /*
   * --------------------------------------------------
   * MORE ACTIONS
   * --------------------------------------------------
   */

  const handleDownload = useCallback(() => {
    /*
     * Connect story download logic here.
     */

    closeMore();
  }, [closeMore]);

  const handleShare = useCallback(() => {
    /*
     * Connect native share/API here.
     */

    closeMore();
  }, [closeMore]);

  const handleHide = useCallback(() => {
    /*
     * Connect hide story API here.
     */

    closeMore();
  }, [closeMore]);

  const handleReport = useCallback(() => {
    /*
     * Connect report flow here.
     */

    closeMore();
  }, [closeMore]);

  const handleBlock = useCallback(() => {
    /*
     * Connect block user API here.
     */

    closeMore();
  }, [closeMore]);

  /*
   * --------------------------------------------------
   * MEDIA LOAD HANDLERS
   * --------------------------------------------------
   */

  const handleMediaLoadStart = useCallback(() => {
    setMediaLoading(true);
    setMediaError(false);
    setMediaReady(false);
  }, []);

  const handleMediaLoad = useCallback(() => {
    console.log("Story media loaded:", story?.uri);

    setMediaLoading(false);
    setMediaError(false);
    setMediaReady(true);
  }, [story?.uri]);

  const handleMediaError = useCallback(
    (error) => {
      console.warn("Story media failed to load:", {
        storyId: story?.id,
        uri: story?.uri,
        error: error?.nativeEvent,
      });

      /*
       * Stop the infinite spinner.
       */
      setMediaLoading(false);

      setMediaError(true);

      /*
       * Mark as ready so a broken story
       * can automatically move on instead
       * of trapping the viewer.
       */
      setMediaReady(true);
    },
    [story?.id, story?.uri],
  );

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <View
      style={[
        styles.container,
        isTextStory && {
          backgroundColor: story.backgroundColor || "#000000",
        },
      ]}
    >
      {/* -------------------------------------------- */}
      {/* STORY CONTENT */}
      {/* -------------------------------------------- */}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.storyTransition,
          {
            opacity: transitionOpacity,

            transform: [
              {
                translateX: transitionTranslateX,
              },
            ],
          },
        ]}
      >
        {isTextStory ? (
          <View style={styles.textStory}>
            <Text style={styles.storyText}>{story.text}</Text>
          </View>
        ) : story.uri ? (
          <>
            <Image
              source={{
                uri: story.uri,
              }}
              style={styles.media}
              resizeMode="cover"
              onLoadStart={handleMediaLoadStart}
              onLoad={handleMediaLoad}
              onError={handleMediaError}
            />

            {/* IMAGE LOADING */}

            {mediaLoading ? (
              <View style={styles.mediaLoadingOverlay} pointerEvents="none">
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            ) : null}

            {/* IMAGE ERROR */}

            {mediaError ? (
              <View style={styles.mediaErrorOverlay} pointerEvents="none">
                <View style={styles.mediaErrorIcon}>
                  <Ionicons name="image-outline" size={32} color="#FFFFFF" />
                </View>

                <Text style={styles.mediaErrorTitle}>Story unavailable</Text>

                <Text style={styles.mediaErrorText}>
                  This story could not be loaded.
                </Text>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyStory}>
            <View style={styles.mediaErrorIcon}>
              <Ionicons name="image-outline" size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.mediaErrorTitle}>Story unavailable</Text>

            <Text style={styles.mediaErrorText}>
              No media was provided for this story.
            </Text>
          </View>
        )}
      </Animated.View>

      {/* -------------------------------------------- */}
      {/* OVERLAY */}
      {/* -------------------------------------------- */}

      <SafeAreaView
        style={styles.overlay}
        edges={["top", "bottom"]}
        pointerEvents="box-none"
      >
        {/* ---------------------------------------- */}
        {/* PROGRESS */}
        {/* ---------------------------------------- */}

        <View style={styles.progressContainer}>
          <View style={styles.progressSegments}>
            {activeGroup.map((item, index) => {
              const isPrevious = index < groupStoryIndex;

              const isCurrent = index === groupStoryIndex;

              const segmentProgress = isPrevious ? 1 : isCurrent ? progress : 0;

              return (
                <View
                  key={item.id || index}
                  style={[
                    styles.progressTrack,
                    index > 0 && styles.progressTrackSpacing,
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${segmentProgress * 100}%`,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* ---------------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------------- */}

        <View style={styles.header} pointerEvents="box-none">
          <View style={styles.userInfo}>
            {story.avatar ? (
              <Image
                source={{
                  uri: story.avatar,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {story.username?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
            )}

            <View style={styles.userText}>
              <Text style={styles.username}>{story.username}</Text>

              <Text style={styles.time}>Just now</Text>
            </View>
          </View>

          {/* ------------------------------------ */}
          {/* CLOSE BUTTON */}
          {/* ------------------------------------ */}

          <Pressable
            onPress={handleClose}
            hitSlop={14}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Close Story"
          >
            <Ionicons name="close" size={29} color="#FFFFFF" />
          </Pressable>

          {/* ------------------------------------ */}
          {/* ADD STORY BUTTON (OWN STORIES) */}
          {/* ------------------------------------ */}

          {isOwnStory ? (
            <Pressable
              onPress={handleAddStory}
              hitSlop={14}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Add Story"
            >
              <Ionicons name="add" size={29} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>

        {/* ---------------------------------------- */}
        {/* TAP ZONES */}
        {/* ---------------------------------------- */}
        {/*
         * IMPORTANT:
         *
         * These zones intentionally do NOT cover
         * the header or bottom controls.
         *
         * Previously tapZones used absoluteFillObject,
         * which could intercept the X button.
         */}

        <View style={styles.tapZones} pointerEvents="box-none">
          <Pressable
            onPress={handleTapPrevious}
            onLongPress={() => setPaused(true)}
            style={styles.leftZone}
            accessibilityRole="button"
            accessibilityLabel="Previous Story"
          />

          <Pressable
            onPress={handleTapNext}
            onLongPress={() => setPaused(true)}
            style={styles.rightZone}
            accessibilityRole="button"
            accessibilityLabel="Next Story"
          />
        </View>

        {/* ---------------------------------------- */}
        {/* PAUSE INDICATOR */}
        {/* ---------------------------------------- */}

        {paused &&
        !commentInputVisible &&
        !reactionModalVisible &&
        !moreModalVisible ? (
          <View style={styles.pauseIndicator} pointerEvents="none">
            <Ionicons name="pause" size={28} color="#FFFFFF" />
          </View>
        ) : null}

        {/* ---------------------------------------- */}
        {/* FLOATING REACTION */}
        {/* ---------------------------------------- */}

        {selectedReaction ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.reactionFloat,
              {
                opacity: reactionFloatOpacity,

                transform: [
                  {
                    translateY: reactionFloatTranslateY,
                  },
                  {
                    scale: reactionFloatScale,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.reactionFloatEmoji}>
              {selectedReaction.emoji}
            </Text>
          </Animated.View>
        ) : null}

        {/* ---------------------------------------- */}
        {/* REACTION PICKER */}
        {/* ---------------------------------------- */}

        {reactionModalVisible ? (
          <Pressable
            style={styles.reactionDismissArea}
            onPress={closeReactions}
          >
            <Animated.View
              style={[
                styles.reactionPicker,
                {
                  opacity: reactionOpacity,

                  transform: [
                    {
                      scale: reactionScale,
                    },
                    {
                      translateY: reactionTranslateY,
                    },
                  ],
                },
              ]}
            >
              <Pressable
                style={styles.reactionPickerInner}
                onPress={(event) => event.stopPropagation()}
              >
                {REACTIONS.map((reaction) => {
                  const active = selectedReaction?.id === reaction.id;

                  return (
                    <Pressable
                      key={reaction.id}
                      onPress={() => handleReaction(reaction)}
                      style={({ pressed }) => [
                        styles.reactionButton,
                        active && styles.reactionButtonActive,
                        pressed && styles.reactionButtonPressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.reactionEmoji,
                          active && styles.reactionEmojiActive,
                        ]}
                      >
                        {reaction.emoji}
                      </Text>
                    </Pressable>
                  );
                })}
              </Pressable>
            </Animated.View>
          </Pressable>
        ) : null}

        {/* ---------------------------------------- */}
        {/* MORE MENU */}
        {/* ---------------------------------------- */}

        {moreModalVisible ? (
          <>
            <Pressable style={styles.moreDismissArea} onPress={closeMore} />

            <Animated.View
              style={[
                styles.moreMenu,
                {
                  opacity: moreOpacity,

                  transform: [
                    {
                      scale: moreScale,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.menuPointer} />

              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleDownload}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="download-outline" size={19} color="#111111" />
                </View>

                <Text style={styles.menuText}>Download</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleShare}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="share-outline" size={19} color="#111111" />
                </View>

                <Text style={styles.menuText}>Share</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleHide}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="eye-off-outline" size={19} color="#111111" />
                </View>

                <Text style={styles.menuText}>Hide</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleReport}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="flag-outline" size={19} color="#111111" />
                </View>

                <Text style={styles.menuText}>Report</Text>
              </Pressable>

              <View style={styles.menuDivider} />

              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={handleBlock}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="ban-outline" size={19} color="#D11A2A" />
                </View>

                <Text style={[styles.menuText, styles.menuDangerText]}>
                  Block
                </Text>
              </Pressable>
            </Animated.View>
          </>
        ) : null}

        {/* ---------------------------------------- */}
        {/* REPLY INPUT */}
        {/* ---------------------------------------- */}

        {commentInputVisible ? (
          <KeyboardAvoidingView
            style={styles.replyInputOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 0}
            pointerEvents="box-none"
          >
            <View style={styles.replyInputArea}>
              <Pressable
                onPress={closeComments}
                style={({ pressed }) => [
                  styles.replyCloseButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="close" size={21} color="#FFFFFF" />
              </Pressable>

              <View style={styles.replyInputWrapper}>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder={`Reply to ${story.username}...`}
                  placeholderTextColor="rgba(255,255,255,0.65)"
                  multiline
                  maxLength={500}
                  autoFocus
                  returnKeyType="send"
                  onSubmitEditing={handleSendComment}
                  style={styles.replyInput}
                />

                <Pressable
                  onPress={handleSendComment}
                  disabled={!comment.trim()}
                  style={({ pressed }) => [
                    styles.sendReplyButton,
                    !comment.trim() && styles.sendReplyDisabled,
                    pressed && comment.trim() && styles.pressed,
                  ]}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : null}

        {/* ---------------------------------------- */}
        {/* BOTTOM ACTIONS */}
        {/* ---------------------------------------- */}

        {!commentInputVisible ? (
          <View style={styles.bottomArea}>
            <Pressable
              style={({ pressed }) => [
                styles.replyButton,
                pressed && styles.pressed,
              ]}
              onPress={openComments}
              accessibilityRole="button"
              accessibilityLabel="Reply to Story"
            >
              <Ionicons name="chatbubble-outline" size={19} color="#FFFFFF" />

              <Text style={styles.replyText}>Reply</Text>
            </Pressable>

            <Pressable
              onPress={openReactions}
              style={({ pressed }) => [
                styles.actionButton,
                selectedReaction && styles.reactedButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="React to Story"
            >
              {selectedReaction ? (
                <Text style={styles.bottomReaction}>
                  {selectedReaction.emoji}
                </Text>
              ) : (
                <MaterialIcons
                  name="insert-emoticon"
                  size={23}
                  color="#FFFFFF"
                />
              )}
            </Pressable>

            <Pressable
              onPress={openMore}
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
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  /*
   * STORY
   */

  storyTransition: {
    ...StyleSheet.absoluteFillObject,
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
    paddingHorizontal: 30,
  },

  mediaLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  mediaErrorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 30,
  },

  mediaErrorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  mediaErrorTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  mediaErrorText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
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

  /*
   * OVERLAY
   */

  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  /*
   * PROGRESS
   */

  progressContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 5,
    zIndex: 40,
  },

  progressSegments: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  progressTrackSpacing: {
    marginLeft: 4,
  },

  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },

  /*
   * HEADER
   */

  header: {
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 100,
    elevation: 100,
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

  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#444444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
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
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 110,
    elevation: 110,
  },

  /*
   * TAP ZONES
   *
   * Notice:
   *
   * We DO NOT use absoluteFillObject.
   *
   * The zones start below the header
   * and end above the bottom controls.
   */

  tapZones: {
    position: "absolute",
    top: 95,
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    zIndex: 1,
  },

  leftZone: {
    width: "35%",
    height: "100%",
  },

  rightZone: {
    flex: 1,
    height: "100%",
  },

  /*
   * PAUSE
   */

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
    zIndex: 20,
  },

  /*
   * FLOATING REACTION
   */

  reactionFloat: {
    position: "absolute",
    left: width / 2 - 50,
    bottom: 88,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },

  reactionFloatEmoji: {
    fontSize: 68,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: {
      width: 0,
      height: 5,
    },
    textShadowRadius: 8,
  },

  /*
   * REACTION PICKER
   */

  reactionDismissArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 72,
  },

  reactionPicker: {
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.98)",
    paddingHorizontal: 8,
    paddingVertical: 8,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,

    elevation: 18,
  },

  reactionPickerInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  reactionButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  reactionButtonActive: {
    backgroundColor: "#F0F0F0",
  },

  reactionButtonPressed: {
    transform: [
      {
        scale: 0.7,
      },
    ],
  },

  reactionEmoji: {
    fontSize: 27,
  },

  reactionEmojiActive: {
    fontSize: 31,
  },

  /*
   * MORE MENU
   */

  moreDismissArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 210,
  },

  moreMenu: {
    position: "absolute",
    right: 14,
    bottom: 61,
    width: 178,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 5,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.24,
    shadowRadius: 16,

    elevation: 14,

    zIndex: 220,
  },

  menuPointer: {
    position: "absolute",
    right: 16,
    bottom: -6,
    width: 13,
    height: 13,
    backgroundColor: "#FFFFFF",

    transform: [
      {
        rotate: "45deg",
      },
    ],

    zIndex: -1,
  },

  menuItem: {
    height: 43,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 11,
    marginHorizontal: 4,
  },

  menuItemPressed: {
    backgroundColor: "#F4F4F5",
  },

  menuIcon: {
    width: 27,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  menuText: {
    flex: 1,
    color: "#111111",
    fontSize: 14,
    fontWeight: "500",
  },

  menuDangerText: {
    color: "#D11A2A",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 4,
    marginHorizontal: 10,
  },

  /*
   * REPLY
   */

  replyInputOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 300,
    justifyContent: "flex-end",
    paddingHorizontal: 14,
    paddingBottom: 28,
  },

  replyInputArea: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  replyCloseButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  replyInputWrapper: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "rgba(0,0,0,0.48)",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 17,
    paddingRight: 6,
  },

  replyInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 108,
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    paddingTop: 11,
    paddingBottom: 11,
    textAlignVertical: "center",
  },

  sendReplyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  sendReplyDisabled: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  /*
   * BOTTOM
   */

  bottomArea: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    zIndex: 150,
    elevation: 150,
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

  reactedButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  bottomReaction: {
    fontSize: 23,
  },

  pressed: {
    opacity: 0.65,

    transform: [
      {
        scale: 0.95,
      },
    ],
  },
});
