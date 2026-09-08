import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const TEXT_COLORS = ["#000000", "#1D1D1F", "#343434", "#4A4A4A", "#FFFFFF"];

const TEXT_ALIGNMENTS = ["left", "center", "right"];

export default function StoryEditScreen() {
  const params = useLocalSearchParams();

  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const uri = Array.isArray(params.uri) ? params.uri[0] : params.uri;
  const initialText = Array.isArray(params.text) ? params.text[0] : params.text;
  const initialBackground = Array.isArray(params.backgroundColor)
    ? params.backgroundColor[0]
    : params.backgroundColor;

  const isTextStory = type === "text";

  const [storyText, setStoryText] = useState(initialText || "");
  const [backgroundColor, setBackgroundColor] = useState(
    initialBackground || TEXT_COLORS[0],
  );
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textAlignment, setTextAlignment] = useState("center");
  const [showTools, setShowTools] = useState(false);

  const isLightBackground = backgroundColor === "#FFFFFF";

  const effectiveTextColor = isTextStory
    ? isLightBackground
      ? "#000000"
      : "#FFFFFF"
    : textColor;

  const canContinue = useMemo(() => {
    if (isTextStory) {
      return Boolean(storyText.trim());
    }

    return Boolean(uri);
  }, [isTextStory, storyText, uri]);

  const handleBack = () => {
    Keyboard.dismiss();

    router.replace({
      pathname: "/(main)/feeds/story/create",
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

    router.push({
      pathname: "/(main)/feeds/story/settings",
      params: {
        type: type || "image",
        uri: uri || "",
        text: storyText.trim(),
        backgroundColor,
        textColor: effectiveTextColor,
        textAlignment,
        userId: "user-001",
        username: "herbert237",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
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

  const handleSticker = () => {
    Alert.alert("Stickers", "Stickers will be available here.");
  };

  const handleMusic = () => {
    Alert.alert("Music", "Music selection will be available here.");
  };

  const handleDraw = () => {
    Alert.alert("Draw", "Drawing tools will be available here.");
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
              We couldn't find the Story media you selected.
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
      ) : (
        <View style={styles.mediaCanvas}>
          <Image source={{ uri }} style={styles.media} resizeMode="cover" />
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

            <Pressable
              onPress={() =>
                Alert.alert("Text", "Text overlays will be available here.")
              }
              style={styles.moreToolItem}
            >
              <Ionicons name="text-outline" size={21} color="#FFFFFF" />

              <Text style={styles.moreToolText}>Text</Text>
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
