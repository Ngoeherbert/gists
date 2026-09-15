// components/auth/OnboardingDots.jsx
// Page indicator for the onboarding carousel. The active dot stretches into a
// pill so the current page reads clearly.

import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import useAppTheme from "../../hooks/useAppTheme";

export default function OnboardingDots({ total = 3, active = 0, color }) {
  const { theme, isDark } = useAppTheme();
  const activeColor = color || theme.colors.primary;
  const inactiveColor = isDark ? colors.borderLight : theme.colors.border;

  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === active;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: isActive ? 22 : 8,
                backgroundColor: isActive ? activeColor : inactiveColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
