import { View, Text, StyleSheet } from "react-native";

export default function EmptyState({
  title = "Nothing here yet",
  description,
  icon,
  action,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}

      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  icon: {
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
  },
  description: {
    maxWidth: 340,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#777777",
    textAlign: "center",
  },
  action: {
    width: "100%",
    maxWidth: 300,
    marginTop: 24,
  },
});
