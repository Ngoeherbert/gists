// apps/mobile/components/feeds/StoryCard.jsx
import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function StoryCard({
  story,
  onPress,
  onUserPress,
  onReply,
  onMorePress,
}) {
  if (!story) return null;

  const user = story.user || {};
  const name =
    user.name || user.username || story.name || story.username || "User";

  const avatar =
    user.avatar ||
    user.photo ||
    user.profilePhoto ||
    story.avatar ||
    story.photo;

  const mediaUri =
    story.mediaUrl ||
    story.image ||
    story.uri ||
    story.media?.uri ||
    story.media?.url;

  const caption = story.caption || story.text || story.content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {mediaUri ? (
        <ImageBackground
          source={{ uri: mediaUri }}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.overlay} />

          <View style={styles.topRow}>
            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                onUserPress?.(story, user);
              }}
              hitSlop={6}
              style={styles.userButton}
            >
              {avatar ? (
                <ImageBackground
                  source={{ uri: avatar }}
                  style={styles.avatar}
                  imageStyle={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={styles.userInfo}>
                <Text numberOfLines={1} style={styles.name}>
                  {name}
                </Text>

                {story.timestamp ? (
                  <Text style={styles.timestamp}>{story.timestamp}</Text>
                ) : null}
              </View>
            </Pressable>

            {onMorePress && (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation?.();
                  onMorePress?.(story);
                }}
                hitSlop={10}
                style={styles.moreButton}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            )}
          </View>

          {caption ? (
            <View style={styles.captionContainer}>
              <Text numberOfLines={3} style={styles.caption}>
                {caption}
              </Text>
            </View>
          ) : null}

          {onReply && (
            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                onReply?.(story);
              }}
              style={styles.replyButton}
            >
              <Ionicons name="chatbubble-outline" size={18} color="#111111" />

              <Text style={styles.replyText}>Reply</Text>
            </Pressable>
          )}
        </ImageBackground>
      ) : (
        <View style={styles.emptyBackground}>
          <View style={styles.topRow}>
            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                onUserPress?.(story, user);
              }}
              style={styles.userButton}
            >
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text numberOfLines={1} style={styles.darkName}>
                  {name}
                </Text>

                {story.timestamp ? (
                  <Text style={styles.darkTimestamp}>{story.timestamp}</Text>
                ) : null}
              </View>
            </Pressable>

            {onMorePress && (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation?.();
                  onMorePress?.(story);
                }}
                hitSlop={10}
                style={styles.moreButton}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={22}
                  color="#111111"
                />
              </Pressable>
            )}
          </View>

          {caption ? (
            <Text numberOfLines={5} style={styles.darkCaption}>
              {caption}
            </Text>
          ) : (
            <View style={styles.noMediaIcon}>
              <Ionicons name="images-outline" size={34} color="#888888" />
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 560,
    overflow: "hidden",
    backgroundColor: "#EEEEEE",
  },
  background: {
    flex: 1,
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  topRow: {
    paddingHorizontal: 16,
    paddingTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarImage: {
    borderRadius: 21,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E5E5",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarInitial: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  timestamp: {
    marginTop: 2,
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
  },
  darkName: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  darkTimestamp: {
    marginTop: 2,
    color: "#777777",
    fontSize: 11,
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  captionContainer: {
    paddingHorizontal: 18,
    paddingBottom: 82,
  },
  caption: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },
  replyButton: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  replyText: {
    marginLeft: 8,
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyBackground: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3F3F3",
  },
  darkCaption: {
    marginTop: 32,
    color: "#111111",
    fontSize: 17,
    lineHeight: 25,
  },
  noMediaIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.94,
  },
});
