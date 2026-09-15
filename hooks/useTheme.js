import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "../constants/theme";

export default function useTheme() {
  const systemScheme = useColorScheme();

  const theme = useMemo(() => {
    return systemScheme === "light" ? lightTheme : darkTheme;
  }, [systemScheme]);

  return theme;
}
