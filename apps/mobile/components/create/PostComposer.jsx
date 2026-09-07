// apps/mobile/components/create/PostComposer.jsx
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../common/AppButton";
import AudienceSelector from "./AudienceSelector";
import CaptionInput from "./CaptionInput";
import HashtagInput from "./HashtagInput";
import LocationPicker from "./LocationPicker";
import MediaPicker from "./MediaPicker";
import MediaPreview from "./MediaPreview";

export default function PostComposer({
  media,
  caption = "",
  hashtags = "",
  location,
  audience = "public",
  onCaptionChange,
  onHashtagsChange,
  onAudienceChange,
  onLocationPress,
  onLocationClear,
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
      <Text style={styles.title}>Create post</Text>

      {media ? (
        <MediaPreview media={media} onRemove={onRemoveMedia} />
      ) : (
        <MediaPicker onPickMedia={onPickMedia} />
      )}

      <CaptionInput
        value={caption}
        onChangeText={onCaptionChange}
        placeholder="What's on your mind?"
      />

      <HashtagInput value={hashtags} onChangeText={onHashtagsChange} />

      <LocationPicker
        value={location}
        onPress={onLocationPress}
        onClear={onLocationClear}
      />

      <AudienceSelector value={audience} onChange={onAudienceChange} />

      <View style={styles.footer}>
        <AppButton
          title="Publish post"
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
    marginBottom: 2,
    color: "#111111",
    fontSize: 24,
    fontWeight: "800",
  },
  footer: {
    marginTop: 8,
  },
});
