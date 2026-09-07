import { Linking, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export async function checkMediaLibraryPermission() {
  const result = await ImagePicker.getMediaLibraryPermissionsAsync();

  return {
    granted: result.granted,
    status: result.status,
    canAskAgain: result.canAskAgain,
  };
}

export async function requestMediaLibraryPermission() {
  const result = await ImagePicker.requestMediaLibraryPermissionsAsync();

  return {
    granted: result.granted,
    status: result.status,
    canAskAgain: result.canAskAgain,
  };
}

export async function checkCameraPermission() {
  const result = await ImagePicker.getCameraPermissionsAsync();

  return {
    granted: result.granted,
    status: result.status,
    canAskAgain: result.canAskAgain,
  };
}

export async function requestCameraPermission() {
  const result = await ImagePicker.requestCameraPermissionsAsync();

  return {
    granted: result.granted,
    status: result.status,
    canAskAgain: result.canAskAgain,
  };
}

export async function checkDocumentPermission() {
  return {
    granted: true,
    status: "granted",
    canAskAgain: false,
  };
}

export async function requestDocumentPermission() {
  return checkDocumentPermission();
}

export async function ensureMediaLibraryPermission() {
  const current = await checkMediaLibraryPermission();

  if (current.granted) {
    return true;
  }

  const requested = await requestMediaLibraryPermission();

  return requested.granted;
}

export async function ensureCameraPermission() {
  const current = await checkCameraPermission();

  if (current.granted) {
    return true;
  }

  const requested = await requestCameraPermission();

  return requested.granted;
}

export async function ensureDocumentPermission() {
  return true;
}

export async function checkChatPermissions() {
  const [media, camera, document] = await Promise.all([
    checkMediaLibraryPermission(),
    checkCameraPermission(),
    checkDocumentPermission(),
  ]);

  return {
    media,
    camera,
    document,
    allGranted: media.granted && camera.granted && document.granted,
  };
}

export async function requestChatPermissions() {
  const [media, camera, document] = await Promise.all([
    requestMediaLibraryPermission(),
    requestCameraPermission(),
    requestDocumentPermission(),
  ]);

  return {
    media,
    camera,
    document,
    allGranted: media.granted && camera.granted && document.granted,
  };
}

export async function openChatSettings() {
  if (Platform.OS === "web") {
    return false;
  }

  await Linking.openSettings();

  return true;
}

export async function openAppSettings() {
  return openChatSettings();
}

export async function pickChatDocument(options = {}) {
  return DocumentPicker.getDocumentAsync({
    type: options.type || "*/*",
    multiple: Boolean(options.multiple),
    copyToCacheDirectory: true,
  });
}
