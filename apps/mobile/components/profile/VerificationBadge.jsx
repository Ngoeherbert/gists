import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VerificationBadge({ size = 18, color = "#000" }) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          marginLeft: size * 0.3,
        },
      ]}
      accessibilityLabel="Verified account"
    >
      <Ionicons name="checkmark" size={size * 0.62} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
