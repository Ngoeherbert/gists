import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  posts as dummyPosts,
  currentUser,
} from "../../../../features/posts/dummyData";

export default function EditPostScreen() {
  const router = useRouter();
  const { postId, id } = useLocalSearchParams();

  const selectedPostId = String(postId || id || "");

  const originalPost = useMemo(
    () =>
      dummyPosts.find((item) => String(item?.id) === selectedPostId) || null,
    [selectedPostId],
  );

  const initialCaption =
    originalPost?.caption || originalPost?.content || originalPost?.text || "";

  const [caption, setCaption] = useState(initialCaption);

  const [saving, setSaving] = useState(false);

  const [dirty, setDirty] = useState(false);

  const mediaUri =
    originalPost?.mediaUrl ||
    originalPost?.image ||
    originalPost?.media?.uri ||
    originalPost?.media?.url;

  const mediaType =
    originalPost?.mediaType || originalPost?.media?.type || "image";

  const username =
    originalPost?.username ||
    originalPost?.user?.username ||
    currentUser?.username ||
    "user";

  const handleCaptionChange = (value) => {
    setCaption(value);
    setDirty(value !== initialCaption);
  };

  const handleCancel = () => {
    if (!dirty) {
      router.back();
      return;
    }

    Alert.alert("Discard changes?", "Your changes will not be saved.", [
      {
        text: "Keep editing",
        style: "cancel",
      },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleSave = () => {
    if (!originalPost || saving) {
      return;
    }

    setSaving(true);

    // Temporary local save.
    // This will later become the update-post API request.
    setTimeout(() => {
      const index = dummyPosts.findIndex(
        (item) => String(item?.id) === selectedPostId,
      );

      if (index >= 0) {
        dummyPosts[index] = {
          ...dummyPosts[index],
          caption: caption.trim(),
        };
      }

      setSaving(false);
      setDirty(false);

      Alert.alert("Post updated", "Your post has been updated successfully.", [
        {
          text: "Done",
          onPress: () => router.back(),
        },
      ]);
    }, 500);
  };

  if (!originalPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.headerButton}
            hitSlop={10}
          >
            <Ionicons name="close" size={25} color="#111111" />
          </Pressable>

          <Text style={styles.headerTitle}>Edit post</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.notFound}>
          <Ionicons name="document-text-outline" size={42} color="#AAAAAA" />

          <Text style={styles.notFoundTitle}>Post not found</Text>

          <Text style={styles.notFoundText}>
            This post may have been deleted or is no longer available.
          </Text>

          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable
            onPress={handleCancel}
            style={styles.headerButton}
            hitSlop={10}
          >
            <Ionicons name="close" size={25} color="#111111" />
          </Pressable>

          <Text style={styles.headerTitle}>Edit post</Text>

          <Pressable
            onPress={handleSave}
            disabled={saving || !dirty}
            style={[
              styles.saveButton,
              (!dirty || saving) && styles.saveButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.saveText,
                (!dirty || saving) && styles.saveTextDisabled,
              ]}
            >
              {saving ? "Saving..." : "Save"}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.authorRow}>
            {originalPost?.user?.avatar || originalPost?.userAvatar ? (
              <Image
                source={{
                  uri: originalPost?.user?.avatar || originalPost?.userAvatar,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {(
                    originalPost?.user?.name ||
                    originalPost?.userName ||
                    username
                  )
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>
                {originalPost?.user?.name || originalPost?.userName || username}
              </Text>

              <Text style={styles.authorUsername}>@{username}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Caption</Text>

              <Text style={styles.counter}>{caption.length}/2200</Text>
            </View>

            <TextInput
              value={caption}
              onChangeText={handleCaptionChange}
              placeholder="Write a caption..."
              placeholderTextColor="#999999"
              multiline
              maxLength={2200}
              textAlignVertical="top"
              style={styles.captionInput}
            />
          </View>

          {mediaUri ? (
            <View style={styles.mediaSection}>
              <Text style={styles.label}>Media</Text>

              <View style={styles.mediaPreview}>
                <Image
                  source={{
                    uri: mediaUri,
                  }}
                  resizeMode="cover"
                  style={[
                    styles.media,
                    {
                      aspectRatio:
                        Number(originalPost?.aspectRatio) > 0
                          ? Number(originalPost?.aspectRatio)
                          : 1,
                    },
                  ]}
                />

                {mediaType === "video" && (
                  <View style={styles.videoBadge}>
                    <Ionicons name="videocam" size={15} color="#FFFFFF" />

                    <Text style={styles.videoBadgeText}>Video</Text>
                  </View>
                )}
              </View>

              <Text style={styles.mediaHint}>
                Media editing will be available separately.
              </Text>
            </View>
          ) : null}

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#777777"
            />

            <Text style={styles.infoText}>
              You can edit your caption here. Media replacement, location,
              mentions, and audience controls will be connected to the post
              editor as those features are added.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboard: {
    flex: 1,
  },

  header: {
    height: 58,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 42,
    height: 42,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 42,
  },

  saveButton: {
    minWidth: 58,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonDisabled: {
    backgroundColor: "#F0F0F0",
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  saveTextDisabled: {
    color: "#AAAAAA",
  },

  content: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 80,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EEEEEE",
  },

  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },

  authorInfo: {
    marginLeft: 11,
  },

  authorName: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },

  authorUsername: {
    marginTop: 2,
    color: "#888888",
    fontSize: 12,
  },

  field: {
    width: "100%",
  },

  labelRow: {
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    color: "#222222",
    fontSize: 14,
    fontWeight: "700",
  },

  counter: {
    color: "#999999",
    fontSize: 12,
  },

  captionInput: {
    minHeight: 150,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 16,
    color: "#111111",
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },

  mediaSection: {
    marginTop: 26,
  },

  mediaPreview: {
    width: "100%",
    marginTop: 10,
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#EEEEEE",
  },

  media: {
    width: "100%",
  },

  videoBadge: {
    position: "absolute",
    left: 12,
    top: 12,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  videoBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  mediaHint: {
    marginTop: 8,
    color: "#999999",
    fontSize: 12,
  },

  infoCard: {
    marginTop: 28,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    color: "#777777",
    fontSize: 12,
    lineHeight: 18,
  },

  notFound: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundTitle: {
    marginTop: 14,
    color: "#111111",
    fontSize: 20,
    fontWeight: "700",
  },

  notFoundText: {
    maxWidth: 320,
    marginTop: 7,
    color: "#888888",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  backButton: {
    marginTop: 24,
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 23,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
