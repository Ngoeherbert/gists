// apps/mobile/components/create/ReelComposer.jsx
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../common/AppButton";
import CaptionInput from "./CaptionInput";
import HashtagInput from "./HashtagInput";
import MediaPicker from "./MediaPicker";
import MediaPreview from "./MediaPreview";

export default function ReelComposer({
  media,
  caption = "",
  hashtags = "",
  onCaptionChange,
  onHashtagsChange,
  onPickVideo,
  onRemoveMedia,
  onContinue,
  processing = false,
  canContinue = true,
}) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Create reel</Text>

      {media ? (
        <MediaPreview media={media} onRemove={onRemoveMedia} />
      ) : (
        <MediaPicker onPickVideo={onPickVideo} />
      )}

      <CaptionInput
        value={caption}
        onChangeText={onCaptionChange}
        placeholder="Add a caption to your reel..."
      />

      <HashtagInput value={hashtags} onChangeText={onHashtagsChange} />

      <View style={styles.footer}>
        <AppButton
          title="Continue"
          onPress={onContinue}
          loading={processing}
          disabled={!canContinue || processing}
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
    marginBottom: 2,
    color: "#111111",
    fontSize: 24,
    fontWeight: "800",
  },
  footer: {
    marginTop: 8,
  },
});
