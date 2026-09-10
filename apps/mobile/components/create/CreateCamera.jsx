import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const TEXT_COLORS = [
  "#FFFFFF",
  "#FFD600",
  "#FF6B00",
  "#FF004D",
  "#B026FF",
  "#00C3FF",
  "#00E676",
  "#1D1D1F",
  "#000000",
];

const LIGHT_TEXT_COLORS = new Set([
  "#FFFFFF",
  "#FFD600",
  "#FF6B00",
  "#00C3FF",
  "#00E676",
]);

const isLightTextColor = (index) => LIGHT_TEXT_COLORS.has(TEXT_COLORS[index]);

export default function CreateCamera({
  onClose,
  onContinue,
  closeLabel = "Close",
  modes = [
    { id: "photo", label: "Photo", icon: "camera-outline" },
    { id: "text", label: "Text", icon: "text-outline" },
  ],
}) {
  const cameraRef = useRef(null);
  const textInputRef = useRef(null);
  const textScrollRef = useRef(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [mode, setMode] = useState(modes[0]?.id || "photo");
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");

  const [text, setText] = useState("");
  const [textColorIndex, setTextColorIndex] = useState(0);
  const [colorModalVisible, setColorModalVisible] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const hasCameraModes = modes.some(
    (item) => item.id === "photo" || item.id === "video" || item.id === "text",
  );

  const cameraMode = hasCameraModes ? mode : "photo";

  useEffect(() => {
    if (!cameraPermission) {
      requestCameraPermission();
    }
  }, [cameraPermission, requestCameraPermission]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    textInputRef.current?.blur();
  };

  const toggleKeyboard = () => {
    if (textInputRef.current?.isFocused()) {
      dismissKeyboard();
    } else {
      textInputRef.current?.focus();
    }
  };

  const handleClose = () => {
    dismissKeyboard();

    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    }

    onClose?.();
  };

  const toggleCamera = () => {
    if (isRecording) {
      return;
    }

    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    if (facing === "front") {
      Alert.alert(
        "Flash unavailable",
        "Flash is not available while using the front camera.",
      );
      return;
    }

    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const switchMode = (nextMode) => {
    dismissKeyboard();

    if (nextMode === mode) {
      return;
    }

    const selectedMode = modes.find((item) => item.id === nextMode);

    if (selectedMode?.route) {
      router.push(selectedMode.route);
      return;
    }

    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    }

    setMode(nextMode);

    if (nextMode === "text") {
      setText("");
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 150);
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

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];

      onContinue?.({
        type: asset.type === "video" ? "video" : "image",
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        duration: asset.duration || null,
      });
    } catch (error) {
      console.error("Story gallery error:", error);

      Alert.alert(
        "Unable to open gallery",
        "Something went wrong while opening your gallery.",
      );
    }
  };

  const takePhoto = async () => {
    dismissKeyboard();

    if (!cameraRef.current || isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
      });

      if (!photo?.uri) {
        return;
      }

      onContinue?.({
        type: "image",
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
      });
    } catch (error) {
      console.error("Story photo error:", error);

      Alert.alert("Camera error", "Unable to capture the photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    dismissKeyboard();

    if (!cameraRef.current || isRecording || isProcessing) {
      return;
    }

    try {
      setIsRecording(true);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
      });

      if (video?.uri) {
        onContinue?.({
          type: "video",
          uri: video.uri,
        });
      }
    } catch (error) {
      console.error("Story video error:", error);

      Alert.alert("Camera error", "Unable to record the video.");
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!cameraRef.current || !isRecording) {
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

  const openColorModal = () => {
    dismissKeyboard();
    setColorModalVisible(true);
  };

  const closeColorModal = () => {
    setColorModalVisible(false);
  };

  const selectTextColor = (index) => {
    setTextColorIndex(index);
    setColorModalVisible(false);
  };

  const getPlaceholderColor = () => {
    if (isLightTextColor(textColorIndex)) {
      return "#555555";
    }
    return "#AAAAAA";
  };

  const getCountColor = () => {
    if (isLightTextColor(textColorIndex)) {
      return "#555555";
    }
    return "#CCCCCC";
  };

  const handlePublishText = () => {
    if (!text.trim()) {
      return;
    }

    onContinue?.({
      type: "text",
      text: text.trim(),
      backgroundColor: TEXT_COLORS[textColorIndex],
    });
  };

  if (!cameraPermission) {
    return (
      <View style={styles.permissionScreen}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen} edges={["top", "bottom"]}>
        <View style={styles.permissionContent}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={38} color="#FFFFFF" />
          </View>

          <Text style={styles.permissionTitle}>Camera access is needed</Text>

          <Text style={styles.permissionText}>
            Allow camera access to create photo and video Stories.
          </Text>

          <Pressable
            onPress={requestCameraPermission}
            style={({ pressed }) => [
              styles.permissionButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.permissionButtonText}>Allow camera</Text>
          </Pressable>

          <Pressable
            onPress={openGallery}
            style={({ pressed }) => [
              styles.galleryFallbackButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="images-outline" size={19} color="#FFFFFF" />

            <Text style={styles.galleryFallbackText}>Choose from gallery</Text>
          </Pressable>

          <Pressable onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>{closeLabel}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isCameraMode = cameraMode === "photo" || cameraMode === "video";

  const isTextMode = cameraMode === "text";

  return (
    <View style={styles.container}>
      {/* LIVE CAMERA */}
      {isCameraMode ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          flash={flash}
          mode={mode === "video" ? "video" : "picture"}
        />
      ) : null}

      {/* TEXT MODE */}
      {isTextMode ? (
        <View
          style={[
            styles.textCanvas,
            {
              backgroundColor: TEXT_COLORS[textColorIndex],
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={toggleKeyboard} />

          <ScrollView
            ref={textScrollRef}
            contentContainerStyle={styles.textScrollContent}
          >
            <TextInput
              ref={textInputRef}
              value={text}
              onChangeText={setText}
              placeholder="Type a Story..."
              placeholderTextColor={getPlaceholderColor()}
              multiline
              autoFocus
              textAlign="center"
              maxLength={500}
              onFocus={() => setKeyboardVisible(true)}
              onBlur={() => setKeyboardVisible(false)}
              style={[
                styles.textInput,
                isLightTextColor(textColorIndex) && {
                  color: "#000000",
                },
              ]}
            />
          </ScrollView>
        </View>
      ) : null}

      <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
        {/* HEADER */}
        <View style={styles.topBar}>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.topButton,
              pressed && styles.topButtonPressed,
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`${closeLabel} creator`}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>

          {isTextMode ? (
            <View style={styles.textCountBadge}>
              <Text
                style={[
                  styles.textCountText,
                  isLightTextColor(textColorIndex) && {
                    color: getCountColor(),
                  },
                ]}
              >
                {text.length}/500
              </Text>
            </View>
          ) : null}

          <View style={styles.topRight}>
            {!isTextMode ? (
              <Pressable
                onPress={toggleFlash}
                style={({ pressed }) => [
                  styles.flashButton,
                  pressed && styles.topButtonPressed,
                ]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Toggle flash"
              >
                <Ionicons
                  name={flash === "on" ? "flash" : "flash-off-outline"}
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            ) : null}

            {isTextMode ? (
              keyboardVisible ? (
                <Pressable
                  onPress={openColorModal}
                  style={({ pressed }) => [
                    styles.colorButton,
                    pressed && styles.topButtonPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: TEXT_COLORS[textColorIndex],
                      },
                    ]}
                  />

                  <Ionicons
                    name="color-palette-outline"
                    size={21}
                    color="#FFFFFF"
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={handlePublishText}
                  style={({ pressed }) => [
                    styles.publishButton,
                    pressed && styles.topButtonPressed,
                  ]}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Continue to Story settings"
                >
                  <Ionicons name="checkmark" size={22} color="#000000" />
                </Pressable>
              )
            ) : null}
          </View>
        </View>

        {/* MODE SELECTOR */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.modeSelector}
          contentContainerStyle={styles.modeSelectorScroll}
        >
          {modes.map((item) => {
            const active = item.id === mode;

            return (
              <Pressable
                key={item.id}
                onPress={() => switchMode(item.id)}
                style={({ pressed }) => [
                  styles.modeItem,
                  active && styles.modeItemActive,
                  pressed && styles.modeItemPressed,
                ]}
                hitSlop={4}
                accessibilityRole="button"
                accessibilityState={{
                  selected: active,
                }}
                accessibilityLabel={`${closeLabel} ${item.label} mode`}
              >
                <Ionicons
                  name={item.icon}
                  size={16}
                  color={active ? "#FFFFFF" : "rgba(255,255,255,0.62)"}
                />

                <Text
                  style={[styles.modeText, active && styles.modeTextActive]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* CAMERA BOTTOM CONTROLS */}
        {isCameraMode ? (
          <View style={styles.bottomControls}>
            <Pressable
              onPress={openGallery}
              style={({ pressed }) => [
                styles.galleryButton,
                pressed && styles.galleryButtonPressed,
              ]}
            >
              <View style={styles.galleryPreview}>
                <Ionicons name="images-outline" size={22} color="#FFFFFF" />
              </View>

              <Text style={styles.bottomLabel}>Gallery</Text>
            </Pressable>

            <Pressable
              onPress={handleCapture}
              onLongPress={mode === "video" ? startRecording : undefined}
              delayLongPress={250}
              style={[
                styles.captureButton,
                isRecording && styles.captureButtonRecording,
              ]}
              disabled={isProcessing}
            >
              <View
                style={[
                  styles.captureInner,
                  isRecording && styles.captureInnerRecording,
                ]}
              />
            </Pressable>

            <Pressable
              onPress={toggleCamera}
              style={({ pressed }) => [
                styles.flipButton,
                pressed && styles.flipButtonPressed,
              ]}
            >
              <View style={styles.flipIcon}>
                <Ionicons
                  name="camera-reverse-outline"
                  size={23}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.bottomLabel}>Flip</Text>
            </Pressable>
          </View>
        ) : null}

        {/* PROCESSING */}
        {isProcessing ? (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : null}

        {/* COLOR MODAL */}
        {colorModalVisible ? (
          <Pressable
            style={styles.colorModalDismissArea}
            onPress={closeColorModal}
          >
            <View style={styles.colorModal}>
              <View style={styles.colorModalHandle} />

              <Text style={styles.colorModalTitle}>Background color</Text>

              <View style={styles.colorModalGrid}>
                {TEXT_COLORS.map((color, index) => {
                  const isSelected = textColorIndex === index;

                  return (
                    <Pressable
                      key={color}
                      onPress={() => selectTextColor(index)}
                      style={[
                        styles.colorModalItem,
                        isSelected && styles.colorModalItemSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.colorModalSwatch,
                          {
                            backgroundColor: color,
                          },
                          color === "#FFFFFF" && {
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                          },
                        ]}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color={
                              TEXT_COLORS[index] === "#FFFFFF"
                                ? "#000000"
                                : "#FFFFFF"
                            }
                          />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Pressable>
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
    paddingTop: Platform.OS === "android" ? 8 : 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.38)",
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

  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },

  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  publishButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  textCountBadge: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },

  textCountText: {
    color: "#CCCCCC",
    fontSize: 11,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
  },

  colorButton: {
    minWidth: 44,
    height: 40,
    paddingHorizontal: 9,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.38)",
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

  modeSelector: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 160,
    zIndex: 20,
    paddingHorizontal: 16,
  },

  modeSelectorScroll: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    alignSelf: "center",
    paddingHorizontal: 6,
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
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
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
    color: "rgba(255,255,255,0.62)",
    fontSize: 12,
    fontWeight: "700",
  },

  modeTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
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
    backgroundColor: "rgba(0,0,0,0.48)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 5,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  flipButton: {
    width: 64,
    alignItems: "center",
  },

  flipButtonPressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  flipIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.48)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#FFFFFF",
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.45)",
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

  textScrollContent: {
    flexGrow: 1,
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

  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.25)",
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

  colorModalDismissArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 300,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 28,
  },

  colorModal: {
    width: "100%",
    backgroundColor: "#111111d2",
    borderRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },

  colorModalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 14,
  },

  colorModalTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 14,
    textAlign: "center",
  },

  colorModalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  colorModalItem: {
    width: 72,
    alignItems: "center",
  },

  colorModalItemSelected: {
    transform: [{ scale: 1.05 }],
  },

  colorModalSwatch: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
