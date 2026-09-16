// components/profile/SettingsScreen.jsx
// Shared scaffold for settings sub-pages: a header, a scroll area and one or
// more grouped cards. Pages describe their content declaratively via `sections`.

import React from "react";
import { StyleSheet, View } from "react-native";
import spacing from "../../constants/spacing";
import { Header, Screen } from "../common";
import Card from "../ui/Card";
import Divider from "../ui/Divider";
import SettingsRow from "./SettingsRow";
import SettingSwitchRow from "./SettingSwitchRow";

export default function SettingsScreen({
  title,
  subtitle,
  sections = [],
  children,
}) {
  return (
    <View style={styles.container}>
      <Header title={title} subtitle={subtitle} showBack />

      <Screen scroll padded={false}>
        <View style={styles.body}>
          {sections.map((section, sectionIndex) => (
            <Card
              key={section.title ?? sectionIndex}
              padding="none"
              style={styles.group}
            >
              {section.rows.map((row, rowIndex) => {
                const RowComponent = row.switch
                  ? SettingSwitchRow
                  : SettingsRow;
                const { key, ...rest } = row;
                return (
                  <React.Fragment key={row.key ?? row.label}>
                    {rowIndex > 0 ? (
                      <Divider inset={spacing.cardPadding} />
                    ) : null}
                    <RowComponent key={key} {...rest} />
                  </React.Fragment>
                );
              })}
            </Card>
          ))}

          {children}
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: spacing.screenHorizontal,
  },
  group: {
    marginBottom: spacing.lg,
  },
});
