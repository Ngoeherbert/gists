import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEventListener, VideoView, useVideoPlayer } from "expo-video";

const TEXT_COLORS = ["#000000", "#1D1D1F", "#343434", "#4A4A4A", "#FFFFFF"];

const TEXT_ALIGNMENTS = ["left", "center", "right"];

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function StoryEditScreen() {
  const params = useLocalSearchParams();

  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const uri = Array.isArray(params.uri) ? params.uri[0] : params.uri;
  const initialText = Array.isArray(params.text) ? params.text[0] : params.text;
  const initialBackground = Array.isArray(params.backgroundColor)
    ? params.backgroundColor[0]
    : params.backgroundColor;

  const isCreateTab = params.fromCreate === "true";
  const backRoute = isCreateTab
    ? "/(main)/create"
    : "/(main)/feeds/story/create";

  const isTextStory = type === "text";

  const [storyText, setStoryText] = useState(initialText || "");
  const [backgroundColor, setBackgroundColor] = useState(
    initialBackground || TEXT_COLORS[0],
  );
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textAlignment, setTextAlignment] = useState("center");
  const [showTools, setShowTools] = useState(false);

  // Text overlay state (for photo/video stories)
  const [overlayText, setOverlayText] = useState("");
  const [overlayTextColor, setOverlayTextColor] = useState("#FFFFFF");
  const [overlayTextAlignment, setOverlayTextAlignment] = useState("center");
  const [overlayTextBackground, setOverlayTextBackground] =
    useState("transparent");
  const [showOverlayTextInput, setShowOverlayTextInput] = useState(false);
  const overlayTextInputRef = useRef(null);

  // Overlay text position and scale (for drag/resize)
  const [overlayTextPosition, setOverlayTextPosition] = useState({
    x: 0,
    y: 0,
  });
  const [overlayTextScale, setOverlayTextScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Refs so the PanResponder always sees the latest values without re-creating
  const positionRef = useRef(overlayTextPosition);
  const scaleRef = useRef(overlayTextScale);
  const canvasSizeRef = useRef(canvasSize);

  positionRef.current = overlayTextPosition;
  scaleRef.current = overlayTextScale;
  canvasSizeRef.current = canvasSize;

  // Keep the quote inside the visible canvas (with some padding)
  const clampPosition = (x, y) => {
    const { width, height } = canvasSizeRef.current;
    const textHalf = (width * 0.8 * scaleRef.current) / 2 || 40;
    const textHalfHeight = 60 * scaleRef.current || 30;
    const pad = 0;

    if (!width || !height) return { x, y };

    return {
      x: Math.max(
        -(width / 2 - textHalf + pad),
        Math.min(x, width / 2 - textHalf + pad),
      ),
      y: Math.max(
        -(height / 2 - textHalfHeight + pad),
        Math.min(y, height / 2 - textHalfHeight + pad),
      ),
    };
  };

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const OVERLAY_TEXT_COLORS = [
    "#FFFFFF",
    "#000000",
    "#FF6B6B",
    "#4ECDC4",
    "#FFE66D",
    "#95E1D3",
    "#F38181",
    "#AA96DA",
    "#FCBAD3",
    "#A8D8EA",
  ];

  const OVERLAY_TEXT_BACKGROUNDS = [
    "transparent",
    "rgba(0,0,0,0.6)",
    "rgba(255,255,255,0.8)",
    "rgba(255,107,107,0.8)",
    "rgba(78,205,196,0.8)",
  ];

  const isLightBackground = backgroundColor === "#FFFFFF";

  const effectiveTextColor = isTextStory
    ? isLightBackground
      ? "#000000"
      : "#FFFFFF"
    : textColor;

  const videoPlayer = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
  });

  useEventListener(videoPlayer, "sourceLoad", () => {
    const duration = Number(videoPlayer.duration || 0);

    if (Number.isFinite(duration) && duration > 0) {
      setVideoDuration(duration);
      setTrimEnd(duration);
    }
  });

  const canContinue = useMemo(() => {
    if (isTextStory) {
      return Boolean(storyText.trim());
    }

    return Boolean(uri);
  }, [isTextStory, storyText, uri]);

  // PanResponder for dragging the quote with 1 finger and pinching
  // (2 fingers) to resize it. Attached to the text itself, 1:1 movement,
  // clamped so it can never run off the screen.
  const gestureStateRef = useRef({
    dragging: false,
    pinching: false,
    start: { x: 0, y: 0 },
    startScale: 1,
    startPinchDistance: 0,
    moved: false,
  });

  const pinchDistance = (touches) => {
    if (!touches || touches.length < 2) return 0;
    const [a, b] = touches;
    return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const touches = event.nativeEvent.touches;
        gestureStateRef.current = {
          dragging: touches.length === 1,
          pinching: touches.length >= 2,
          start: { ...positionRef.current },
          startScale: scaleRef.current,
          startPinchDistance: pinchDistance(touches),
          moved: false,
        };
      },
      onPanResponderMove: (event, gestureState) => {
        const touches = event.nativeEvent.touches;
        const g = gestureStateRef.current;

        // Two fingers -> pinch to resize
        if (touches.length >= 2) {
          if (!g.pinching) {
            g.pinching = true;
            g.dragging = false;
            g.startScale = scaleRef.current;
            g.startPinchDistance = pinchDistance(touches);
            return;
          }
          const dist = pinchDistance(touches);
          if (dist > 0 && g.startPinchDistance > 0) {
            const ratio = dist / g.startPinchDistance;
            const nextScale = Math.min(3, Math.max(0.5, g.startScale * ratio));
            setOverlayTextScale(nextScale);
          }
          return;
        }

        // One finger -> drag
        if (!g.dragging) {
          g.dragging = true;
          g.pinching = false;
          g.start = { ...positionRef.current };
          return;
        }

        if (Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3) {
          g.moved = true;
        }

        const next = clampPosition(
          g.start.x + gestureState.dx,
          g.start.y + gestureState.dy,
        );
        setOverlayTextPosition(next);
      },
      onPanResponderRelease: (event, gestureState) => {
        const g = gestureStateRef.current;
        // Simple tap (no drag, no pinch) -> cycle the text size
        if (!g.moved && !g.pinching && event.nativeEvent.touches.length === 0) {
          cycleOverlayTextScaleRef.current();
        }
      },
      onPanResponderTerminate: () => {},
    }),
  ).current;

  const SCALE_OPTIONS = [1, 1.25, 1.5, 0.85];

  const cycleOverlayTextScaleRef = useRef(() => {});

  const cycleOverlayTextScale = () => {
    const currentIndex = SCALE_OPTIONS.indexOf(overlayTextScale);
    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % SCALE_OPTIONS.length : 0;
    setOverlayTextScale(SCALE_OPTIONS[nextIndex]);
  };

  cycleOverlayTextScaleRef.current = cycleOverlayTextScale;

  const handleBack = () => {
    Keyboard.dismiss();

    router.replace({
      pathname: backRoute,
    });
  };

  const handleContinue = () => {
    Keyboard.dismiss();

    if (!canContinue) {
      Alert.alert(
        "Story is empty",
        "Add something to your Story before continuing.",
      );
      return;
    }

    const isVideo = type === "video" && Boolean(uri);

    const payload = {
      type: type || "image",
      uri: uri || "",
      text: storyText.trim(),
      backgroundColor,
      textColor: effectiveTextColor,
      textAlignment,
      // Overlay text (for photo/video stories)
      overlayText: overlayText.trim(),
      overlayTextColor,
      overlayTextAlignment,
      overlayTextBackground,
      // Must be a JSON string: route params are serialized as strings,
      // and raw objects would be lost ("[object Object]").
      overlayTextPosition: JSON.stringify(overlayTextPosition),
      overlayTextScale,
      // Timestamp
      createdAt: Date.now(),
      userId: "user-001",
      username: "herbert237",
      avatar: "https://i.pravatar.cc/150?img=12",
    };

    if (isVideo) {
      payload.trimStart = trimStart;
      payload.trimEnd = trimEnd;
      payload.trimDuration = Math.max(0, trimEnd - trimStart);
    }

    router.push({
      pathname: "/(main)/feeds/story/settings",
      params: payload,
    });
  };

  const cycleBackground = () => {
    const currentIndex = TEXT_COLORS.indexOf(backgroundColor);

    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % TEXT_COLORS.length : 0;

    setBackgroundColor(TEXT_COLORS[nextIndex]);
  };

  const cycleTextColor = () => {
    const currentIndex = TEXT_COLORS.indexOf(textColor);

    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % TEXT_COLORS.length : 0;

    setTextColor(TEXT_COLORS[nextIndex]);
  };

  const cycleAlignment = () => {
    const currentIndex = TEXT_ALIGNMENTS.indexOf(textAlignment);

    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % TEXT_ALIGNMENTS.length : 0;

    setTextAlignment(TEXT_ALIGNMENTS[nextIndex]);
  };

  const cycleOverlayTextColor = () => {
    const currentIndex = OVERLAY_TEXT_COLORS.indexOf(overlayTextColor);
    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % OVERLAY_TEXT_COLORS.length : 0;
    setOverlayTextColor(OVERLAY_TEXT_COLORS[nextIndex]);
  };

  const cycleOverlayTextAlignment = () => {
    const currentIndex = TEXT_ALIGNMENTS.indexOf(overlayTextAlignment);
    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % TEXT_ALIGNMENTS.length : 0;
    setOverlayTextAlignment(TEXT_ALIGNMENTS[nextIndex]);
  };

  const cycleOverlayTextBackground = () => {
    const currentIndex = OVERLAY_TEXT_BACKGROUNDS.indexOf(
      overlayTextBackground,
    );
    const nextIndex =
      currentIndex >= 0
        ? (currentIndex + 1) % OVERLAY_TEXT_BACKGROUNDS.length
        : 0;
    setOverlayTextBackground(OVERLAY_TEXT_BACKGROUNDS[nextIndex]);
  };

  const adjustTrimStart = (delta) => {
    setTrimStart((current) => {
      const next = Math.max(0, Math.min(current + delta, trimEnd - 1));

      return Number(next.toFixed(2));
    });
  };

  const adjustTrimEnd = (delta) => {
    setTrimEnd((current) => {
      const next = Math.max(
        trimStart + 1,
        Math.min(current + delta, videoDuration),
      );

      return Number(next.toFixed(2));
    });
  };

  const handleSticker = () => {
    Alert.alert("Stickers", "Stickers will be available here.");
  };

  const handleMusic = () => {
    Alert.alert("Music", "Music selection will be available here.");
  };

  const handleDraw = () => {
    Alert.alert("Draw", "Drawing tools will be available here.");
  };

  const handleTextOverlay = () => {
    setShowOverlayTextInput(true);
    setShowTools(false);
    // Focus the text input after a short delay
    setTimeout(() => {
      overlayTextInputRef.current?.focus();
    }, 100);
  };

  const handleMore = () => {
    setShowTools((current) => !current);
  };

  if (!isTextStory && !uri) {
    return (
      <View style={styles.errorScreen}>
        <SafeAreaView style={styles.errorSafeArea} edges={["top", "bottom"]}>
          <View style={styles.errorContent}>
            <View style={styles.errorIcon}>
              <Ionicons name="image-outline" size={36} color="#FFFFFF" />
            </View>

            <Text style={styles.errorTitle}>Nothing to edit</Text>

            <Text style={styles.errorText}>
              We could not find the Story media you selected.
            </Text>

            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                styles.errorButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.errorButtonText}>Go back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* =====================================================
          STORY CANVAS
      ===================================================== */}

      {isTextStory ? (
        <View
          style={[
            styles.textStoryCanvas,
            {
              backgroundColor,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              Keyboard.dismiss();
            }}
          />

          <TextInput
            value={storyText}
            onChangeText={setStoryText}
            multiline
            maxLength={500}
            textAlign={textAlignment}
            style={[
              styles.storyTextInput,
              {
                color: effectiveTextColor,
              },
            ]}
            placeholder="Type a Story..."
            placeholderTextColor={isLightBackground ? "#777777" : "#AAAAAA"}
          />
        </View>
      ) : type === "video" && uri ? (
        <View
          style={styles.mediaCanvas}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCanvasSize({ width, height });
          }}
        >
          <VideoView
            player={videoPlayer}
            style={styles.media}
            contentFit="cover"
          />

          {overlayText.trim() && (
            <View
              style={[
                styles.overlayTextContainer,
                {
                  transform: [
                    { translateX: overlayTextPosition.x },
                    { translateY: overlayTextPosition.y },
                    { scale: overlayTextScale },
                  ],
                },
              ]}
              pointerEvents="box-none"
            >
              <View {...panResponder.panHandlers}>
                <Text
                  style={[
                    styles.overlayText,
                    {
                      color: overlayTextColor,
                      textAlign: overlayTextAlignment,
                      backgroundColor: overlayTextBackground,
                    },
                  ]}
                >
                  {overlayText}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.trimBar}>
            <View style={styles.trimInfo}>
              <Text style={styles.trimLabel}>Trim</Text>
              <Text style={styles.trimTime}>
                {formatTime(trimStart)} - {formatTime(trimEnd)}
              </Text>
              <Text style={styles.trimDuration}>
                Duration: {formatTime(Math.max(0, trimEnd - trimStart))}
              </Text>
            </View>

            <View style={styles.trimControls}>
              <Pressable
                onPress={() => adjustTrimStart(-1)}
                style={styles.trimButton}
              >
                <Ionicons name="remove-outline" size={20} color="#FFFFFF" />
              </Pressable>

              <Text style={styles.trimButtonText}>Start</Text>

              <Pressable
                onPress={() => adjustTrimStart(1)}
                style={styles.trimButton}
              >
                <Ionicons name="add-outline" size={20} color="#FFFFFF" />
              </Pressable>

              <View style={styles.trimSpacer} />

              <Pressable
                onPress={() => adjustTrimEnd(-1)}
                style={styles.trimButton}
              >
                <Ionicons name="remove-outline" size={20} color="#FFFFFF" />
              </Pressable>

              <Text style={styles.trimButtonText}>End</Text>

              <Pressable
                onPress={() => adjustTrimEnd(1)}
                style={styles.trimButton}
              >
                <Ionicons name="add-outline" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={styles.mediaCanvas}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCanvasSize({ width, height });
          }}
        >
          <Image source={{ uri }} style={styles.media} resizeMode="cover" />

          {overlayText.trim() && (
            <View
              style={[
                styles.overlayTextContainer,
                {
                  transform: [
                    { translateX: overlayTextPosition.x },
                    { translateY: overlayTextPosition.y },
                    { scale: overlayTextScale },
                  ],
                },
              ]}
              pointerEvents="box-none"
            >
              <View {...panResponder.panHandlers}>
                <Text
                  style={[
                    styles.overlayText,
                    {
                      color: overlayTextColor,
                      textAlign: overlayTextAlignment,
                      backgroundColor: overlayTextBackground,
                    },
                  ]}
                >
                  {overlayText}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* =====================================================
          SAFE AREA + CONTROLS
      ===================================================== */}

      <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
        {/* ===================================================
            HEADER
        =================================================== */}

        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.headerTitle}>Edit Story</Text>

          <Pressable
            onPress={handleContinue}
            disabled={!canContinue}
            style={({ pressed }) => [
              styles.publishButton,
              !canContinue && styles.publishButtonDisabled,
              pressed && canContinue && styles.publishButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.publishButtonText,
                !canContinue && styles.publishButtonTextDisabled,
              ]}
            >
              Next
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color={canContinue ? "#000000" : "#777777"}
            />
          </Pressable>
        </View>

        {/* ===================================================
            TEXT EDITING TOOLS
        =================================================== */}

        {isTextStory ? (
          <View style={styles.textTools}>
            <Pressable
              onPress={cycleBackground}
              style={({ pressed }) => [
                styles.toolButton,
                pressed && styles.toolButtonPressed,
              ]}
            >
              <View
                style={[
                  styles.toolColorDot,
                  {
                    backgroundColor,
                  },
                ]}
              />

              <Text style={styles.toolLabel}>Background</Text>
            </Pressable>

            <Pressable
              onPress={cycleTextColor}
              style={({ pressed }) => [
                styles.toolButton,
                pressed && styles.toolButtonPressed,
              ]}
            >
              <Ionicons
                name="color-palette-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.toolLabel}>Text</Text>
            </Pressable>

            <Pressable
              onPress={cycleAlignment}
              style={({ pressed }) => [
                styles.toolButton,
                pressed && styles.toolButtonPressed,
              ]}
            >
              <Ionicons name="menu-outline" size={21} color="#FFFFFF" />

              <Text style={styles.toolLabel}>Align</Text>
            </Pressable>
          </View>
        ) : null}

        {/* ===================================================
            MEDIA EDITING TOOLS
        =================================================== */}

        {!isTextStory ? (
          <View style={styles.mediaTools}>
            <Pressable
              onPress={handleSticker}
              style={({ pressed }) => [
                styles.toolButton,
                pressed && styles.toolButtonPressed,
              ]}
            >
              <Ionicons name="happy-outline" size={22} color="#FFFFFF" />

              <Text style={styles.toolLabel}>Sticker</Text>
            </Pressable>

            <Pressable
              onPress={handleMusic}
              style={({ pressed }) => [
                styles.toolButton,
                pressed && styles.toolButtonPressed,
              ]}
            >
              <Ionicons
                name="musical-notes-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.toolLabel}>Music</Text>
            </Pressable>

            <Pressable
              onPress={handleDraw}
              style={({ pressed }) => [
                styles.toolButton,
                pressed && styles.toolButtonPressed,
              ]}
            >
              <Ionicons name="brush-outline" size={21} color="#FFFFFF" />

              <Text style={styles.toolLabel}>Draw</Text>
            </Pressable>

            <Pressable
              onPress={handleTextOverlay}
              style={({ pressed }) => [
                styles.toolButton,
                pressed && styles.toolButtonPressed,
              ]}
            >
              <Ionicons name="text-outline" size={21} color="#FFFFFF" />

              <Text style={styles.toolLabel}>Text</Text>
            </Pressable>

            <Pressable
              onPress={handleMore}
              style={({ pressed }) => [
                styles.toolButton,
                pressed && styles.toolButtonPressed,
              ]}
            >
              <Ionicons
                name={showTools ? "chevron-up-outline" : "ellipsis-horizontal"}
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.toolLabel}>More</Text>
            </Pressable>
          </View>
        ) : null}

        {/* ===================================================
            MORE TOOLS
        =================================================== */}

        {showTools && !isTextStory ? (
          <View style={styles.moreTools}>
            <Pressable
              onPress={() =>
                Alert.alert("Crop", "Crop tools will be available here.")
              }
              style={styles.moreToolItem}
            >
              <Ionicons name="crop-outline" size={21} color="#FFFFFF" />

              <Text style={styles.moreToolText}>Crop</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Alert.alert("Filter", "Story filters will be available here.")
              }
              style={styles.moreToolItem}
            >
              <Ionicons name="color-filter-outline" size={21} color="#FFFFFF" />

              <Text style={styles.moreToolText}>Filter</Text>
            </Pressable>
          </View>
        ) : null}
      </SafeAreaView>

      {/* ===================================================
          OVERLAY TEXT INPUT
      =================================================== */}

      {showOverlayTextInput && (
        <View style={styles.overlayTextInputContainer}>
          <View style={styles.overlayTextInputWrapper}>
            <Pressable
              onPress={() => {
                setShowOverlayTextInput(false);
                Keyboard.dismiss();
              }}
              style={styles.overlayTextInputClose}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>

            <TextInput
              ref={overlayTextInputRef}
              value={overlayText}
              onChangeText={setOverlayText}
              multiline
              maxLength={500}
              textAlign={overlayTextAlignment}
              autoFocus
              style={[styles.overlayTextInput, { color: overlayTextColor }]}
              placeholder="Add text..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              returnKeyType="done"
              onSubmitEditing={() => {
                setShowOverlayTextInput(false);
                Keyboard.dismiss();
              }}
            />

            <View style={styles.overlayTextInputTools}>
              <Pressable
                onPress={cycleOverlayTextColor}
                style={styles.overlayTextToolButton}
              >
                <View
                  style={[
                    styles.overlayTextToolColorDot,
                    { backgroundColor: overlayTextColor },
                  ]}
                />
              </Pressable>

              <Pressable
                onPress={cycleOverlayTextAlignment}
                style={styles.overlayTextToolButton}
              >
                <Ionicons name="menu-outline" size={20} color="#FFFFFF" />
              </Pressable>

              <Pressable
                onPress={cycleOverlayTextBackground}
                style={styles.overlayTextToolButton}
              >
                <Ionicons
                  name={
                    overlayTextBackground === "transparent"
                      ? "square-outline"
                      : "square"
                  }
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowOverlayTextInput(false);
                  Keyboard.dismiss();
                }}
                style={styles.overlayTextToolButtonDone}
              >
                <Text style={styles.overlayTextToolButtonDoneText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  overlay: {
    flex: 1,
  },

  /* =======================================================
     STORY CANVAS
  ======================================================= */

  mediaCanvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  textStoryCanvas: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  storyTextInput: {
    width: "100%",
    maxHeight: 360,
    fontSize: 34,
    lineHeight: 43,
    fontWeight: "800",
    textAlignVertical: "center",
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerButtonPressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  publishButton: {
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },

  publishButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  publishButtonPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  publishButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "800",
  },

  publishButtonTextDisabled: {
    color: "#777777",
  },

  /* =======================================================
     TOOLS
  ======================================================= */

  textTools: {
    position: "absolute",
    top: 100,
    right: 14,
    alignItems: "center",
    gap: 14,
  },

  mediaTools: {
    position: "absolute",
    top: 100,
    right: 14,
    alignItems: "center",
    gap: 14,
  },

  toolButton: {
    minWidth: 56,
    minHeight: 56,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.44)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  toolButtonPressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  toolColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginBottom: 2,
  },

  toolLabel: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  moreTools: {
    position: "absolute",
    top: 100,
    right: 82,
    padding: 8,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 4,
  },

  moreToolItem: {
    minWidth: 100,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  moreToolText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  trimBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
  },

  trimInfo: {
    alignItems: "center",
    marginBottom: 14,
  },

  trimLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  trimTime: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  trimDuration: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 2,
  },

  trimControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  trimButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  trimButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    minWidth: 40,
    textAlign: "center",
  },

  trimSpacer: {
    width: 18,
  },

  /* =======================================================
     OVERLAY TEXT (on photo/video)
   ======================================================= */

  overlayTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    // Let touches outside the quote pass through to the canvas below
    pointerEvents: "box-none",
  },

  overlayText: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    includeFontPadding: false,
  },

  /* =======================================================
     OVERLAY TEXT INPUT
  ======================================================= */

  overlayTextInputContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 100,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  overlayTextInputWrapper: {
    width: "100%",
    maxHeight: "70%",
  },

  overlayTextInputClose: {
    position: "absolute",
    top: -50,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 101,
  },

  overlayTextInput: {
    width: "100%",
    minHeight: 120,
    maxHeight: "60%",
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800",
    textAlignVertical: "top",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  overlayTextInputTools: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 4,
  },

  overlayTextToolButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  overlayTextToolColorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  overlayTextToolButtonDone: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  overlayTextToolButtonDoneText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "800",
  },

  /* =======================================================
     ERROR
  ======================================================= */

  errorScreen: {
    flex: 1,
    backgroundColor: "#000000",
  },

  errorSafeArea: {
    flex: 1,
  },

  errorContent: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  errorIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  errorText: {
    maxWidth: 330,
    color: "#999999",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  errorButton: {
    minWidth: 150,
    height: 50,
    paddingHorizontal: 22,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  errorButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
