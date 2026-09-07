import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function KYCProgress({
  completed = 0,
  total = 4,
  title = "Verification progress",
  subtitle,
}) {
  const safeTotal = Math.max(Number(total) || 1, 1);
  const safeCompleted = Math.min(
    Math.max(Number(completed) || 0, 0),
    safeTotal,
  );

  const percentage = Math.round((safeCompleted / safeTotal) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {subtitle || `${safeCompleted} of ${safeTotal} steps completed`}
          </Text>
        </View>

        <View style={styles.percentageContainer}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#000" />
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.progress, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#eee",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#000",
    fontSize: 15,
    fontWeight: "800",
  },

  subtitle: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },

  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  percentage: {
    color: "#000",
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 5,
  },

  track: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 18,
  },

  progress: {
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 4,
  },
});
