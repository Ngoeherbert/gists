/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const DUMMY_NOTIFICATIONS = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Sarah Williams",
      username: "sarahw",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    text: "liked your post.",
    time: "2m",
    unread: true,
    postImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300",
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Michael Brown",
      username: "michaelb",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    text: 'commented: "This looks amazing!"',
    time: "15m",
    unread: true,
    postImage:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300",
  },
  {
    id: "3",
    type: "follow",
    user: {
      id: "jessica-miller",
      name: "Jessica Miller",
      username: "jessicam",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    text: "started following you.",
    time: "32m",
    unread: true,
  },
  {
    id: "4",
    type: "repost",
    user: {
      name: "David Wilson",
      username: "davidw",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    text: "reposted your post.",
    time: "1h",
    unread: false,
    postImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300",
  },
  {
    id: "5",
    type: "mention",
    user: {
      name: "Alex Johnson",
      username: "alexj",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    text: "mentioned you in a comment.",
    time: "2h",
    unread: false,
    postImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300",
  },
  {
    id: "6",
    type: "reaction",
    user: {
      name: "Emma Davis",
      username: "emmad",
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    text: "reacted to your story.",
    time: "3h",
    unread: false,
  },
  {
    id: "7",
    type: "follow",
    user: {
      id: "daniel-martin",
      name: "Daniel Martin",
      username: "danielm",
      avatar: "https://i.pravatar.cc/150?img=53",
    },
    text: "started following you.",
    time: "Yesterday",
    unread: false,
  },
];

const FILTERS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "mentions",
    label: "Mentions",
  },
];

const ICONS = {
  like: {
    name: "heart",
    color: "#111111",
  },
  comment: {
    name: "chatbubble",
    color: "#111111",
  },
  follow: {
    name: "person-add",
    color: "#111111",
  },
  repost: {
    name: "repeat",
    color: "#111111",
  },
  mention: {
    name: "at",
    color: "#111111",
  },
  reaction: {
    name: "happy",
    color: "#111111",
  },
};

export default function NotificationsScreen() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [menuVisible, setMenuVisible] = useState(false);

  const filteredNotifications =
    activeFilter === "mentions"
      ? notifications.filter((item) => item.type === "mention")
      : notifications;

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await new Promise((resolve) => setTimeout(resolve, 700));
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleNotificationPress = useCallback(
    (notification) => {
      setMenuVisible(false);

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                unread: false,
              }
            : item,
        ),
      );

      if (notification.type === "follow") {
        if (notification.user?.id) {
          router.push({
            pathname: "/(main)/profile",
            params: {
              userId: String(notification.user.id),
            },
          });
        }

        return;
      }

      if (notification.postImage) {
        console.log("Open notification post:", notification.id);
      }
    },
    [router],
  );

  const handleFollow = useCallback((notification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              following: true,
              unread: false,
            }
          : item,
      ),
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      })),
    );

    setMenuVisible(false);
  }, []);

  const handleClearNotifications = useCallback(() => {
    setNotifications([]);
    setMenuVisible(false);
  }, []);

  const renderNotification = (notification) => {
    const icon = ICONS[notification.type] || ICONS.like;

    return (
      <Pressable
        key={notification.id}
        onPress={() => handleNotificationPress(notification)}
        style={({ pressed }) => [
          styles.notification,
          notification.unread && styles.unreadNotification,
          pressed && styles.notificationPressed,
        ]}
      >
        {notification.unread ? <View style={styles.unreadDot} /> : null}

        <View style={styles.avatarWrapper}>
          {notification.user?.avatar ? (
            <Image
              source={{
                uri: notification.user.avatar,
              }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {notification.user?.name?.charAt(0)?.toUpperCase() || "G"}
              </Text>
            </View>
          )}

          <View style={styles.activityIcon}>
            <Ionicons name={icon.name} size={11} color={icon.color} />
          </View>
        </View>

        <View style={styles.notificationContent}>
          <Text numberOfLines={3} style={styles.notificationText}>
            <Text style={styles.userName}>
              {notification.user?.name ||
                notification.user?.username ||
                "Someone"}
            </Text>{" "}
            {notification.text}
          </Text>

          <Text style={styles.time}>{notification.time}</Text>

          {notification.type === "follow" && !notification.following ? (
            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                handleFollow(notification);
              }}
              style={({ pressed }) => [
                styles.followButton,
                pressed && styles.followButtonPressed,
              ]}
            >
              <Text style={styles.followButtonText}>Follow back</Text>
            </Pressable>
          ) : null}

          {notification.type === "follow" && notification.following ? (
            <View style={styles.followingButton}>
              <Text style={styles.followingText}>Following</Text>
            </View>
          ) : null}
        </View>

        {notification.postImage ? (
          <Image
            source={{
              uri: notification.postImage,
            }}
            style={styles.postThumbnail}
          />
        ) : null}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(main)/feeds")}
          hitSlop={10}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
        >
          <Ionicons name="arrow-back" size={23} color="#111111" />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>

          {unreadCount > 0 ? (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Three dot menu */}
        <View style={styles.menuWrapper}>
          <Pressable
            onPress={() => setMenuVisible((current) => !current)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <Ionicons name="ellipsis-horizontal" size={23} color="#111111" />
          </Pressable>

          {menuVisible ? (
            <>
              {/* Full-screen outside-click layer */}
              <Pressable
                style={styles.screenBackdrop}
                onPress={() => setMenuVisible(false)}
              />

              {/* Dropdown */}
              <View style={styles.menu}>
                <Pressable
                  onPress={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                    unreadCount === 0 && styles.menuItemDisabled,
                  ]}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons
                      name="checkmark-done-outline"
                      size={18}
                      color={unreadCount > 0 ? "#111111" : "#AAAAAA"}
                    />
                  </View>

                  <Text
                    style={[
                      styles.menuText,
                      unreadCount === 0 && styles.menuTextDisabled,
                    ]}
                  >
                    Mark all as read
                  </Text>
                </Pressable>

                <View style={styles.menuDivider} />

                <Pressable
                  onPress={handleClearNotifications}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons name="trash-outline" size={18} color="#111111" />
                  </View>

                  <Text style={styles.menuText}>Clear notifications</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.id;

            return (
              <Pressable
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[styles.filter, active && styles.activeFilter]}
              >
                <Text
                  style={[styles.filterText, active && styles.activeFilterText]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Notifications */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#111111"
          />
        }
        contentContainerStyle={
          filteredNotifications.length === 0
            ? styles.emptyContent
            : styles.content
        }
      >
        {filteredNotifications.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today</Text>
            </View>

            {filteredNotifications
              .filter((item) => item.time !== "Yesterday")
              .map(renderNotification)}

            {filteredNotifications.some((item) => item.time === "Yesterday") ? (
              <>
                <View style={[styles.sectionHeader, styles.earlierHeader]}>
                  <Text style={styles.sectionTitle}>Earlier</Text>
                </View>

                {filteredNotifications
                  .filter((item) => item.time === "Yesterday")
                  .map(renderNotification)}
              </>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-outline"
                size={32}
                color="#111111"
              />
            </View>

            <Text style={styles.emptyTitle}>No notifications</Text>

            <Text style={styles.emptyText}>
              You're all caught up. New activity will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 62,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 100,
  },

  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  headerButtonPressed: {
    backgroundColor: "#F4F4F4",
    transform: [{ scale: 0.94 }],
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  headerBadge: {
    minWidth: 20,
    height: 20,
    marginLeft: 7,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },

  menuWrapper: {
    position: "relative",
    zIndex: 200,
  },

  /*
   * Covers the entire screen while the dropdown
   * is open. It sits below the dropdown but above
   * the rest of the UI.
   */
  screenBackdrop: {
    position: "absolute",
    top: -1000,
    right: -1000,
    bottom: -1000,
    left: -1000,
    zIndex: 150,
  },

  menu: {
    position: "absolute",
    top: 44,
    right: 0,
    width: 205,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    zIndex: 300,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,

    elevation: 8,
  },

  menuItem: {
    minHeight: 48,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 5,
  },

  menuItemPressed: {
    backgroundColor: "#F5F5F5",
  },

  menuItemDisabled: {
    opacity: 0.7,
  },

  menuIcon: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  menuText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "600",
  },

  menuTextDisabled: {
    color: "#AAAAAA",
  },

  menuDivider: {
    height: 1,
    marginHorizontal: 12,
    backgroundColor: "#EEEEEE",
  },

  filterWrapper: {
    borderBottomWidth: 0,
  },

  filterContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 8,
  },

  filter: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
  },

  activeFilter: {
    backgroundColor: "#111111",
  },

  filterText: {
    color: "#777777",
    fontSize: 13,
    fontWeight: "700",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  content: {
    paddingBottom: 40,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
  },

  earlierHeader: {
    paddingTop: 26,
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
  },

  notification: {
    minHeight: 78,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  unreadNotification: {
    backgroundColor: "#FAFAFA",
  },

  notificationPressed: {
    backgroundColor: "#F5F5F5",
  },

  unreadDot: {
    position: "absolute",
    left: 8,
    top: 18,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#111111",
  },

  avatarWrapper: {
    width: 50,
    height: 50,
    position: "relative",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEEEEE",
  },

  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
  },

  activityIcon: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 21,
    height: 21,
    borderRadius: 10.5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 13,
    marginRight: 10,
  },

  notificationText: {
    color: "#555555",
    fontSize: 13.5,
    lineHeight: 19,
  },

  userName: {
    color: "#111111",
    fontWeight: "800",
  },

  time: {
    marginTop: 3,
    color: "#999999",
    fontSize: 11.5,
    fontWeight: "500",
  },

  postThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#EEEEEE",
  },

  followButton: {
    alignSelf: "flex-start",
    height: 32,
    paddingHorizontal: 15,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  followButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  followButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  followingButton: {
    alignSelf: "flex-start",
    height: 32,
    paddingHorizontal: 15,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  followingText: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 300,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 7,
    color: "#888888",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
