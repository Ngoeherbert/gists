import React from "react";
import { StyleSheet, View } from "react-native";
import BackButton from "./BackButton";
import HeaderTitle from "./HeaderTitle";

export default function Header({
  title,
  subtitle,
  left,
  right,
  onBack,
  showBack = false,
  centerTitle = true,
  transparent = false,
}) {
  const leftContent =
    left || (showBack ? <BackButton onPress={onBack} /> : null);

  return (
    <View style={[styles.container, transparent && styles.transparent]}>
      <View style={styles.side}>{leftContent}</View>

      <View style={[styles.center, !centerTitle && styles.leftAligned]}>
        <HeaderTitle title={title} subtitle={subtitle} centered={centerTitle} />
      </View>

      <View style={[styles.side, styles.rightSide]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  transparent: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },

  side: {
    width: 52,
    minHeight: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  rightSide: {
    alignItems: "flex-end",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  leftAligned: {
    alignItems: "flex-start",
  },
});
