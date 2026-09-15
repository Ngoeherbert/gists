// app/(auth)/complete-profile.jsx
// Post-signup profile setup: avatar, display name, bio. Avatar picking uses
// expo-image-picker (already a dependency); the URL is kept in authStore.user.

import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import colors from "../../constants/colors";
import config from "../../constants/config";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useAppTheme from "../../hooks/useAppTheme";
import useAuthStore from "../../stores/authStore";
import useAppStore from "../../stores/appStore";
import { validateName } from "../../utils/validators";
import { Avatar, Button, Input, Text } from "../../components/ui";
import Screen from "../../components/common/Screen";
import AuthHeader from "../../components/auth/AuthHeader";

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const showToast = useAppStore((s) => s.showToast);

  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl || null);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const pickAvatar = useCallback(async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast("Allow photo access to choose a picture", "warning");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      showToast("Couldn't open your photos", "error");
    }
  }, [showToast]);

  const handleContinue = useCallback(async () => {
    const message = validateName(name);
    setError(message);
    if (message) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);

    updateUser({ name: name.trim(), bio: bio.trim(), avatarUrl: avatarUri });
    router.navigate("/(auth)/interests");
  }, [name, bio, avatarUri, updateUser, router]);

  return (
    <Screen scroll>
      <AuthHeader
        title="Complete your profile"
        subtitle="Add a face to the name so people know it's you."
        showBack={false}
      />

      <View style={styles.avatarBlock}>
        <Pressable onPress={pickAvatar} style={styles.avatarPress}>
          <Avatar uri={avatarUri} name={name || user?.username} size="xxl" />
          <View
            style={[
              styles.cameraBadge,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Ionicons
              name="camera"
              size={layout.iconSize.sm}
              color={colors.white}
            />
          </View>
        </Pressable>

        <Button
          title={avatarUri ? "Change photo" : "Add photo"}
          variant="link"
          size="small"
          onPress={pickAvatar}
        />
      </View>

      <Input
        label="Display name"
        placeholder="Ada Lovelace"
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (error) setError(validateName(v));
        }}
        error={error}
        leftIcon="person-outline"
        maxLength={60}
      />

      <Input
        label="Bio"
        placeholder="Tell people a little about yourself"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
        maxLength={config.limits.maxBioLength}
        helperText={`${bio.length}/${config.limits.maxBioLength}`}
        containerStyle={styles.field}
      />

      <Button
        title="Continue"
        icon="arrow-forward"
        iconPosition="right"
        size="large"
        fullWidth
        loading={isSaving}
        onPress={handleContinue}
        style={styles.submit}
      />

      <Button
        title="Skip for now"
        variant="ghost"
        fullWidth
        style={styles.skip}
        onPress={() => router.navigate("/(auth)/interests")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarBlock: {
    alignItems: "center",
    marginBottom: spacing.xxl,
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
  submit: {
    marginTop: spacing.xl,
  },
  skip: {
    marginTop: spacing.sm,
  },
});
