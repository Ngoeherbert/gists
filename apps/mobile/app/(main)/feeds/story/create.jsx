import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Platform,
  Keyboard,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const MODES = [
  {
    id: "photo",
    label: "Photo",
    icon: "camera-outline",
  },
  {
    id: "video",
    label: "Video",
    icon: "videocam-outline",
  },
  {
    id: "text",
    label: "Text",
    icon: "text-outline",
  },
];

const TEXT_COLORS = [
  "#000000",
  "#1D1D1F",
  "#343434",
  "#4A4A4A",
  "#FFFFFF",
];

export default function StoryCreateScreen() {
  const cameraRef = useRef(null);
  const textInputRef = useRef(null);

  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  const [mode, setMode] = useState("photo");
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");

  const [media, setMedia] = useState(null);
  const [text, setText] = useState("");
  const [textColorIndex, setTextColorIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!cameraPermission) {
      requestCameraPermission();
    }
  }, [cameraPermission, requestCameraPermission]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    textInputRef.current?.blur();
  };

  /*
   * Close Story creator completely.
   *
   * X always returns directly to Feeds.
   * It does not clear the preview and stay on this screen.
   */
  const handleClose = () => {
    dismissKeyboard();

    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    }

    router.replace("/(main)/feeds");
  };

  const toggleCamera = () => {
    if (isRecording) {
      return;
    }

    setFacing((current) =>
      current === "back" ? "front" : "back",
    );
  };

  const toggleFlash = () => {
    if (facing === "front") {
      Alert.alert(
        "Flash unavailable",
        "Flash is not available while using the front camera.",
      );
      return;
    }

    setFlash((current) =>
      current === "off" ? "on" : "off",
    );
  };

  const handleEffects = () => {
    Alert.alert(
      "Effects",
      "Story effects will be available here.",
    );
  };

  const handleTimer = () => {
    Alert.alert(
      "Timer",
      "Timer controls will be available here.",
    );
  };

  const switchMode = (nextMode) => {
    dismissKeyboard();

    if (nextMode === mode && !media) {
      return;
    }

    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    }

    setMedia(null);
    setMode(nextMode);

    if (nextMode !== "text") {
      setText("");
    }
  };

  const openGallery = async () => {
    dismissKeyboard();

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow photo and video access to choose media for your Story.",
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images", "videos"],
          allowsEditing: false,
          quality: 1,
        });

      if (
        result.canceled ||
        !result.assets?.length
      ) {
        return;
      }

      const asset = result.assets[0];

      setMedia({
        uri: asset.uri,
        type:
          asset.type === "video"
            ? "video"
            : "image",
        width: asset.width,
        height: asset.height,
        duration: asset.duration || null,
      });
    } catch (error) {
      console.error(
        "Story gallery error:",
        error,
      );

      Alert.alert(
        "Unable to open gallery",
        "Something went wrong while opening your gallery.",
      );
    }
  };

  const takePhoto = async () => {
    dismissKeyboard();

    if (
      !cameraRef.current ||
      isProcessing
    ) {
      return;
    }

    try {
      setIsProcessing(true);

      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 0.9,
        });

      if (!photo?.uri) {
        return;
      }

      setMedia({
        uri: photo.uri,
        type: "image",
        width: photo.width,
        height: photo.height,
      });
    } catch (error) {
      console.error(
        "Story photo error:",
        error,
      );

      Alert.alert(
        "Camera error",
        "Unable to capture the photo.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    dismissKeyboard();

    if (
      !cameraRef.current ||
      isRecording ||
      isProcessing
    ) {
      return;
    }

    try {
      setIsRecording(true);

      const video =
        await cameraRef.current.recordAsync({
          maxDuration: 60,
        });

      if (video?.uri) {
        setMedia({
          uri: video.uri,
          type: "video",
        });
      }
    } catch (error) {
      console.error(
        "Story video error:",
        error,
      );

      Alert.alert(
        "Camera error",
        "Unable to record the video.",
      );
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      !cameraRef.current ||
      !isRecording
    ) {
      return;
    }

    cameraRef.current.stopRecording();
  };

  const handleCapture = () => {
    dismissKeyboard();

    if (mode === "photo") {
      takePhoto();
      return;
    }

    if (mode === "video") {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const handleTextColor = () => {
    setTextColorIndex(
      (current) =>
        (current + 1) % TEXT_COLORS.length,
    );
  };

  const handleContinue = () => {
    dismissKeyboard();

    if (mode === "text") {
      if (!text.trim()) {
        Alert.alert(
          "Add some text",
          "Write something before continuing.",
        );
        return;
      }

      router.push({
        pathname:
          "/(main)/feeds/story/edit",
        params: {
          type: "text",
          text: text.trim(),
          backgroundColor:
            TEXT_COLORS[textColorIndex],
        },
      });

      return;
    }

    if (!media?.uri) {
      Alert.alert(
        "Nothing selected",
        "Take a photo, record a video, or choose something from your gallery.",
      );
      return;
    }

    router.push({
      pathname:
        "/(main)/feeds/story/edit",
      params: {
        type: media.type,
        uri: media.uri,
      },
    });
  };

  if (!cameraPermission) {
    return (
      <View style={styles.permissionScreen}>
        <ActivityIndicator
          size="small"
          color="#FFFFFF"
        />
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView
        style={styles.permissionScreen}
        edges={["top", "bottom"]}
      >
        <View style={styles.permissionContent}>
          <View style={styles.permissionIcon}>
            <Ionicons
              name="camera-outline"
              size={38}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.permissionTitle}>
            Camera access is needed
          </Text>

          <Text style={styles.permissionText}>
            Allow camera access to create
            photo and video Stories.
          </Text>

          <Pressable
            onPress={requestCameraPermission}
            style={({ pressed }) => [
              styles.permissionButton,
              pressed &&
                styles.buttonPressed,
            ]}
          >
            <Text
              style={
                styles.permissionButtonText
              }
            >
              Allow camera
            </Text>
          </Pressable>

          <Pressable
            onPress={openGallery}
            style={({ pressed }) => [
              styles.galleryFallbackButton,
              pressed &&
                styles.buttonPressed,
            ]}
          >
            <Ionicons
              name="images-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text
              style={styles.galleryFallbackText}
            >
              Choose from gallery
            </Text>
          </Pressable>

          <Pressable
            onPress={handleClose}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isCameraMode =
    mode === "photo" ||
    mode === "video";

  const isTextMode = mode === "text";

  const canContinue =
    mode === "text"
      ? Boolean(text.trim())
      : Boolean(media?.uri);

  return (
    <View style={styles.container}>
      {/* LIVE CAMERA */}
      {isCameraMode && !media ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash}
          mode={
            mode === "video"
              ? "video"
              : "picture"
          }
        />
      ) : null}

      {/* MEDIA PREVIEW */}
      {media ? (
        <View
          style={StyleSheet.absoluteFill}
        >
          <Image
            source={{
              uri: media.uri,
            }}
            style={styles.mediaPreview}
            resizeMode="cover"
          />
        </View>
      ) : null}

      {/* TEXT MODE */}
      {isTextMode ? (
        <View
          style={[
            styles.textCanvas,
            {
              backgroundColor:
                TEXT_COLORS[
                  textColorIndex
                ],
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissKeyboard}
          />

          <TextInput
            ref={textInputRef}
            value={text}
            onChangeText={setText}
            placeholder="Type a Story..."
            placeholderTextColor={
              textColorIndex ===
              TEXT_COLORS.length - 1
                ? "#777777"
                : "#AAAAAA"
            }
            multiline
            autoFocus
            textAlign="center"
            maxLength={500}
            style={[
              styles.textInput,
              textColorIndex ===
                TEXT_COLORS.length - 1 && {
                color: "#000000",
              },
            ]}
          />

          <View
            style={styles.textCharacterCount}
          >
            <Text
              style={[
                styles.textCharacterCountText,
                textColorIndex ===
                  TEXT_COLORS.length - 1 && {
                  color: "#555555",
                },
              ]}
            >
              {text.length}/500
            </Text>
          </View>
        </View>
      ) : null}

      <SafeAreaView
        style={styles.overlay}
        edges={["top", "bottom"]}
      >
        {/* HEADER */}
        <View style={styles.topBar}>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.topButton,
              pressed &&
                styles.topButtonPressed,
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close Story creator"
          >
            <Ionicons
              name="close"
              size={28}
              color="#FFFFFF"
            />
          </Pressable>

          <View style={styles.topRight}>
            {isTextMode ? (
              <Pressable
                onPress={handleTextColor}
                style={({ pressed }) => [
                  styles.colorButton,
                  pressed &&
                    styles.topButtonPressed,
                ]}
              >
                <View
                  style={[
                    styles.colorDot,
                    {
                      backgroundColor:
                        TEXT_COLORS[
                          textColorIndex
                        ],
                    },
                  ]}
                />

                <Ionicons
                  name="color-palette-outline"
                  size={21}
                  color="#FFFFFF"
                />
              </Pressable>
            ) : null}

            {canContinue ? (
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.headerNextButton,
                  pressed &&
                    styles.headerNextPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Next"
              >
                <Text
                  style={styles.headerNextText}
                >
                  Next
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color="#000000"
                />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* MODE SELECTOR */}
        {!media ? (
          <View style={styles.modeSelector}>
            {MODES.map((item) => {
              const active =
                item.id === mode;

              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    switchMode(item.id)
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.modeItem,
                    active &&
                      styles.modeItemActive,
                    pressed &&
                      styles.modeItemPressed,
                  ]}
                  hitSlop={4}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: active,
                  }}
                  accessibilityLabel={`Story ${item.label} mode`}
                >
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={
                      active
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.62)"
                    }
                  />

                  <Text
                    style={[
                      styles.modeText,
                      active &&
                        styles.modeTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {/* SIDE CONTROLS */}
        {isCameraMode && !media ? (
          <View
            style={styles.sideControls}
          >
            <Pressable
              style={({ pressed }) => [
                styles.sideButton,
                pressed &&
                  styles.sideButtonPressed,
              ]}
              onPress={toggleFlash}
            >
              <View
                style={[
                  styles.sideIcon,
                  flash === "on" &&
                    styles.sideIconActive,
                ]}
              >
                <Ionicons
                  name={
                    flash === "on"
                      ? "flash"
                      : "flash-off-outline"
                  }
                  size={22}
                  color="#FFFFFF"
                />
              </View>

              <Text
                style={styles.sideLabel}
              >
                Flash
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.sideButton,
                pressed &&
                  styles.sideButtonPressed,
              ]}
              onPress={toggleCamera}
            >
              <View style={styles.sideIcon}>
                <Ionicons
                  name="camera-reverse-outline"
                  size={23}
                  color="#FFFFFF"
                />
              </View>

              <Text
                style={styles.sideLabel}
              >
                Flip
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.sideButton,
                pressed &&
                  styles.sideButtonPressed,
              ]}
              onPress={handleEffects}
            >
              <View style={styles.sideIcon}>
                <Ionicons
                  name="sparkles-outline"
                  size={23}
                  color="#FFFFFF"
                />
              </View>

              <Text
                style={styles.sideLabel}
              >
                Effects
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.sideButton,
                pressed &&
                  styles.sideButtonPressed,
              ]}
              onPress={handleTimer}
            >
              <View style={styles.sideIcon}>
                <Ionicons
                  name="timer-outline"
                  size={23}
                  color="#FFFFFF"
                />
              </View>

              <Text
                style={styles.sideLabel}
              >
                Timer
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* CAMERA BOTTOM CONTROLS */}
        {isCameraMode && !media ? (
          <View
            style={styles.bottomControls}
          >
            <Pressable
              onPress={openGallery}
              style={({ pressed }) => [
                styles.galleryButton,
                pressed &&
                  styles.galleryButtonPressed,
              ]}
            >
              <View
                style={styles.galleryPreview}
              >
                <Ionicons
                  name="images-outline"
                  size={22}
                  color="#FFFFFF"
                />
              </View>

              <Text
                style={styles.bottomLabel}
              >
                Gallery
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCapture}
              onLongPress={
                mode === "video"
                  ? startRecording
                  : undefined
              }
              delayLongPress={250}
              style={[
                styles.captureButton,
                isRecording &&
                  styles.captureButtonRecording,
              ]}
              disabled={isProcessing}
            >
              <View
                style={[
                  styles.captureInner,
                  isRecording &&
                    styles.captureInnerRecording,
                ]}
              />
            </Pressable>

            <View
              style={styles.galleryButtonSpacer}
            />
          </View>
        ) : null}

        {/* PROCESSING */}
        {isProcessing ? (
          <View
            style={styles.processingOverlay}
          >
            <ActivityIndicator
              size="large"
              color="#FFFFFF"
            />
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

  mediaPreview: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  topBar: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === "android" ? 8 : 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor:
      "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },

  topButtonPressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  colorButton: {
    minWidth: 44,
    height: 40,
    paddingHorizontal: 9,
    borderRadius: 20,
    backgroundColor:
      "rgba(0,0,0,0.38)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  colorDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  headerNextButton: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  headerNextPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  headerNextText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "800",
  },

  modeSelector: {
    alignSelf: "center",
    height: 42,
    marginTop: 8,
    padding: 2,
    borderRadius: 22,
    backgroundColor:
      "rgba(0,0,0,0.52)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 20,
  },

  modeItem: {
    height: 36,
    minWidth: 72,
    paddingHorizontal: 9,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  modeItemActive: {
    backgroundColor:
      "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.35)",
  },

  modeItemPressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  modeText: {
    color:
      "rgba(255,255,255,0.62)",
    fontSize: 12,
    fontWeight: "700",
  },

  modeTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  sideControls: {
    position: "absolute",
    right: 14,
    top: 126,
    alignItems: "center",
    gap: 18,
    zIndex: 15,
  },

  sideButton: {
    width: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  sideButtonPressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  sideIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
  },

  sideIconActive: {
    backgroundColor:
      "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.45)",
  },

  sideLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
    textShadowColor:
      "rgba(0,0,0,0.7)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  bottomControls: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 54,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  galleryButton: {
    width: 64,
    alignItems: "center",
  },

  galleryButtonPressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  galleryPreview: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor:
      "rgba(0,0,0,0.48)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 5,
    textShadowColor:
      "rgba(0,0,0,0.6)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  galleryButtonSpacer: {
    width: 64,
  },

  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#FFFFFF",
    borderWidth: 5,
    borderColor:
      "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  captureInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#000000",
  },

  captureButtonRecording: {
    borderColor: "#FFFFFF",
  },

  captureInnerRecording: {
    width: 29,
    height: 29,
    borderRadius: 7,
    backgroundColor: "#000000",
    borderWidth: 0,
  },

  textCanvas: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  textInput: {
    width: "100%",
    maxHeight: 300,
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
    textAlign: "center",
    zIndex: 2,
  },

  textCharacterCount: {
    position: "absolute",
    bottom: 128,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor:
      "rgba(0,0,0,0.2)",
    zIndex: 3,
  },

  textCharacterCountText: {
    color: "#CCCCCC",
    fontSize: 11,
    fontWeight: "600",
  },

  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor:
      "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  permissionScreen: {
    flex: 1,
    backgroundColor: "#000000",
  },

  permissionContent: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  permissionIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  permissionTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
  },

  permissionText: {
    maxWidth: 330,
    color: "#999999",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 26,
  },

  permissionButton: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  permissionButtonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "800",
  },

  galleryFallbackButton: {
    marginTop: 14,
    width: "100%",
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#444444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  galleryFallbackText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  cancelButton: {
    marginTop: 18,
    padding: 10,
  },

  cancelText: {
    color: "#888888",
    fontSize: 14,
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
