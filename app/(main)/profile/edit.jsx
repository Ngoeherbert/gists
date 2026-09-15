// app/(main)/profile/edit.jsx
// Edit the signed-in user's profile: avatar, name, username, bio and links.

import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import colors from "../../../constants/colors";
import config from "../../../constants/config";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useAuthStore from "../../../stores/authStore";
import useProfileStore from "../../../stores/profileStore";
import useAppStore from "../../../stores/appStore";
import { Header } from "../../../components/common";
import { Avatar, Button, Input, Text } from "../../../components/ui";
import { validateName, validateUsername } from "../../../utils/validators";

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const saveProfile = useProfileStore((s) => s.saveProfile);
  const showToast = useAppStore((s) => s.showToast);

  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl ?? null);
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const pickAvatar = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast("Allow photo access to change your picture", "warning");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) setAvatarUri(result.assets[0].uri);
  }, [showToast]);

  const save = useCallback(async () => {
    const next = {
      name: validateName(name),
      username: validateUsername(username),
    };
    setErrors(next);
    if (next.name || next.username) return;

    setIsSaving(true);
    const patch = {
      name: name.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
      avatarUrl: avatarUri,
    };
    await saveProfile({ patch });
    updateUser(patch);
    setIsSaving(false);

    showToast("Profile updated", "success");
    router.back();
  }, [name, username, bio, avatarUri, saveProfile, updateUser, showToast, router]);

  return (
    <View style={styles.container}>
      <Header
        title="Edit profile"
        showBack
        right={<Button title="Save" size="small" loading={isSaving} onPress={save} />}
      />

      <View style={styles.body}>
        <View style={styles.avatarBlock}>
          <Pressable onPress={pickAvatar} style={styles.avatarPress}>
            <Avatar uri={avatarUri} name={name || username} size="xxl" />
            <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={layout.iconSize.sm} color={colors.white} />
            </View>
          </Pressable>
          <Button title="Change photo" variant="link" size="small" onPress={pickAvatar} />
        </View>

        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          leftIcon="person-outline"
          maxLength={60}
        />

        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          error={errors.username}
          leftIcon="at-outline"
          autoCapitalize="none"
          maxLength={24}
          containerStyle={styles.field}
        />

        <Input
          label="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          maxLength={config.limits.maxBioLength}
          helperText={`${bio.length}/${config.limits.maxBioLength}`}
          containerStyle={styles.field}
        />

        <Text variant="caption" color="tertiary" style={styles.note}>
          Changes are saved to your profile immediately.
        </Text>
      </View>
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
  avatarBlock: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatarPress: {
    marginBottom: spacing.sm,
  },
  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.background,
  },
  field: {
    marginTop: spacing.md,
  },
  note: {
    marginTop: spacing.xl,
  },
});
