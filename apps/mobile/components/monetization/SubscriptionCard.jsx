import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SubscriptionCard({
  name = "Creator Subscription",
  price = 4.99,
  currency = "$",
  subscribers = 0,
  benefits = [],
  active = true,
  onPress,
}) {
  const formattedPrice = Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="star" size={21} color="#000" />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subscribers}>
            {Number(subscribers).toLocaleString()} subscriber
            {subscribers === 1 ? "" : "s"}
          </Text>
        </View>

        <View style={[styles.badge, !active && styles.inactiveBadge]}>
          <Text style={[styles.badgeText, !active && styles.inactiveText]}>
            {active ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>
          {currency}
          {formattedPrice}
        </Text>
        <Text style={styles.month}> / month</Text>
      </View>

      {benefits.length > 0 ? (
        <View style={styles.benefits}>
          {benefits.slice(0, 4).map((benefit, index) => (
            <View key={`${benefit}-${index}`} style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={17} color="#000" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {onPress ? (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Manage subscription</Text>
          <Ionicons name="chevron-forward" size={17} color="#fff" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    color: "#000",
    fontSize: 15,
    fontWeight: "800",
  },

  subscribers: {
    color: "#888",
    fontSize: 11,
    marginTop: 3,
  },

  badge: {
    backgroundColor: "#000",
    borderRadius: 13,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  inactiveBadge: {
    backgroundColor: "#eee",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  inactiveText: {
    color: "#777",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 22,
  },

  price: {
    color: "#000",
    fontSize: 28,
    fontWeight: "900",
  },

  month: {
    color: "#888",
    fontSize: 12,
  },

  benefits: {
    marginTop: 18,
    gap: 10,
  },

  benefit: {
    flexDirection: "row",
    alignItems: "center",
  },

  benefitText: {
    flex: 1,
    color: "#555",
    fontSize: 12,
    marginLeft: 8,
  },

  button: {
    height: 46,
    borderRadius: 23,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginRight: 8,
  },

  pressed: {
    opacity: 0.75,
  },
});
