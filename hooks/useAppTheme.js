// hooks/useAppTheme.js
// Resolves the active theme object from the app store's themeMode, falling back
// to the OS scheme. Components consume this instead of importing themes directly
// so a manual light/dark toggle in settings takes effect app-wide.

import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "../constants/theme";
import colors from "../constants/colors";
import useAppStore from "../stores/appStore";

export default function useAppTheme() {
  const systemScheme = useColorScheme();
  const themeMode = useAppStore((state) => state.themeMode);

  const scheme = useMemo(
    () => (themeMode === "system" ? systemScheme ?? "dark" : themeMode),
    [themeMode, systemScheme],
  );

  const theme = useMemo(
    () => (scheme === "light" ? lightTheme : darkTheme),
    [scheme],
  );

  return useMemo(() => ({ theme, colors, isDark: theme.dark }), [theme]);
}
