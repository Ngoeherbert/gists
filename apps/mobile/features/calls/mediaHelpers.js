import { Platform } from "react-native";

export function isMediaStreamAvailable(stream) {
  return Boolean(stream);
}

export function getStreamTracks(stream, kind) {
  if (!stream) {
    return [];
  }

  if (typeof stream.getTracks !== "function") {
    return [];
  }

  const tracks = stream.getTracks();

  if (!kind) {
    return tracks;
  }

  return tracks.filter((track) => track.kind === kind);
}

export function getAudioTracks(stream) {
  return getStreamTracks(stream, "audio");
}

export function getVideoTracks(stream) {
  return getStreamTracks(stream, "video");
}

export function setTracksEnabled(stream, enabled, kind) {
  const tracks = getStreamTracks(stream, kind);

  tracks.forEach((track) => {
    track.enabled = enabled;
  });

  return tracks;
}

export function setAudioEnabled(stream, enabled) {
  return setTracksEnabled(stream, enabled, "audio");
}

export function setVideoEnabled(stream, enabled) {
  return setTracksEnabled(stream, enabled, "video");
}

export function stopTracks(stream, kind) {
  const tracks = getStreamTracks(stream, kind);

  tracks.forEach((track) => {
    if (typeof track.stop === "function") {
      track.stop();
    }
  });

  return tracks;
}

export function stopMediaStream(stream) {
  if (!stream) {
    return;
  }

  stopTracks(stream);
}

export function getCameraFacingMode(isFrontCamera = true) {
  return isFrontCamera ? "user" : "environment";
}

export function getCameraFacing(isFrontCamera = true) {
  if (Platform.OS === "web") {
    return getCameraFacingMode(isFrontCamera);
  }

  return isFrontCamera ? "front" : "back";
}

export function toggleCamera(stream, enabled) {
  return setVideoEnabled(stream, enabled);
}

export function toggleMicrophone(stream, enabled) {
  return setAudioEnabled(stream, enabled);
}

export function hasAudioTrack(stream) {
  return getAudioTracks(stream).length > 0;
}

export function hasVideoTrack(stream) {
  return getVideoTracks(stream).length > 0;
}

export function getMediaTrackCount(stream) {
  return getStreamTracks(stream).length;
}

export function releaseMediaResources(stream) {
  if (!stream) {
    return;
  }

  stopTracks(stream);
}

export default {
  isMediaStreamAvailable,
  getStreamTracks,
  getAudioTracks,
  getVideoTracks,
  setTracksEnabled,
  setAudioEnabled,
  setVideoEnabled,
  stopTracks,
  stopMediaStream,
  getCameraFacingMode,
  getCameraFacing,
  toggleCamera,
  toggleMicrophone,
  hasAudioTrack,
  hasVideoTrack,
  getMediaTrackCount,
  releaseMediaResources,
};
