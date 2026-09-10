// apps/mobile/components/feeds/StoryBar.jsx
import { FlatList, StyleSheet, View } from "react-native";
import StoryAvatar from "./StoryAvatar";

export default function StoryBar({
  stories = [],
  currentUser,
  onStoryPress,
  onCreateStory,
  onStoryDelete,
  onMorePress,
}) {
  const currentUserId = String(
    currentUser?.id ?? currentUser?.userId ?? currentUser?.user?.id,
  );

  // Group stories by userId.
  const groupedStories = stories.reduce((groups, story) => {
    const userId = String(story?.userId ?? story?.id);

    if (!groups[userId]) {
      groups[userId] = [];
    }

    groups[userId].push(story);

    return groups;
  }, {});

  // One avatar per user.
  const userStories = Object.values(groupedStories)
    .map((storyGroup) => {
      const firstStory = storyGroup[0];

      // Get story media from the first story in the group.
      const storyMediaUri =
        firstStory?.mediaUrl ||
        firstStory?.storyImage ||
        firstStory?.storyUri ||
        firstStory?.image ||
        firstStory?.uri ||
        firstStory?.media?.uri ||
        firstStory?.media?.url;

      return {
        ...firstStory,

        // Keep all stories belonging to this user.
        storyGroup,

        // Stable ID for the avatar.
        id: `user-${firstStory.userId}`,

        // Story media for the ring background.
        storyUri: storyMediaUri,

        type: firstStory?.type,
        text: firstStory?.text,
        backgroundColor: firstStory?.backgroundColor,
      };
    })
    // Exclude the current user's own group; it is rendered
    // as the leading "my-story" card instead.
    .filter((item) => String(item?.userId ?? item?.id) !== currentUserId);

  // Find the current user's own story group, if any.
  const ownStoryGroup = currentUserId
    ? groupedStories[currentUserId] || []
    : [];

  const ownFirstStory = ownStoryGroup[0] || {};

  const ownStoryMediaUri =
    ownFirstStory?.mediaUrl ||
    ownFirstStory?.storyImage ||
    ownFirstStory?.storyUri ||
    ownFirstStory?.image ||
    ownFirstStory?.uri ||
    ownFirstStory?.media?.uri ||
    ownFirstStory?.media?.url;

  const items = [
    {
      id: "my-story",
      ...(currentUser || {}),
      ...ownFirstStory,
      isOwn: true,
      storyGroup: ownStoryGroup,
      storyUri: ownStoryMediaUri,
      type: ownFirstStory?.type,
      text: ownFirstStory?.text,
      backgroundColor: ownFirstStory?.backgroundColor,
    },
    ...userStories,
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
            uri={item.storyUri}
            avatarUri={
              item.avatar ||
              item.photo ||
              item.profilePhoto ||
              item.user?.avatar ||
              item.user?.profileImage
            }
            name={item.name || item.username}
            viewed={item.viewed}
            isOwn={item.isOwn}
            type={item.type}
            text={item.text}
            backgroundColor={item.backgroundColor}
            onDelete={item.isOwn ? () => onStoryDelete?.(item) : undefined}
            onPress={() => {
              if (item.isOwn) {
                if (item.storyGroup && item.storyGroup.length > 0) {
                  onStoryPress?.({
                    ...item,
                    stories: item.storyGroup,
                  });
                  return;
                }

                onCreateStory?.();
                return;
              }

              onStoryPress?.({
                ...item,
                stories: item.storyGroup,
              });
            }}
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
