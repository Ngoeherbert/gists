import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CreatorStats({
  followers = 0,
  subscribers = 0,
  posts = 0,
  earnings = 0,
  currency = "$",
  onFollowersPress,
  onSubscribersPress,
  onPostsPress,
  onEarningsPress,
}) {
  const formatNumber = (value) => {
    if (typeof value !== "number") return String(value);

    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;

    return value.toLocaleString();
  };

  const stats = [
    {
      label: "Followers",
      value: formatNumber(followers),
      icon: "people-outline",
      onPress: onFollowersPress,
    },
    {
      label: "Subscribers",
      value: formatNumber(subscribers),
      icon: "star-outline",
      onPress: onSubscribersPress,
    },
    {
      label: "Posts",
      value: formatNumber(posts),
      icon: "grid-outline",
      onPress: onPostsPress,
    },
    {
      label: "Earnings",
      value: `${currency}${Number(earnings).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: "wallet-outline",
      onPress: onEarningsPress,
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.statWrapper}>
          <View
            accessible
            accessibilityRole={stat.onPress ? "button" : undefined}
            onTouchEnd={stat.onPress}
            style={styles.stat}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={stat.icon} size={18} color="#000" />
            </View>

            <Text style={styles.value} numberOfLines={1}>
              {stat.value}
            </Text>

            <Text style={styles.label} numberOfLines={1}>
              {stat.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },

  statWrapper: {
    flex: 1,
  },

  stat: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 82,
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  value: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 3,
  },

  label: {
    color: "#777",
    fontSize: 11,
    fontWeight: "500",
  },
});
