// components/profile/SettingSwitchRow.jsx
// A SettingsRow with a Switch as its trailing control. Used by the settings
// pages that toggle preferences.

import React, { useState } from "react";
import { Switch } from "react-native";
import colors from "../../constants/colors";
import useAppTheme from "../../hooks/useAppTheme";
import SettingsRow from "./SettingsRow";

export default function SettingSwitchRow({
  defaultValue = false,
  onChange,
  ...rest
}) {
  const { theme } = useAppTheme();
  const [value, setValue] = useState(defaultValue);

  return (
    <SettingsRow
      {...rest}
      showChevron={false}
      trailing={
        <Switch
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onChange?.(next);
          }}
          trackColor={{ true: theme.colors.primary, false: colors.border }}
        />
      }
    />
  );
}
