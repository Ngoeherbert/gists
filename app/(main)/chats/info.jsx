// app/(main)/chats/info.jsx
// WhatsApp-style conversation details: contact info, quick actions,
// settings, media, social, and account controls.

import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import colors from "../../../constants/colors";
import layout from "../../../constants/layout";
import spacing from "../../../constants/spacing";
import useAppTheme from "../../../hooks/useAppTheme";
import useAppStore from "../../../stores/appStore";
import useChatStore from "../../../stores/chatStore";
import { Header, Screen } from "../../../components/common";
import { Avatar, Card, Divider, IconButton, Text } from "../../../components/ui";

export default function ChatInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useAppTheme();
  const showToast = useAppStore((s) => s.showToast);

  const isAi = id === "ai";
  const conversation = useChatStore((s) => s.conversationsById[id]);
  const removeConversation = useChatStore((s) => s.removeConversation);
  const [disappearing, setDisappearing] = useState(false);
  const [fav, setFav] = useState(false);

  const participants = conversation?.participants ?? [];
  const isGroup = conversation?.type === "group";
  const peer = participants[0] ?? {};
  const name = conversation?.name || peer.name || "Conversation";
  const peerId = peer.id;

  const confirmBlock = () => {
    Alert.alert(
      "Block contact?",
      "You will no longer receive messages from this contact.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => showToast("Contact blocked", "success"),
        },
      ],
    );
  };

  const confirmReport = () => {
    Alert.alert(
      "Report contact?",
      "This will help us review the contact's behavior.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: () => showToast("Contact reported", "success"),
        },
      ],
    );
  };

  const heroAvatar = isGroup
    ? conversation?.avatarUrl || participants[0]?.avatarUrl
    : peer.avatarUrl;

  const onPressAvatar = () => {
    if (heroAvatar) {
      showToast("Full-size photo coming soon", "info");
    }
  };

  const onPressViewProfile = () => {
    if (peerId) {
      router.navigate(`/profile/${peerId}`);
    }
  };

  const renderAiState = () => (
    <>
      <View style={styles.aiHero}>
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={32} color={colors.white} />
          <View style={styles.aiOnlineBadge} />
        </View>
        <Text variant="title" style={styles.heroName}>
          Gists AI
        </Text>
        <Text variant="bodySmall" color="success" style={styles.heroAbout}>
          Always active
        </Text>
        <Text
          variant="bodyMedium"
          color="secondary_text"
          style={[styles.heroAbout, { marginTop: spacing.sm, maxWidth: "90%", textAlign: "center" }]}
        >
          Your on-device writing companion. Summarize chats, draft captions, and
          discover new creators — all without leaving Gists.
        </Text>
      </View>

      <View style={styles.quickActions}>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => showToast("Voice message coming soon", "info")}
        >
          <MaterialIcons
            name="multitrack-audio"
            size={22}
            color={colors.white}
          />
          <Text variant="caption" color={colors.white}>
            Audio
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => showToast("Share AI chat coming soon", "info")}
        >
          <Ionicons name="share-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Share
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => showToast("Search in AI chat coming soon", "info")}
        >
          <Ionicons name="search-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Search
          </Text>
        </Pressable>
      </View>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Preferences
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() =>
            showToast("AI voice customization coming soon", "info")
          }
        >
          <MaterialIcons
            name="multitrack-audio"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Voice customization
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Shared media coming soon", "info")}
        >
          <Ionicons
            name="image-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Shared media
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("AI notifications coming soon", "info")}
        >
          <Ionicons
            name="notifications-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Notifications
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => {
            setFav((v) => !v);
            showToast(
              fav ? "Removed from favorites" : "Added to favorites",
              "info",
            );
          }}
        >
          <Ionicons
            name={fav ? "star" : "star-outline"}
            size={layout.iconSize.md}
            color={fav ? colors.warning : theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Add to favorites
          </Text>
          <Switch
            value={fav}
            onValueChange={(v) => {
              setFav(v);
              showToast(
                v ? "Added to favorites" : "Removed from favorites",
                "info",
              );
            }}
            trackColor={{ true: colors.warning, false: colors.border }}
          />
        </Pressable>
      </Card>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Content
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() => showToast("Saved to photos", "success")}
        >
          <Ionicons
            name="download-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Save to photos
          </Text>
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => {
            Alert.alert("Clear chat?", "All messages will be cleared.", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Clear",
                style: "destructive",
                onPress: () => showToast("Chat cleared", "success"),
              },
            ]);
          }}
        >
          <Ionicons
            name="close-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Clear chat
          </Text>
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => {
            Alert.alert(
              "Delete chat?",
              "This conversation and its messages will be removed.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    removeConversation(id);
                    showToast("Chat deleted", "success");
                    router.back();
                  },
                },
              ],
            );
          }}
        >
          <Ionicons
            name="trash-outline"
            size={layout.iconSize.md}
            color={theme.status.error}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" color="error" style={styles.rowLabel}>
            Delete chat
          </Text>
        </Pressable>
      </Card>
    </>
  );

  const renderGroupState = () => (
    <>
      <Pressable onPress={onPressAvatar} style={styles.hero}>
        <Avatar uri={heroAvatar} name={name} size="huge" />
        <Text variant="title" style={styles.heroName}>
          {name}
        </Text>
        <Text variant="bodySmall" color="secondary_text">
          {participants.length} participants
        </Text>
        {conversation?.description ? (
          <Text
            variant="bodySmall"
            color="secondary_text"
            style={styles.heroAbout}
          >
            {conversation.description}
          </Text>
        ) : null}
      </Pressable>

      <View style={styles.quickActions}>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => showToast("Group info coming soon", "info")}
        >
          <Ionicons name="information-circle-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Group info
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => router.navigate(`/(main)/chats/call/voice?id=${id}`)}
        >
          <Ionicons name="call-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Voice
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => router.navigate(`/(main)/chats/call/video?id=${id}`)}
        >
          <Ionicons name="videocam-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Video
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => showToast("Search in chat coming soon", "info")}
        >
          <Ionicons name="search-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Search
          </Text>
        </Pressable>
      </View>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Shared Content
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() => showToast("Media gallery coming soon", "info")}
        >
          <Ionicons
            name="image-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Shared media
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Shared links coming soon", "info")}
        >
          <Ionicons
            name="link-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Shared links
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Shared docs coming soon", "info")}
        >
          <Ionicons
            name="document-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Shared documents
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Manage storage coming soon", "info")}
        >
          <Feather
            name="hard-drive"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Manage storage
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
      </Card>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Group Settings
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() => {
            setDisappearing((v) => !v);
            showToast(
              disappearing
                ? "Disappearing messages off"
                : "Messages will disappear in 7 days",
              "info",
            );
          }}
        >
          <MaterialCommunityIcons
            name="progress-clock"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <View style={styles.contactInfo}>
            <Text variant="bodyMedium">Disappearing messages</Text>
            <Text variant="caption" color="tertiary">
              {disappearing ? "7 days" : "Off"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Group notifications coming soon", "info")}
        >
          <Ionicons
            name="notifications-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Notifications
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Group permissions coming soon", "info")}
        >
          <Ionicons
            name="lock-closed-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Group permissions
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Edit group info coming soon", "info")}
        >
          <Ionicons
            name="create-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Edit group info
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
      </Card>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Members
      </Text>
      <Card padding="none" style={styles.group}>
        {participants.slice(0, 5).map((p, idx) => (
          <Pressable
            key={p.id || idx}
            style={styles.row}
            onPress={() => p.id && router.navigate(`/profile/${p.id}`)}
          >
            <Avatar uri={p.avatarUrl} name={p.name} size="md" />
            <Text variant="bodyMedium" style={styles.rowLabel}>
              {p.name}
            </Text>
            {p.id === conversation?.adminId && (
              <Text variant="caption" color="secondary_text">
                Admin
              </Text>
            )}
            <Ionicons
              name="chevron-forward"
              size={layout.iconSize.md}
              color={theme.text.tertiary}
            />
          </Pressable>
        ))}
        {participants.length > 5 && (
          <Pressable
            style={styles.row}
            onPress={() => showToast("View all members coming soon", "info")}
          >
            <Text variant="bodyMedium" style={styles.rowLabel}>
              View all {participants.length} members
            </Text>
            <Ionicons
              name="chevron-forward"
              size={layout.iconSize.md}
              color={theme.text.tertiary}
            />
          </Pressable>
        )}
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Add members coming soon", "info")}
        >
          <Ionicons
            name="person-add-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Add members
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Invite via link coming soon", "info")}
        >
          <Ionicons
            name="share-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Invite via link
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
      </Card>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Account
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() => showToast("Report group coming soon", "info")}
        >
          <Ionicons
            name="flag-outline"
            size={layout.iconSize.md}
            color={theme.status.error}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" color="error" style={styles.rowLabel}>
            Report group
          </Text>
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => {
            Alert.alert(
              "Exit group?",
              "You will no longer be a member of this group.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Exit",
                  style: "destructive",
                  onPress: () => {
                    removeConversation(id);
                    showToast("Left group", "success");
                    router.back();
                  },
                },
              ],
            );
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={layout.iconSize.md}
            color={theme.status.error}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" color="error" style={styles.rowLabel}>
            Exit group
          </Text>
        </Pressable>
      </Card>
    </>
  );

  const renderSingleUserState = () => (
    <>
      <Pressable onPress={onPressAvatar} style={styles.hero}>
        <Avatar uri={heroAvatar} name={name} size="huge" />
        <Text variant="title" style={styles.heroName}>
          {name}
        </Text>
        {peer.isOnline ? (
          <Text variant="bodySmall" color="success">
            Online
          </Text>
        ) : null}
        {peer.about ? (
          <Text
            variant="bodySmall"
            color="secondary_text"
            style={styles.heroAbout}
          >
            {peer.about}
          </Text>
        ) : null}
      </Pressable>

      <View style={styles.quickActions}>
        <Pressable
          style={styles.quickActionBtn}
          onPress={onPressViewProfile}
        >
          <Ionicons name="person" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            View profile
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => router.navigate(`/(main)/chats/call/voice?id=${id}`)}
        >
          <Ionicons name="call-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Voice
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => router.navigate(`/(main)/chats/call/video?id=${id}`)}
        >
          <Ionicons name="videocam-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Video
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => showToast("Search in chat coming soon", "info")}
        >
          <Ionicons name="search-outline" size={22} color={colors.white} />
          <Text variant="caption" color={colors.white}>
            Search
          </Text>
        </Pressable>
      </View>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Shared Content
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() => showToast("Media gallery coming soon", "info")}
        >
          <Ionicons
            name="image-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Shared media
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Shared links coming soon", "info")}
        >
          <Ionicons
            name="link-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Shared links
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Shared docs coming soon", "info")}
        >
          <Ionicons
            name="document-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Shared documents
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Manage storage coming soon", "info")}
        >
          <Feather
            name="hard-drive"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Manage storage
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
      </Card>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Preferences
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() => {
            setDisappearing((v) => !v);
            showToast(
              disappearing
                ? "Disappearing messages off"
                : "Messages will disappear in 7 days",
              "info",
            );
          }}
        >
          <MaterialCommunityIcons
            name="progress-clock"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <View style={styles.contactInfo}>
            <Text variant="bodyMedium">Disappearing messages</Text>
            <Text variant="caption" color="tertiary">
              {disappearing ? "7 days" : "Off"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Notification sound coming soon", "info")}
        >
          <Ionicons
            name="notifications-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Notifications
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Theme change coming soon", "info")}
        >
          <Ionicons
            name="color-palette-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Change theme
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => showToast("Encryption info coming soon", "info")}
        >
          <Ionicons
            name="lock-closed-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Encryption
          </Text>
          <Ionicons
            name="chevron-forward"
            size={layout.iconSize.md}
            color={theme.text.tertiary}
          />
        </Pressable>
      </Card>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Account
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() => showToast("Shared via contact card", "success")}
        >
          <Ionicons
            name="share-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Share contact
          </Text>
        </Pressable>
        <Divider />
        <Pressable style={styles.row} onPress={confirmBlock}>
          <Ionicons
            name="ban-outline"
            size={layout.iconSize.md}
            color={theme.status.error}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" color="error" style={styles.rowLabel}>
            Block contact
          </Text>
        </Pressable>
        <Divider />
        <Pressable style={styles.row} onPress={confirmReport}>
          <Ionicons
            name="flag-outline"
            size={layout.iconSize.md}
            color={theme.status.error}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" color="error" style={styles.rowLabel}>
            Report contact
          </Text>
        </Pressable>
      </Card>

      <Text variant="bodyMedium" style={styles.sectionLabel}>
        Chat Actions
      </Text>
      <Card padding="none" style={styles.group}>
        <Pressable
          style={styles.row}
          onPress={() => {
            Alert.alert("Clear chat?", "All messages will be cleared.", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Clear",
                style: "destructive",
                onPress: () => showToast("Chat cleared", "success"),
              },
            ]);
          }}
        >
          <Ionicons
            name="close-outline"
            size={layout.iconSize.md}
            color={theme.text.secondary}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" style={styles.rowLabel}>
            Clear chat
          </Text>
        </Pressable>
        <Divider />
        <Pressable
          style={styles.row}
          onPress={() => {
            Alert.alert(
              "Delete chat?",
              "This conversation and its messages will be removed.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    removeConversation(id);
                    showToast("Chat deleted", "success");
                    router.back();
                  },
                },
              ],
            );
          }}
        >
          <Ionicons
            name="trash-outline"
            size={layout.iconSize.md}
            color={theme.status.error}
            style={styles.rowIcon}
          />
          <Text variant="bodyMedium" color="error" style={styles.rowLabel}>
            Delete chat
          </Text>
        </Pressable>
      </Card>
    </>
  );

  return (
    <Screen
      scroll
      padded={false}
      header={
        <Header
          title={isAi ? "About Gists AI" : isGroup ? "Group info" : "Chat info"}
          showBack
          right={
            isAi ? null : (
              <IconButton
                name="ellipsis-horizontal"
                onPress={() => showToast("More options coming soon", "info")}
              />
            )
          }
        />
      }
    >
      <View style={styles.body}>
        {isAi ? renderAiState() : isGroup ? renderGroupState() : renderSingleUserState()}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  hero: { alignItems: "center", marginBottom: spacing.xl },
  heroName: { marginTop: spacing.md },
  heroAbout: { marginTop: spacing.xs, maxWidth: "80%" },
  aiHero: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },
  aiAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    position: "relative",
  },
  aiOnlineBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.online,
    borderWidth: 3,
    borderColor: colors.background,
  },
  aiActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  aiActionBtn: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    gap: spacing.iconTextGap,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 80,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickActionBtn: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    gap: spacing.iconTextGap,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 80,
  },
  group: { marginBottom: spacing.lg },
  sectionLabel: { marginTop: spacing.xl, marginBottom: spacing.md },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.cardPadding,
    paddingVertical: spacing.lg,
  },
  rowIcon: { marginRight: spacing.md },
  rowLabel: { flex: 1 },
  label: { flex: 1 },
  contactInfo: { flex: 1 },
});