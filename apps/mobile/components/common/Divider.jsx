import { View, Text, StyleSheet } from "react-native";

export default function Divider({
  label,
  spacing = 24,
  color = "#E5E5E5",
  labelColor = "#A1A1AA",
}) {
  return (
    <View style={[styles.container, { marginVertical: spacing }]}>
      <View style={[styles.line, { backgroundColor: color }]} />

      {label ? (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      ) : null}

      <View style={[styles.line, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: "600",
  },
});
