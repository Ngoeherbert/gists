import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileAvatar({
  uri,
  name,
  size = 88,
  online = false,
  onPress,
  showOnline = false,
  border = false,
}) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  const content = (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        border && styles.border,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <Text
          style={[
            styles.initial,
            {
              fontSize: Math.max(18, size * 0.36),
            },
          ]}
        >
          {initial}
        </Text>
      )}

      {showOnline && (
        <View
          style={[
            styles.online,
            {
              width: Math.max(12, size * 0.2),
              height: Math.max(12, size * 0.2),
              borderRadius: Math.max(6, size * 0.1),
              right: size * 0.02,
              bottom: size * 0.02,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Open ${name || "profile"} picture`}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },

  image: {
    resizeMode: "cover",
  },

  initial: {
    color: "#555",
    fontWeight: "700",
  },

  border: {
    borderWidth: 3,
    borderColor: "#fff",
  },

  online: {
    position: "absolute",
    backgroundColor: "#20C66B",
    borderWidth: 2,
    borderColor: "#fff",
  },

  pressed: {
    opacity: 0.7,
  },
});
