import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HeaderTitle({
  title,
  subtitle,
  centered = true,
  numberOfLines = 1,
}) {
  return (
    <View
      style={[
        styles.container,
        centered ? styles.centered : styles.leftAligned,
      ]}
    >
      <Text
        style={styles.title}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
      >
        {title}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "100%",
  },

  centered: {
    alignItems: "center",
  },

  leftAligned: {
    alignItems: "flex-start",
  },

  title: {
    color: "#000",
    fontSize: 18,
    fontWeight: "800",
  },

  subtitle: {
    color: "#888",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
});
