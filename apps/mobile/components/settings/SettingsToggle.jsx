import React from "react";
import { StyleSheet, Switch } from "react-native";

import SettingsItem from "./SettingsItem";

export default function SettingsToggle({
  title,
  description,
  icon = "toggle-outline",
  value = false,
  onValueChange,
  disabled = false,
}) {
  return (
    <SettingsItem
      title={title}
      description={description}
      icon={icon}
      disabled={disabled}
      showChevron={false}
      onPress={() => {
        if (!disabled) {
          onValueChange?.(!value);
        }
      }}
      right={
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: "#D9D9D9",
            true: "#000",
          }}
          thumbColor="#fff"
          ios_backgroundColor="#D9D9D9"
          style={styles.switch}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});
