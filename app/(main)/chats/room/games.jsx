// app/(main)/chats/room/games.jsx
// Mini-game picker for a gist room. Games are a listed feature; the actual
// game surfaces are not implemented yet, so this screen is a catalogue.

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import layout from "../../../../constants/layout";
import spacing from "../../../../constants/spacing";
import useAppTheme from "../../../../hooks/useAppTheme";
import useChatStore from "../../../../stores/chatStore";
import useAppStore from "../../../../stores/appStore";
import { Header, Screen } from "../../../../components/common";
import { Card, Text } from "../../../../components/ui";

const GAMES = [
  { id: "trivia", name: "Trivia", icon: "help-circle-outline", accent: colors.primary },
  { id: "draw", name: "Draw & guess", icon: "brush-outline", accent: colors.secondary },
  { id: "word", name: "Word race", icon: "text-outline", accent: colors.accent },
  { id: "quiz", name: "Quick quiz", icon: "flash-outline", accent: colors.success },
];

export default function RoomGamesScreen() {
  const { theme } = useAppTheme();
  const setActiveGame = useChatStore((s) => s.setActiveGame);
  const showToast = useAppStore((s) => s.showToast);

  return (
    <View style={styles.container}>
      <Header title="Games" showBack />

      <Screen scroll padded={false}>
        <View style={styles.body}>
          {GAMES.map((game) => (
            <Card
              key={game.id}
              pressable
              onPress={() => {
                setActiveGame(game.id);
                showToast(`${game.name} is coming soon`, "info");
              }}
              padding="large"
              style={styles.card}
            >
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: `${game.accent}1A` }]}>
                  <Ionicons name={game.icon} size={layout.iconSize.lg} color={game.accent} />
                </View>
                <Text variant="bodyMedium" style={styles.name}>
                  {game.name}
                </Text>
                <Ionicons name="chevron-forward" size={layout.iconSize.md} color={theme.text.tertiary} />
              </View>
            </Card>
          ))}
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
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: layout.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  name: {
    flex: 1,
  },
});
