import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import useFeedStore from "../../../stores/feedStore";
import useAuthStore from "../../../stores/authStore";

import PostComposer from "../../../components/create/PostComposer";
import CaptionInput from "../../../components/create/CaptionInput";
import HashtagInput from "../../../components/create/HashtagInput";
import LocationPicker from "../../../components/create/LocationPicker";
import AudienceSelector from "../../../components/create/AudienceSelector";
import MediaPreview from "../../../components/create/MediaPreview";

const AUDIENCE_OPTIONS = [
  { id: "public", label: "Public", description: "Everyone can see this post" },
  { id: "friends", label: "Friends", description: "Only people you follow" },
  { id: "private", label: "Private", description: "Only you" },
];

export default function CreatePostScreen() {
  const router = useRouter();
  const addPost = useFeedStore((state) => state.addPost);
  const currentUser = useAuthStore((state) => state.user) || {
    id: "user-001",
    name: "Ngoe Herbert",
    username: "herbert237",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [audience, setAudience] = useState("public");
  const [publishing, setPublishing] = useState(false);

  const params = useLocalSearchParams();

  useEffect(() => {
    const mediaUri = Array.isArray(params.mediaUri)
      ? params.mediaUri[0]
      : params.mediaUri;
    const mediaType = Array.isArray(params.mediaType)
      ? params.mediaType[0]
      : params.mediaType;

    if (mediaUri) {
      setMedia({ uri: mediaUri });
      setMediaType(mediaType || "image");
    }
  }, [params.mediaUri, params.mediaType]);

  const handlePickMedia = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.9,
      allowsMultipleSelection: false,
      videoMaxDuration: 60,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setMedia({ uri: asset.uri });
      setMediaType(asset.type === "video" ? "video" : "image");
    }
  }, []);

  const handleRemoveMedia = useCallback(() => {
    setMedia(null);
    setMediaType(null);
  }, []);

  const handleLocationPress = useCallback(() => {
    Alert.alert("Location", "Location picker coming soon.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Use current location",
        onPress: () => setLocation("Buea, Cameroon"),
      },
    ]);
  }, []);

  const handleLocationClear = useCallback(() => {
    setLocation("");
  }, []);

  const handlePublish = useCallback(() => {
    if (!media) {
      Alert.alert("Add media", "Please select an image or video first.");
      return;
    }

    setPublishing(true);

    const newPost = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      timestamp: "Just now",
      location: location || undefined,
      caption: caption.trim(),
      hashtags: hashtags.trim(),
      mediaUrl: media.uri,
      mediaType: mediaType,
      aspectRatio: mediaType === "video" ? 9 / 16 : 1,
      liked: false,
      likeCount: 0,
      commentCount: 0,
      reposted: false,
      repostCount: 0,
      saved: false,
      isLiked: false,
      isReposted: false,
      isSaved: false,
      audience,
    };

    setTimeout(() => {
      addPost(newPost);
      setPublishing(false);
      router.replace("/(main)/feeds");
    }, 800);
  }, [
    media,
    mediaType,
    caption,
    hashtags,
    location,
    audience,
    currentUser,
    addPost,
    router,
  ]);

  const canPublish = Boolean(media);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={styles.headerSpacer} />
      </View>

      <PostComposer
        media={media}
        caption={caption}
        hashtags={hashtags}
        location={location}
        audience={audience}
        onCaptionChange={setCaption}
        onHashtagsChange={setHashtags}
        onAudienceChange={setAudience}
        onLocationPress={handleLocationPress}
        onLocationClear={handleLocationClear}
        onPickMedia={handlePickMedia}
        onRemoveMedia={handleRemoveMedia}
        onPublish={handlePublish}
        publishing={publishing}
        canPublish={canPublish}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 62,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111111",
  },
  headerSpacer: {
    width: 28,
  },
});
