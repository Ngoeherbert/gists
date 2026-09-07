import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SettingsItem from "./SettingsItem";

export default function SettingsSelect({
  title,
  description,
  icon = "options-outline",
  value,
  placeholder = "Select",
  options = [],
  onChange,
  disabled = false,
}) {
  const selectedOption = options.find(
    (option) => option?.value === value || option?.key === value,
  );

  const displayValue =
    selectedOption?.label || selectedOption?.name || value || placeholder;

  const handlePress = () => {
    if (disabled) return;

    if (options.length === 0) {
      onChange?.(value);
      return;
    }

    // If a native/custom picker is added later,
    // this callback remains the integration point.
    onChange?.(value);
  };

  return (
    <SettingsItem
      title={title}
      description={description}
      icon={icon}
      disabled={disabled}
      onPress={handlePress}
      showChevron={false}
      right={
        <View style={styles.valueContainer}>
          <Text
            style={[
              styles.value,
              !selectedOption && !value && styles.placeholder,
            ]}
            numberOfLines={1}
          >
            {displayValue}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#999"
            style={styles.chevron}
          />
        </View>
      }
    />
  );
}

export function SettingsSelectOption({ label, selected = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && styles.selectedOption,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
        {label}
      </Text>

      {selected && <Ionicons name="checkmark" size={19} color="#000" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  valueContainer: {
    maxWidth: 150,
    flexDirection: "row",
    alignItems: "center",
  },

  value: {
    color: "#555",
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },

  placeholder: {
    color: "#999",
  },

  chevron: {
    marginLeft: 7,
  },

  option: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  selectedOption: {
    backgroundColor: "#F5F5F5",
  },

  optionText: {
    color: "#333",
    fontSize: 14,
  },

  selectedOptionText: {
    color: "#000",
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.65,
  },
});
