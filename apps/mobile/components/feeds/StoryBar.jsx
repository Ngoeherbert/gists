// apps/mobile/components/feeds/StoryBar.jsx
import { FlatList, StyleSheet, View } from "react-native";
import StoryAvatar from "./StoryAvatar";

export default function StoryBar({
  stories = [],
  currentUser,
  onStoryPress,
  onCreateStory,
}) {
  const items = [
    {
      id: "my-story",
      ...(currentUser || {}),
      isOwn: true,
    },
    ...stories,
  ];

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item, index) => String(item.id ?? index)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <StoryAvatar
            uri={item.avatar || item.photo || item.profilePhoto}
            name={item.name || item.username}
            viewed={item.viewed}
            isOwn={item.isOwn}
            onPress={() =>
              item.isOwn ? onCreateStory?.() : onStoryPress?.(item)
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
