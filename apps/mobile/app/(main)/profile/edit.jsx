import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  currentUser,
  profile as sharedProfile,
} from "../../../features/posts/dummyData";

const DUMMY_PROFILE = {
  ...sharedProfile,
  id: currentUser.id,
  name: currentUser.name,
  username: currentUser.username,
  avatar: currentUser.avatar,
};

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState(DUMMY_PROFILE.name);
  const [username, setUsername] = useState(DUMMY_PROFILE.username);
  const [bio, setBio] = useState(DUMMY_PROFILE.bio || "");
  const [location, setLocation] = useState(DUMMY_PROFILE.location || "");
  const [website, setWebsite] = useState(DUMMY_PROFILE.website || "");

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your display name.");
      return;
    }

    if (!username.trim()) {
      Alert.alert("Username required", "Please enter a username.");
      return;
    }

    Alert.alert("Profile updated", "Your profile has been saved.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  }, [name, username, router]);

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

        <Text style={styles.topBarTitle}>Edit profile</Text>

        <Pressable
          onPress={handleSave}
          hitSlop={10}
          style={styles.saveButton}
          accessibilityRole="button"
          accessibilityLabel="Save changes"
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: DUMMY_PROFILE.avatar }}
                style={styles.avatar}
              />
              <View style={styles.avatarBadge}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#AAAAAA"
                autoCapitalize="words"
                maxLength={50}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.usernameInputWrapper}>
                <Text style={styles.usernamePrefix}>@</Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  style={styles.usernameInput}
                  placeholder="username"
                  placeholderTextColor="#AAAAAA"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                style={[styles.input, styles.textArea]}
                placeholder="Tell people a little about yourself"
                placeholderTextColor="#AAAAAA"
                autoCapitalize="sentences"
                maxLength={150}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.iconInputWrapper}>
                <View style={styles.inputIcon}>
                  <Ionicons name="location-outline" size={18} color="#888888" />
                </View>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  style={styles.iconInput}
                  placeholder="Add location"
                  placeholderTextColor="#AAAAAA"
                  autoCapitalize="words"
                  maxLength={60}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Website</Text>
              <View style={styles.iconInputWrapper}>
                <View style={styles.inputIcon}>
                  <Ionicons name="link-outline" size={18} color="#888888" />
                </View>
                <TextInput
                  value={website}
                  onChangeText={setWebsite}
                  style={styles.iconInput}
                  placeholder="https://example.com"
                  placeholderTextColor="#AAAAAA"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  maxLength={100}
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => {
              setName(DUMMY_PROFILE.name);
              setUsername(DUMMY_PROFILE.username);
              setBio(DUMMY_PROFILE.bio || "");
              setLocation(DUMMY_PROFILE.location || "");
              setWebsite(DUMMY_PROFILE.website || "");
            }}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset to default</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  flex: {
    flex: 1,
  },

  topBar: {
    height: 62,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
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

  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#111111",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  content: {
    paddingBottom: 40,
  },

  avatarSection: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 28,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#EAEAEA",
  },

  avatarBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  avatarHint: {
    marginTop: 10,
    color: "#888888",
    fontSize: 12,
    fontWeight: "500",
  },

  form: {
    paddingHorizontal: 18,
    gap: 20,
  },

  field: {
    gap: 8,
  },

  label: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },

  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#111111",
    fontSize: 15,
    backgroundColor: "#F8F8F8",
  },

  textArea: {
    minHeight: 90,
    paddingTop: 12,
  },

  usernameInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 14,
  },

  usernamePrefix: {
    color: "#888888",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 2,
  },

  usernameInput: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
    paddingVertical: 12,
  },

  iconInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    paddingLeft: 14,
  },

  inputIcon: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  iconInput: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
    paddingVertical: 12,
    paddingRight: 14,
  },

  resetButton: {
    marginTop: 32,
    marginHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  resetButtonText: {
    color: "#888888",
    fontSize: 14,
    fontWeight: "600",
  },
});
