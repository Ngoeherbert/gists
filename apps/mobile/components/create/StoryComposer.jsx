// apps/mobile/components/create/StoryComposer.jsx
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../common/AppButton";
import CaptionInput from "./CaptionInput";
import MediaPicker from "./MediaPicker";
import MediaPreview from "./MediaPreview";

export default function StoryComposer({
  media,
  caption = "",
  onCaptionChange,
  onPickMedia,
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
      <Text style={styles.title}>Create story</Text>

      {media ? (
        <MediaPreview media={media} onRemove={onRemoveMedia} />
      ) : (
        <MediaPicker onPickMedia={onPickMedia} />
      )}

      <CaptionInput
        value={caption}
        onChangeText={onCaptionChange}
        placeholder="Add something to your story..."
        maxLength={500}
      />

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Your story will be visible for 24 hours.
        </Text>
      </View>

      <AppButton
        title="Share story"
        onPress={onPublish}
        loading={publishing}
        disabled={!canPublish || publishing}
        fullWidth
      />
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
  info: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
  },
  infoText: {
    color: "#777777",
    fontSize: 12,
    lineHeight: 18,
  },
});
