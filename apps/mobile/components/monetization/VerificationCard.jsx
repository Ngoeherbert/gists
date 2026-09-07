import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VerificationCard({
  verified = false,
  status = "unverified",
  title = "Creator verification",
  description = "Verify your account to unlock additional creator features.",
  onPress,
}) {
  const isPending = status === "pending";
  const isRejected = status === "rejected";

  const resolvedTitle = verified
    ? "You are verified"
    : isPending
      ? "Verification pending"
      : isRejected
        ? "Verification needs attention"
        : title;

  const resolvedDescription = verified
    ? "Your creator account has been successfully verified."
    : description;

  const icon = verified
    ? "checkmark-circle"
    : isPending
      ? "time-outline"
      : isRejected
        ? "alert-circle-outline"
        : "shield-checkmark-outline";

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          verified && styles.verifiedIcon,
          isRejected && styles.rejectedIcon,
        ]}
      >
        <Ionicons
          name={icon}
          size={25}
          color={verified || isRejected ? "#fff" : "#000"}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{resolvedTitle}</Text>

          {verified ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#fff" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.description}>{resolvedDescription}</Text>

        {!verified && onPress ? (
          <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>
              {isPending ? "View status" : "Verify account"}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#eee",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  verifiedIcon: {
    backgroundColor: "#000",
  },

  rejectedIcon: {
    backgroundColor: "#d93025",
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "800",
  },

  verifiedBadge: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  verifiedText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 3,
  },

  description: {
    color: "#777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  button: {
    height: 42,
    borderRadius: 21,
    backgroundColor: "#000",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 14,
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginRight: 7,
  },

  pressed: {
    opacity: 0.75,
  },
});
