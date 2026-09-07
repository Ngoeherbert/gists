import { Alert, Linking, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";

async function showPermissionAlert(title, message) {
  Alert.alert(title, message, [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Settings",
      onPress: () => Linking.openSettings(),
    },
  ]);
}

export async function requestCameraPermission() {
  try {
    const result = await Camera.requestCameraPermissionsAsync();

    if (!result.granted) {
      await showPermissionAlert(
        "Camera Permission Required",
        "Gists needs access to your camera for photos, videos, stories, and reels.",
      );
    }

    return result.granted;
  } catch (error) {
    return false;
  }
}

export async function requestMediaLibraryPermission() {
  try {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!result.granted) {
      await showPermissionAlert(
        "Photo Library Permission Required",
        "Gists needs access to your photos and videos so you can share media.",
      );
    }

    return result.granted;
  } catch (error) {
    return false;
  }
}

export async function checkCameraPermission() {
  try {
    const result = await Camera.getCameraPermissionsAsync();
    return result.granted;
  } catch (error) {
    return false;
  }
}

export async function checkMediaLibraryPermission() {
  try {
    const result = await ImagePicker.getMediaLibraryPermissionsAsync();
    return result.granted;
  } catch (error) {
    return false;
  }
}

export async function requestAllMediaPermissions() {
  const cameraGranted = await requestCameraPermission();
  const libraryGranted = await requestMediaLibraryPermission();

  return {
    camera: cameraGranted,
    mediaLibrary: libraryGranted,
    granted: cameraGranted && libraryGranted,
  };
}

export function isPermissionSupported() {
  return Platform.OS !== "web";
}

export default {
  requestCameraPermission,
  requestMediaLibraryPermission,
  checkCameraPermission,
  checkMediaLibraryPermission,
  requestAllMediaPermissions,
  isPermissionSupported,
};
