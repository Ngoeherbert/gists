import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EarningsCard({
  earnings = 0,
  pending = 0,
  available = 0,
  currency = "$",
  period = "This month",
  onPress,
  onWithdraw,
}) {
  const money = (value) =>
    `${currency}${Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.icon}>
            <Ionicons name="wallet-outline" size={20} color="#000" />
          </View>

          <View>
            <Text style={styles.title}>Earnings</Text>
            <Text style={styles.period}>{period}</Text>
          </View>
        </View>

        {onPress ? (
          <Pressable onPress={onPress} hitSlop={10}>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.amount}>{money(earnings)}</Text>

      <View style={styles.divider} />

      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Available</Text>
          <Text style={styles.breakdownValue}>{money(available)}</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Pending</Text>
          <Text style={styles.breakdownValue}>{money(pending)}</Text>
        </View>
      </View>

      {onWithdraw ? (
        <Pressable
          onPress={onWithdraw}
          style={({ pressed }) => [
            styles.withdrawButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="arrow-up-outline" size={18} color="#fff" />
          <Text style={styles.withdrawText}>Withdraw</Text>
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
    justifyContent: "space-between",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },

  period: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },

  amount: {
    color: "#000",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 22,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 18,
  },

  breakdown: {
    flexDirection: "row",
    alignItems: "center",
  },

  breakdownItem: {
    flex: 1,
  },

  breakdownLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },

  breakdownValue: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },

  verticalDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#eee",
    marginHorizontal: 18,
  },

  withdrawButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },

  withdrawText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },

  pressed: {
    opacity: 0.75,
  },
});
