// apps/mobile/components/reels/ReelEditor.jsx
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../common/AppButton";
import CaptionInput from "../create/CaptionInput";
import HashtagInput from "../create/HashtagInput";
import MediaPreview from "../create/MediaPreview";
import ReelPreview from "./ReelPreview";
import ReelTimeline from "./ReelTimeline";

export default function ReelEditor({
  media,
  caption = "",
  hashtags = "",
  currentTime = 0,
  duration = 0,
  onCaptionChange,
  onHashtagsChange,
  onSeek,
  onRemoveMedia,
  onPublish,
  publishing = false,
  canPublish = true,
}) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Edit reel</Text>

      {media ? (
        <ReelPreview
          media={media}
          currentTime={currentTime}
          duration={duration}
        />
      ) : null}

      {media ? <MediaPreview media={media} onRemove={onRemoveMedia} /> : null}

      <ReelTimeline
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />

      <CaptionInput
        value={caption}
        onChangeText={onCaptionChange}
        placeholder="Add a caption..."
      />

      <HashtagInput value={hashtags} onChangeText={onHashtagsChange} />

      <View style={styles.footer}>
        <AppButton
          title="Publish reel"
          onPress={onPublish}
          loading={publishing}
          disabled={!canPublish || publishing}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  title: {
    color: "#111111",
    fontSize: 24,
    fontWeight: "800",
  },
  footer: {
    marginTop: 6,
  },
});
