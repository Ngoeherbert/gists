export const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export const AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
];

export function isImageType(type = "") {
  return IMAGE_TYPES.includes(type.toLowerCase());
}

export function isVideoType(type = "") {
  return VIDEO_TYPES.includes(type.toLowerCase());
}

export function isAudioType(type = "") {
  return AUDIO_TYPES.includes(type.toLowerCase());
}

export function getMediaType(type = "") {
  const value = type.toLowerCase();

  if (isImageType(value)) return "image";
  if (isVideoType(value)) return "video";
  if (isAudioType(value)) return "audio";

  return "file";
}

export function getFileExtension(uri = "") {
  const cleanUri = uri.split("?")[0];
  const parts = cleanUri.split(".");
  const extension = parts[parts.length - 1];

  return extension ? extension.toLowerCase() : "";
}

export function formatFileSize(bytes) {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1,
  );

  const size = value / 1024 ** index;

  return `${size < 10 && index > 0 ? size.toFixed(1) : Math.round(size)} ${
    units[index]
  }`;
}

export function getMediaDimensions(width, height) {
  const w = Number(width);
  const h = Number(height);

  if (!w || !h) {
    return {
      width: 0,
      height: 0,
      aspectRatio: 1,
    };
  }

  return {
    width: w,
    height: h,
    aspectRatio: w / h,
  };
}

export function isVideo(uri = "", mimeType = "") {
  return isVideoType(mimeType) || /\.(mp4|mov|webm)$/i.test(uri);
}

export function isImage(uri = "", mimeType = "") {
  return isImageType(mimeType) || /\.(jpg|jpeg|png|webp|gif)$/i.test(uri);
}

export default {
  IMAGE_TYPES,
  VIDEO_TYPES,
  AUDIO_TYPES,
  isImageType,
  isVideoType,
  isAudioType,
  getMediaType,
  getFileExtension,
  formatFileSize,
  getMediaDimensions,
  isVideo,
  isImage,
};
