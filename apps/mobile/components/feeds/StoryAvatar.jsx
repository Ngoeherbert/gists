// apps/mobile/components/feeds/StoryAvatar.jsx
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function StoryAvatar({
  uri,
  name,
  size = 120,
  viewed = false,
  isOwn = false,
  onPress,
}) {
  const displayName = isOwn ? "You" : name || "Story";
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "Y";

  const height = size * 1.42;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.container,
        {
          width: size,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            width: size,
            height,
          },
          viewed && styles.viewedCard,
        ]}
      >
        {/* Story background */}
        {uri ? (
          <Image
            source={{ uri }}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text
              style={[
                styles.initial,
                {
                  fontSize: size * 0.28,
                },
              ]}
            >
              {initial}
            </Text>
          </View>
        )}

        {/* Own story + button */}
        {isOwn && (
          <View style={styles.addButton}>
            <Text style={styles.addText}>+</Text>
          </View>
        )}

        {/* Bottom user info */}
        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            {uri ? (
              <Image
                source={{ uri }}
                resizeMode="cover"
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            )}
          </View>

          <Text numberOfLines={1} style={styles.name}>
            {displayName}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },

  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#E9E9E9",
    borderWidth: 1,
    borderColor: "#E2E2E2",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  viewedCard: {
    borderColor: "#D2D2D2",
    opacity: 0.88,
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDEDED",
  },

  initial: {
    color: "#111111",
    fontWeight: "800",
  },

  /* Modern centered + button */
  addButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 30,
    height: 30,
    marginLeft: -15,
    marginTop: -15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#1c1c1ccb",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 5,
  },

  addText: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "400",
    marginTop: -2,
  },

  /* Bottom-left identity */
  userInfo: {
    position: "absolute",
    left: 9,
    right: 9,
    bottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  avatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
  },

  avatarInitial: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "800",
  },

  name: {
    flex: 1,
    marginLeft: 7,
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.65)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
});
