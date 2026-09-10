// apps/mobile/components/feeds/StoryCard.jsx
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
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
  onClose,
  onAddStory,
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
    story.storyImage ||
    story.storyUri ||
    story.image ||
    story.uri ||
    story.media?.uri ||
    story.media?.url;

  const caption = story.caption || story.text || story.content;

  const progress =
    typeof story.progress === "number"
      ? Math.min(Math.max(story.progress, 0), 1)
      : 0;

  const timestamp = story.timestamp || story.createdAt || "Just now";

  const handleClose = (event) => {
    event.stopPropagation?.();

    if (typeof onClose === "function") {
      onClose(story);
      return;
    }

    onPress?.();
  };

  const handleUserPress = (event) => {
    event.stopPropagation?.();
    onUserPress?.(story, user);
  };

  const handleMorePress = (event) => {
    event.stopPropagation?.();
    onMorePress?.(story);
  };

  const handleReply = (event) => {
    event.stopPropagation?.();
    onReply?.(story);
  };

  const handleAddStoryPress = (event) => {
    event.stopPropagation?.();
    onAddStory?.();
  };

  const hasMedia = Boolean(mediaUri);
  const isTextOnly = Boolean(caption) && !hasMedia;
  const textColor = story.textColor || "#FFFFFF";

  const renderProgress = (dark = false) => (
    <View style={styles.progressContainer}>
      <View style={dark ? styles.progressTrackDark : styles.progressTrack}>
        <View
          style={[
            dark ? styles.progressFillDark : styles.progressFill,
            { width: `${progress * 100}%` },
          ]}
        />
      </View>
    </View>
  );

  const renderHeader = (dark = false) => (
    <View style={styles.header}>
      <Pressable
        onPress={handleUserPress}
        hitSlop={6}
        style={styles.userButton}
      >
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={dark ? styles.avatarDark : styles.avatar}
          />
        ) : (
          <View
            style={
              dark ? styles.avatarPlaceholderDark : styles.avatarPlaceholder
            }
          >
            <Text
              style={dark ? styles.avatarInitialDark : styles.avatarInitial}
            >
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.userInfo}>
          <Text numberOfLines={1} style={dark ? styles.darkName : styles.name}>
            {name}
          </Text>

          <Text
            numberOfLines={1}
            style={dark ? styles.darkTimestamp : styles.timestamp}
          >
            {timestamp}
          </Text>
        </View>
      </Pressable>

      <View style={styles.headerActions}>
        {onMorePress ? (
          <Pressable
            onPress={handleMorePress}
            hitSlop={10}
            style={styles.iconButton}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={22}
              color={dark ? "#111111" : "#FFFFFF"}
            />
          </Pressable>
        ) : null}

        <Pressable onPress={handleClose} hitSlop={10} style={styles.iconButton}>
          <Ionicons
            name="close"
            size={27}
            color={dark ? "#111111" : "#FFFFFF"}
          />
        </Pressable>
      </View>
    </View>
  );

  const renderReply = (dark = false) =>
    onReply ? (
      <Pressable onPress={handleReply} style={styles.replyContainer}>
        <View style={dark ? styles.replyInputDark : styles.replyInput}>
          <Text
            style={dark ? styles.replyPlaceholderDark : styles.replyPlaceholder}
          >
            Reply to {name}
          </Text>

          {dark ? (
            <Ionicons name="paper-plane-outline" size={18} color="#777777" />
          ) : (
            <View style={styles.replyIcon}>
              <Ionicons name="paper-plane" size={17} color="#111111" />
            </View>
          )}
        </View>
      </Pressable>
    ) : null;

  const renderAddButton = (dark = false) => {
    if (!onAddStory) return null;

    return (
      <Pressable onPress={handleAddStoryPress} style={styles.centerAddButton}>
        <View
          style={dark ? styles.addButtonCircleDark : styles.addButtonCircle}
        >
          <Ionicons name="add" size={28} color={dark ? "#111111" : "#FFFFFF"} />
        </View>
      </Pressable>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {hasMedia ? (
        <ImageBackground
          source={{ uri: mediaUri }}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.topOverlay} />
          <View style={styles.bottomOverlay} />

          {renderProgress()}
          {renderHeader()}

          {caption ? (
            <View style={styles.captionContainer}>
              <Text numberOfLines={5} style={styles.caption}>
                {caption}
              </Text>
            </View>
          ) : null}

          {renderAddButton()}
          {renderReply()}
        </ImageBackground>
      ) : isTextOnly ? (
        <View
          style={[
            styles.textBackground,
            { backgroundColor: story.backgroundColor || "#111111" },
          ]}
        >
          {renderProgress()}
          {renderHeader()}

          <View style={styles.textStoryContainer}>
            <Text style={[styles.textStory, { color: textColor }]}>
              {caption}
            </Text>
          </View>

          {renderAddButton()}
          {renderReply()}
        </View>
      ) : (
        <View style={styles.placeholderBackground}>
          {renderProgress(true)}
          {renderHeader(true)}

          <View style={styles.placeholderCenter}>
            <View style={styles.placeholderIcon}>
              <Ionicons name="images-outline" size={36} color="#999999" />
            </View>
            <Text style={styles.placeholderText}>No story yet</Text>
          </View>

          {renderAddButton(true)}
          {renderReply(true)}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 620,
    overflow: "hidden",
    backgroundColor: "#111111",
    borderRadius: 0,
  },

  background: {
    flex: 1,
    justifyContent: "space-between",
  },

  textBackground: {
    flex: 1,
    justifyContent: "space-between",
  },

  placeholderBackground: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },

  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 190,
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  bottomOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 270,
    backgroundColor: "rgba(0,0,0,0.42)",
  },

  progressContainer: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    zIndex: 20,
  },

  progressTrack: {
    width: "100%",
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },

  progressTrackDark: {
    width: "100%",
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#D5D5D5",
  },

  progressFillDark: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#111111",
  },

  header: {
    position: "absolute",
    top: 22,
    left: 14,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
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
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  avatarDark: {
    width: 42,
    height: 42,
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
    fontWeight: "800",
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
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  captionContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 88,
    alignItems: "center",
  },

  caption: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  replyContainer: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 16,
  },

  replyInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    borderRadius: 24,
    paddingLeft: 18,
    paddingRight: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  replyPlaceholder: {
    flex: 1,
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
  },

  replyIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  avatarPlaceholderDark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDDDD",
  },

  avatarInitialDark: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
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

  textStoryContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  textStory: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 31,
    fontWeight: "600",
    textAlign: "center",
  },

  replyInputDark: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 24,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  replyPlaceholderDark: {
    color: "#777777",
    fontSize: 13,
  },

  pressed: {
    opacity: 0.96,
  },

  centerAddButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -28,
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
  },

  addButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },

  addButtonCircleDark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#111111",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  placeholderCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  placeholderText: {
    color: "#777777",
    fontSize: 14,
    fontWeight: "600",
  },
});
