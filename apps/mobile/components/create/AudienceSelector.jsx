// apps/mobile/components/create/AudienceSelector.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const OPTIONS = [
  {
    value: "public",
    label: "Everyone",
    description: "Anyone can see this",
    icon: "globe-outline",
  },
  {
    value: "followers",
    label: "Followers",
    description: "Only your followers can see this",
    icon: "people-outline",
  },
  {
    value: "private",
    label: "Only me",
    description: "Only you can see this",
    icon: "lock-closed-outline",
  },
];

export default function AudienceSelector({
  value = "public",
  onChange,
  options = OPTIONS,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audience</Text>

      <View style={styles.options}>
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange?.(option.value)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.selected,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={option.icon || "globe-outline"}
                  size={21}
                  color="#111111"
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.label}>{option.label}</Text>
                {option.description ? (
                  <Text style={styles.description}>{option.description}</Text>
                ) : null}
              </View>

              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    marginBottom: 12,
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },
  options: {
    gap: 8,
  },
  option: {
    minHeight: 68,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "transparent",
  },
  selected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#111111",
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAEAEA",
  },
  info: {
    flex: 1,
    marginLeft: 11,
  },
  label: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    marginTop: 3,
    color: "#777777",
    fontSize: 12,
  },
  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#AAAAAA",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#111111",
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#111111",
  },
});
