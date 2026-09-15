// app/(main)/profile/settings/blocked.jsx
// Blocked accounts list, driven by profileStore.blocked.

import React from "react";
import { StyleSheet, View } from "react-native";
import useAppTheme from "../../../../hooks/useAppTheme";
import useProfileStore from "../../../../stores/profileStore";
import { Header, Screen } from "../../../../components/common";
import { Button, EmptyState } from "../../../../components/ui";

export default function BlockedAccountsScreen() {
  const { theme, isDark } = useAppTheme();
  const blocked = useProfileStore((s) => s.blocked);
  const toggleBlock = useProfileStore((s) => s.toggleBlock);

  return (
    <View style={styles.container}>
      <Header title="Blocked accounts" showBack />

      <Screen scroll padded={false}>
        {blocked.length === 0 ? (
          <EmptyState
            icon="ban-outline"
            title="No blocked accounts"
            description="People you block won't be able to find or message you."
          />
        ) : (
          <View style={styles.list}>
            {blocked.map((userId) => (
              <View key={userId} style={styles.row}>
                <Button
                  title={`Unblock ${userId}`}
                  variant="outline"
                  size="small"
                  onPress={() => toggleBlock(userId)}
                />
              </View>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  row: {
    marginBottom: 12,
  },
});
