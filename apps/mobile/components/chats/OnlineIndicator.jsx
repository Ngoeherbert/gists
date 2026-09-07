// apps/mobile/components/chats/OnlineIndicator.jsx
import { StyleSheet, View } from "react-native";

export default function OnlineIndicator({ online = false, size = 10, style }) {
  if (!online) return null;

  return (
    <View
      style={[
        styles.indicator,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: "#111111",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
