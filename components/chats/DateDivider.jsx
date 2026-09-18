// components/chats/DateDivider.jsx
// Centered "Today" / "Yesterday" / "12 September 2026" pill that opens each
// calendar day in a chat thread. Purely presentational — it never owns the
// touch responder, so long-presses still reach the bubble underneath.

import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import Text from "../ui/Text";
import { formatDayLabel } from "../../utils/chatDates";

function DateDivider({ date, label, style }) {
  const { isDark } = useAppTheme();
  // Callers may pass a ready-made label (a11y / tests / previews); otherwise
  // derive it from the timestamp.
  const text = label ?? formatDayLabel(date);
  if (!text) return null;

  return (
    <View style={styles.row} pointerEvents="none">
      <View
        style={[
          styles.pill,
          {
            backgroundColor: isDark ? colors.surfaceLight : "#EAEAF0",
            borderColor: isDark ? colors.border : "rgba(0,0,0,0.06)",
          },
          style,
        ]}
      >
        <Text
          variant="caption"
          color={isDark ? "secondary_text" : "tertiary"}
          style={styles.text}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screenHorizontal,
    // Sits between two bubbles: the surrounding rows already carry their own
    // bottom margins, so this only adds the divider's own breathing room.
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.round,
    borderWidth: layout.borderWidth.thin,
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

export default memo(DateDivider);