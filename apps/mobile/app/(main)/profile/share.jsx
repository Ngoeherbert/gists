import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createURL } from "expo-linking";
import QRCode from "react-native-qrcode-svg";

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

export default function ProfileQRCodeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const displayProfile = useMemo(
    () => ({
      ...DUMMY_PROFILE,
      isFollowing: DUMMY_PROFILE.isFollowing,
    }),
    [],
  );

  const qrValue = useMemo(
    () => createURL(`/feeds/profile/${encodeURIComponent(displayProfile.id)}`),
    [displayProfile.id],
  );

  const profileLink = useMemo(
    () => createURL(`/feeds/profile/${encodeURIComponent(displayProfile.id)}`),
    [displayProfile.id],
  );

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${displayProfile.name} (@${displayProfile.username})\n${profileLink}`,
        title: "Share profile",
      });
    } catch {
      Alert.alert("Error", "Unable to share profile.");
    }
  }, [displayProfile.name, displayProfile.username, profileLink]);

  const handleCopyLink = useCallback(async () => {
    try {
      // Clipboard can be added here when you install/use expo-clipboard.
      // await Clipboard.setStringAsync(profileLink);

      Alert.alert("Profile link", "Profile link copied successfully.");
    } catch {
      Alert.alert("Error", "Unable to copy profile link.");
    }
  }, [profileLink]);

  const handleSaveQRCode = useCallback(() => {
    setMenuVisible(false);

    Alert.alert(
      "Save QR code",
      "QR code image saving will be connected to the device photo library.",
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </Pressable>

        <Text style={styles.topBarTitle}>Profile QR code</Text>

        {/* Three dot menu */}
        <View style={styles.menuContainer}>
          <Pressable
            onPress={() => setMenuVisible((prev) => !prev)}
            hitSlop={10}
            style={styles.headerButton}
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#111111" />
          </Pressable>

          {menuVisible && (
            <View style={styles.menu}>
              <Pressable
                onPress={handleSaveQRCode}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <Ionicons name="download-outline" size={21} color="#111111" />

                <Text style={styles.menuItemText}>Save QR code</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile */}
        <View style={styles.profilePreview}>
          <Image
            source={{ uri: displayProfile.avatar }}
            style={styles.previewAvatar}
          />

          <Text style={styles.previewName}>{displayProfile.name}</Text>

          <Text style={styles.previewUsername}>@{displayProfile.username}</Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrSection}>
          <View style={styles.qrCard}>
            <QRCode
              value={qrValue}
              size={220}
              quietZone={14}
              backgroundColor="#FFFFFF"
            />
          </View>

          <Text style={styles.qrHint}>Scan to open this profile</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Share profile"
          >
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />

            <Text style={styles.primaryButtonText}>Share</Text>
          </Pressable>

          <Pressable
            onPress={handleCopyLink}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Copy profile link"
          >
            <Ionicons name="link-outline" size={20} color="#111111" />

            <Text style={styles.secondaryButtonText}>Copy link</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  topBar: {
    height: 62,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
    zIndex: 20,
  },

  headerButton: {
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

  menuContainer: {
    position: "relative",
    zIndex: 30,
  },

  menu: {
    position: "absolute",
    top: 46,
    right: 0,
    width: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,

    zIndex: 100,
  },

  menuItem: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  menuItemPressed: {
    backgroundColor: "#F6F6F6",
  },

  menuItemText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
  },

  content: {
    paddingBottom: 40,
    alignItems: "center",
  },

  profilePreview: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 28,
  },

  previewAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#EAEAEA",
  },

  previewName: {
    marginTop: 12,
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
  },

  previewUsername: {
    marginTop: 2,
    color: "#888888",
    fontSize: 14,
    fontWeight: "500",
  },

  qrSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  qrCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EEEEEE",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  qrHint: {
    marginTop: 14,
    color: "#888888",
    fontSize: 13,
    fontWeight: "500",
  },

  actions: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#111111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  secondaryButtonText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  secondaryButtonPressed: {
    backgroundColor: "#F7F7F7",
  },
});
