import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { useReelStore } from "../../../stores/reelStore";
import { useAuthStore } from "../../../stores/authStore";

import ReelComposer from "../../../components/create/ReelComposer";
import { currentUser as DUMMY_USER } from "../../../features/posts/dummyData";

export default function CreateReelScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const addReel = useReelStore((state) => state.addReel);
  const authUser = useAuthStore((state) => state.user);
  const currentUser = authUser || DUMMY_USER;

  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const videoUri = Array.isArray(params.videoUri)
      ? params.videoUri[0]
      : params.videoUri;
    if (videoUri) {
      setMedia({ uri: videoUri, type: "video" });
    }
  }, [params.videoUri]);

  const handlePickVideo = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 0.9,
      allowsMultipleSelection: false,
      videoMaxDuration: 60,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setMedia({ uri: asset.uri, type: "video" });
    }
  }, []);

  const handleRemoveMedia = useCallback(() => {
    setMedia(null);
  }, []);

  const handleContinue = useCallback(() => {
    if (!media) {
      Alert.alert("Add video", "Please select a video first.");
      return;
    }

    setProcessing(true);

    const newReel = {
      id: `reel-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      videoUrl: media.uri,
      caption: caption.trim(),
      hashtags: hashtags.trim(),
      music: {
        title: "Original audio",
        artist: currentUser.name || currentUser.username,
      },
      liked: false,
      likeCount: 0,
      commentCount: 0,
      reposted: false,
      repostCount: 0,
      saved: false,
      comments: [],
    };

    setTimeout(() => {
      addReel(newReel);
      setProcessing(false);
      router.replace("/(main)/reels");
    }, 1000);
  }, [media, caption, hashtags, currentUser, addReel, router]);

  const canContinue = Boolean(media);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>New Reel</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ReelComposer
        media={media}
        caption={caption}
        hashtags={hashtags}
        onCaptionChange={setCaption}
        onHashtagsChange={setHashtags}
        onPickVideo={handlePickVideo}
        onRemoveMedia={handleRemoveMedia}
        onContinue={handleContinue}
        processing={processing}
        canContinue={canContinue}
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
