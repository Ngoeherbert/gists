import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function formatCount(value) {
  const number = Number(value) || 0;

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`;
  }

  return String(number);
}

export default function ProfileStats({
  posts = 0,
  followers = 0,
  following = 0,
  onPostsPress,
  onFollowersPress,
  onFollowingPress,
}) {
  const stats = [
    {
      label: "Posts",
      value: posts,
      onPress: onPostsPress,
    },
    {
      label: "Followers",
      value: followers,
      onPress: onFollowersPress,
    },
    {
      label: "Following",
      value: following,
      onPress: onFollowingPress,
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => {
        const content = (
          <>
            <Text style={styles.value}>{formatCount(stat.value)}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </>
        );

        return (
          <React.Fragment key={stat.label}>
            {stat.onPress ? (
              <Pressable
                onPress={stat.onPress}
                style={({ pressed }) => [
                  styles.stat,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${stat.value} ${stat.label}`}
              >
                {content}
              </Pressable>
            ) : (
              <View style={styles.stat}>{content}</View>
            )}

            {index < stats.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
  },

  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },

  value: {
    color: "#000",
    fontSize: 17,
    fontWeight: "800",
  },

  label: {
    color: "#777",
    fontSize: 12,
    marginTop: 3,
  },

  separator: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E5E5",
  },

  pressed: {
    opacity: 0.6,
  },
});
