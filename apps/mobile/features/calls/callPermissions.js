import { Alert, Linking, Platform } from "react-native";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";

export async function checkCameraPermission() {
  if (Platform.OS === "web") {
    return true;
  }

  try {
    const permission = await Camera.getCameraPermissionsAsync();

    return permission.granted;
  } catch {
    return false;
  }
}

export async function requestCameraPermission() {
  if (Platform.OS === "web") {
    return true;
  }

  try {
    const permission = await Camera.requestCameraPermissionsAsync();

    return permission.granted;
  } catch {
    return false;
  }
}

export async function checkMicrophonePermission() {
  if (Platform.OS === "web") {
    return true;
  }

  try {
    const permission = await Audio.getPermissionsAsync();

    return permission.granted;
  } catch {
    return false;
  }
}

export async function requestMicrophonePermission() {
  if (Platform.OS === "web") {
    return true;
  }

  try {
    const permission = await Audio.requestPermissionsAsync();

    return permission.granted;
  } catch {
    return false;
  }
}

export async function checkCallPermissions(type = "voice") {
  const microphone = await checkMicrophonePermission();

  if (type === "video") {
    const camera = await checkCameraPermission();

    return {
      microphone,
      camera,
      granted: microphone && camera,
    };
  }

  return {
    microphone,
    camera: true,
    granted: microphone,
  };
}

export async function requestCallPermissions(type = "voice") {
  const microphone = await requestMicrophonePermission();

  if (type === "video") {
    const camera = await requestCameraPermission();

    return {
      microphone,
      camera,
      granted: microphone && camera,
    };
  }

  return {
    microphone,
    camera: true,
    granted: microphone,
  };
}

export async function ensureCallPermissions(type = "voice") {
  const permissions = await requestCallPermissions(type);

  if (!permissions.granted) {
    Alert.alert(
      "Permission required",
      type === "video"
        ? "Gists needs access to your microphone and camera to start a video call."
        : "Gists needs access to your microphone to start a voice call.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Settings",
          onPress: () => {
            Linking.openSettings().catch(() => {});
          },
        },
      ],
    );
  }

  return permissions.granted;
}

export async function openCallSettings() {
  try {
    await Linking.openSettings();
    return true;
  } catch {
    return false;
  }
}

export default {
  checkCameraPermission,
  requestCameraPermission,
  checkMicrophonePermission,
  requestMicrophonePermission,
  checkCallPermissions,
  requestCallPermissions,
  ensureCallPermissions,
  openCallSettings,
};
