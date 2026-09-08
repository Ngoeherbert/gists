import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import SettingsItem from "../../../../components/settings/SettingsItem";
import SettingsSection from "../../../../components/settings/SettingsSection";

const NOTIFICATIONS_ENABLED = true;
const PRIVATE_ACCOUNT = false;
const TWO_FACTOR = false;

export default function SettingsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(NOTIFICATIONS_ENABLED);
  const [privateAccount, setPrivateAccount] = useState(PRIVATE_ACCOUNT);
  const [twoFactor, setTwoFactor] = useState(TWO_FACTOR);

  const handleAccount = useCallback(() => {
    router.push("/(main)/profile/settings/account");
  }, [router]);

  const handlePrivacy = useCallback(() => {
    router.push("/(main)/profile/settings/privacy");
  }, [router]);

  const handleSecurity = useCallback(() => {
    router.push("/(main)/profile/settings/security");
  }, [router]);

  const handleNotifications = useCallback(() => {
    router.push("/(main)/profile/settings/notifications");
  }, [router]);

  const handleContent = useCallback(() => {
    router.push("/(main)/profile/settings/content");
  }, [router]);

  const handleChat = useCallback(() => {
    router.push("/(main)/profile/settings/chat");
  }, [router]);

  const handleBlocked = useCallback(() => {
    router.push("/(main)/profile/settings/blocked");
  }, [router]);

  const handleAbout = useCallback(() => {
    router.push("/(main)/profile/settings/about");
  }, [router]);

  const handleSupport = useCallback(() => {
    router.push("/(main)/profile/settings/support");
  }, [router]);

  const handleLogout = useCallback(() => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => Alert.alert("Logged out", "You have been logged out."),
      },
    ]);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "Delete account",
      "This action cannot be undone. All your data will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            Alert.alert("Account deleted", "Your account has been deleted."),
        },
      ],
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text style={styles.topBarTitle}>Settings</Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SettingsSection title="Account">
          <SettingsItem
            label="Account"
            description="Manage your account details"
            icon="person-outline"
            onPress={handleAccount}
            chevron
          />
          <SettingsItem
            label="Privacy"
            description="Profile visibility and interactions"
            icon="lock-closed-outline"
            onPress={handlePrivacy}
            chevron
            rightElement={
              <Switch
                value={privateAccount}
                onValueChange={setPrivateAccount}
                trackColor={{
                  false: "#E5E5E5",
                  true: "#111111",
                }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsItem
            label="Security"
            description="Password and login options"
            icon="shield-checkmark-outline"
            onPress={handleSecurity}
            chevron
            rightElement={
              <Switch
                value={twoFactor}
                onValueChange={setTwoFactor}
                trackColor={{
                  false: "#E5E5E5",
                  true: "#111111",
                }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            label="Notifications"
            description="Push, email, and in-app alerts"
            icon="notifications-outline"
            onPress={handleNotifications}
            chevron
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: "#E5E5E5",
                  true: "#111111",
                }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsItem
            label="Content preferences"
            description="Sensitive content and recommendations"
            icon="eye-outline"
            onPress={handleContent}
            chevron
          />
          <SettingsItem
            label="Chat settings"
            description="Messages, typing indicators, and sounds"
            icon="chatbubble-outline"
            onPress={handleChat}
            chevron
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            label="Blocked accounts"
            description="Manage blocked users"
            icon="ban-outline"
            onPress={handleBlocked}
            chevron
          />
          <SettingsItem
            label="Help and support"
            description="FAQs, contact us, report an issue"
            icon="help-circle-outline"
            onPress={handleSupport}
            chevron
          />
          <SettingsItem
            label="About"
            description="App version and legal info"
            icon="information-circle-outline"
            onPress={handleAbout}
            chevron
          />
        </SettingsSection>

        <SettingsSection title="Account actions">
          <SettingsItem
            label="Log out"
            description="Log out of your account"
            icon="log-out-outline"
            onPress={handleLogout}
            destructive
          />
          <SettingsItem
            label="Delete account"
            description="Permanently delete your account"
            icon="trash-outline"
            onPress={handleDeleteAccount}
            destructive
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  topBar: {
    height: 62,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  topBarTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },

  topBarSpacer: {
    width: 40,
  },

  content: {
    paddingBottom: 40,
    paddingTop: 12,
  },
});
