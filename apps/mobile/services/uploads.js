import { del, upload } from "./api";

function createFormData(files, fields = {}) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  files.forEach((file) => {
    if (!file?.uri) return;

    formData.append(file.fieldName || "file", {
      uri: file.uri,
      name: file.name || `upload-${Date.now()}`,
      type: file.type || "application/octet-stream",
    });
  });

  return formData;
}

export async function uploadFile(file, fields = {}) {
  const formData = createFormData([file], fields);

  return upload("/uploads", formData);
}

export async function uploadImage(file, fields = {}) {
  const formData = createFormData(
    [
      {
        ...file,
        fieldName: file.fieldName || "image",
      },
    ],
    fields,
  );

  return upload("/uploads/images", formData);
}

export async function uploadVideo(file, fields = {}) {
  const formData = createFormData(
    [
      {
        ...file,
        fieldName: file.fieldName || "video",
      },
    ],
    fields,
  );

  return upload("/uploads/videos", formData);
}

export async function uploadAudio(file, fields = {}) {
  const formData = createFormData(
    [
      {
        ...file,
        fieldName: file.fieldName || "audio",
      },
    ],
    fields,
  );

  return upload("/uploads/audio", formData);
}

export async function uploadMultiple(files, fields = {}) {
  const normalizedFiles = files.map((file) => ({
    ...file,
    fieldName: file.fieldName || "files",
  }));

  const formData = createFormData(normalizedFiles, fields);

  return upload("/uploads/multiple", formData);
}

export async function deleteUpload(id) {
  return del(`/uploads/${id}`);
}

export default {
  createFormData,
  uploadFile,
  uploadImage,
  uploadVideo,
  uploadAudio,
  uploadMultiple,
  deleteUpload,
};
