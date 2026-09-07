import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotificationGroup({ title, children, count, right }) {
  return (
    <View style={styles.container}>
      {title || count !== undefined || right ? (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {title ? <Text style={styles.title}>{title}</Text> : null}

            {count !== undefined && count !== null ? (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}</Text>
              </View>
            ) : null}
          </View>

          {right}
        </View>
      ) : null}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },

  header: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 8,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    color: "#000",
    fontSize: 15,
    fontWeight: "800",
  },

  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: 7,
  },

  countText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },

  content: {
    width: "100%",
    gap: 8,
  },
});
