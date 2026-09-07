/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  recentSearches as dummyRecentSearches,
  suggestedUsers,
  audioResults,
  placeResults,
  hashtagResults,
  trendingGists,
  discoverPosts,
  discoverCategories,
} from "../../../features/discover/dummyData";

export default function DiscoverScreen() {
  const router = useRouter();

  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const [recentSearches, setRecentSearches] = useState(dummyRecentSearches);
  const [following, setFollowing] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const query = search.trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    if (!query) return suggestedUsers;

    return suggestedUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query),
    );
  }, [query]);

  const filteredAudio = useMemo(() => {
    if (!query) return audioResults;

    return audioResults.filter(
      (audio) =>
        audio.title.toLowerCase().includes(query) ||
        audio.artist.toLowerCase().includes(query),
    );
  }, [query]);

  const filteredPlaces = useMemo(() => {
    if (!query) return placeResults;

    return placeResults.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.location.toLowerCase().includes(query),
    );
  }, [query]);

  const filteredHashtags = useMemo(() => {
    if (!query) return hashtagResults;

    return hashtagResults.filter((hashtag) =>
      hashtag.title.toLowerCase().includes(query),
    );
  }, [query]);

  const filteredTrending = useMemo(() => {
    if (!query) return trendingGists;

    return trendingGists.filter(
      (gist) =>
        gist.title.toLowerCase().includes(query) ||
        gist.username.toLowerCase().includes(query) ||
        gist.category.toLowerCase().includes(query),
    );
  }, [query]);

  const filteredPosts = useMemo(() => {
    if (!query) return discoverPosts;

    return discoverPosts.filter(
      (post) =>
        post.caption.toLowerCase().includes(query) ||
        post.user.name.toLowerCase().includes(query) ||
        post.user.username.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query),
    );
  }, [query]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await new Promise((resolve) => setTimeout(resolve, 700));
    } catch (error) {
      console.error("Failed to refresh discover:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleFollow = useCallback((userId) => {
    setFollowing((current) => {
      if (current.includes(userId)) {
        return current.filter((id) => id !== userId);
      }

      return [...current, userId];
    });
  }, []);

  const handleUserPress = useCallback(
    (user) => {
      if (!user?.id) return;

      router.push({
        pathname: "/(main)/profile",
        params: {
          userId: String(user.id),
        },
      });
    },
    [router],
  );

  const handlePostPress = useCallback(
    (post) => {
      if (!post?.id) return;

      router.push({
        pathname: "/(main)/feeds/post",
        params: {
          postId: String(post.id),
        },
      });
    },
    [router],
  );

  const handleTrendingPress = useCallback(
    (gist) => {
      if (!gist?.id) return;

      router.push({
        pathname: "/(main)/feeds/post",
        params: {
          postId: String(gist.id),
        },
      });
    },
    [router],
  );

  const handleRecentSearch = useCallback((value) => {
    setSearch(value);
    setSearchVisible(true);
  }, []);

  const handleClearRecentSearch = useCallback((value) => {
    setRecentSearches((current) => current.filter((item) => item !== value));
  }, []);

  const handleClearAllRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    const value = search.trim();

    if (!value) return;

    setRecentSearches((current) =>
      [
        value,
        ...current.filter((item) => item.toLowerCase() !== value.toLowerCase()),
      ].slice(0, 8),
    );
  }, [search]);

  const handleSearchButton = useCallback(() => {
    setSearchVisible((current) => !current);
  }, []);

  const handleTabPress = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const renderSectionHeader = (title, actionText, onAction) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {actionText ? (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          style={({ pressed }) => [
            styles.sectionAction,
            pressed && styles.sectionActionPressed,
          ]}
        >
          <Text style={styles.sectionActionText}>{actionText}</Text>
        </Pressable>
      ) : null}
    </View>
  );

  const renderAccounts = () => (
    <View style={styles.section}>
      {renderSectionHeader(query ? "Accounts" : "People you may know")}

      {filteredUsers.length === 0 ? (
        <EmptySection
          icon="person-outline"
          title="No accounts found"
          text="Try searching for another person."
        />
      ) : (
        filteredUsers.map((user) => {
          const isFollowing = following.includes(user.id);

          return (
            <View key={user.id} style={styles.userCard}>
              <Pressable
                onPress={() => handleUserPress(user)}
                style={styles.userMain}
              >
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.userAvatar}
                />

                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text numberOfLines={1} style={styles.userName}>
                      {user.name}
                    </Text>

                    {user.verified ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color="#111111"
                        style={styles.verifiedIcon}
                      />
                    ) : null}
                  </View>

                  <Text numberOfLines={1} style={styles.username}>
                    @{user.username}
                  </Text>

                  <Text numberOfLines={1} style={styles.userBio}>
                    {user.bio}
                  </Text>

                  {user.mutuals ? (
                    <Text style={styles.mutualText}>
                      {user.mutuals} mutual Gisties
                    </Text>
                  ) : null}
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleFollow(user.id)}
                style={({ pressed }) => [
                  styles.followButton,
                  isFollowing && styles.followingButton,
                  pressed && styles.followButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </Pressable>
            </View>
          );
        })
      )}
    </View>
  );

  const renderAudio = () => (
    <View style={styles.section}>
      {renderSectionHeader(query ? "Audio" : "Popular audio")}

      {filteredAudio.length === 0 ? (
        <EmptySection
          icon="musical-notes-outline"
          title="No audio found"
          text="Try another search."
        />
      ) : (
        filteredAudio.map((audio) => (
          <Pressable
            key={audio.id}
            style={({ pressed }) => [
              styles.audioCard,
              pressed && styles.itemPressed,
            ]}
          >
            <Image
              source={{ uri: audio.artwork }}
              style={styles.audioArtwork}
            />

            <View style={styles.audioInfo}>
              <Text numberOfLines={1} style={styles.audioTitle}>
                {audio.title}
              </Text>

              <Text numberOfLines={1} style={styles.audioArtist}>
                {audio.artist}
              </Text>

              <Text style={styles.audioUses}>
                {formatCount(audio.uses)} Gists • {audio.duration}
              </Text>
            </View>

            <Pressable style={styles.audioPlay} hitSlop={8}>
              <Ionicons name="play" size={17} color="#111111" />
            </Pressable>
          </Pressable>
        ))
      )}
    </View>
  );

  const renderPlaces = () => (
    <View style={styles.section}>
      {renderSectionHeader(query ? "Places" : "Popular places")}

      {filteredPlaces.length === 0 ? (
        <EmptySection
          icon="location-outline"
          title="No places found"
          text="Try another location."
        />
      ) : (
        filteredPlaces.map((place) => (
          <Pressable
            key={place.id}
            style={({ pressed }) => [
              styles.placeCard,
              pressed && styles.itemPressed,
            ]}
          >
            <Image source={{ uri: place.image }} style={styles.placeImage} />

            <View style={styles.placeInfo}>
              <Text style={styles.placeName}>{place.name}</Text>

              <Text style={styles.placeLocation}>{place.location}</Text>

              <Text style={styles.placePosts}>
                {formatCount(place.posts)} Gists
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
          </Pressable>
        ))
      )}
    </View>
  );

  const renderHashtags = () => (
    <View style={styles.section}>
      {renderSectionHeader(query ? "Hashtags" : "Popular hashtags")}

      {filteredHashtags.length === 0 ? (
        <EmptySection
          icon="pricetag-outline"
          title="No hashtags found"
          text="Try another hashtag."
        />
      ) : (
        filteredHashtags.map((hashtag, index) => (
          <Pressable
            key={hashtag.id}
            style={({ pressed }) => [
              styles.hashtagCard,
              pressed && styles.itemPressed,
            ]}
          >
            <View style={styles.hashtagRank}>
              <Text style={styles.hashtagRankText}>{index + 1}</Text>
            </View>

            <View style={styles.hashtagIcon}>
              <Text style={styles.hashtagSymbol}>#</Text>
            </View>

            <View style={styles.hashtagInfo}>
              <Text style={styles.hashtagTitle}>{hashtag.title}</Text>

              <Text style={styles.hashtagPosts}>
                {formatCount(hashtag.posts)} Gists
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
          </Pressable>
        ))
      )}
    </View>
  );

  const renderTrending = () => (
    <>
      <View style={styles.section}>
        {renderSectionHeader("Hot Gists", "See all", () =>
          setActiveTab("trending"),
        )}

        {filteredTrending.length === 0 ? (
          <EmptySection
            icon="flame-outline"
            title="No trending Gists found"
            text="Try another search."
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingContent}
          >
            {filteredTrending.map((gist) => (
              <Pressable
                key={gist.id}
                onPress={() => handleTrendingPress(gist)}
                style={({ pressed }) => [
                  styles.trendingCard,
                  pressed && styles.trendingCardPressed,
                ]}
              >
                <Image
                  source={{ uri: gist.image }}
                  style={styles.trendingImage}
                  resizeMode="cover"
                />

                <View style={styles.trendingOverlay}>
                  <View style={styles.trendingTop}>
                    <View style={styles.trendingBadge}>
                      <Ionicons name="flame" size={11} color="#FFFFFF" />

                      <Text style={styles.trendingBadgeText}>HOT GIST</Text>
                    </View>

                    <View style={styles.rankBadge}>
                      <Text style={styles.rankBadgeText}>#{gist.rank}</Text>
                    </View>
                  </View>

                  <View style={styles.trendingBottom}>
                    <View style={styles.trendingUser}>
                      <Image
                        source={{
                          uri: gist.avatar,
                        }}
                        style={styles.trendingAvatar}
                      />

                      <Text numberOfLines={1} style={styles.trendingUsername}>
                        @{gist.username}
                      </Text>
                    </View>

                    <Text numberOfLines={2} style={styles.trendingTitle}>
                      {gist.title}
                    </Text>

                    <Text style={styles.trendingCategory}>{gist.category}</Text>

                    <View style={styles.trendingStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="heart" size={12} color="#FFFFFF" />

                        <Text style={styles.statText}>
                          {formatCount(gist.likes)}
                        </Text>
                      </View>

                      <View style={styles.statItem}>
                        <Ionicons name="chatbubble" size={11} color="#FFFFFF" />

                        <Text style={styles.statText}>
                          {formatCount(gist.comments)}
                        </Text>
                      </View>

                      <View style={styles.statItem}>
                        <Ionicons name="repeat" size={12} color="#FFFFFF" />

                        <Text style={styles.statText}>
                          {formatCount(gist.reposts)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        {renderSectionHeader("More to explore")}

        <View style={styles.postGrid}>
          {filteredPosts.map((post) => (
            <Pressable
              key={post.id}
              onPress={() => handlePostPress(post)}
              style={({ pressed }) => [
                styles.postCard,
                pressed && styles.postCardPressed,
              ]}
            >
              <Image
                source={{ uri: post.image }}
                resizeMode="cover"
                style={styles.postImage}
              />

              <View style={styles.postOverlay}>
                <View style={styles.postUserRow}>
                  <Image
                    source={{
                      uri: post.user.avatar,
                    }}
                    style={styles.postAvatar}
                  />

                  <Text numberOfLines={1} style={styles.postUsername}>
                    @{post.user.username}
                  </Text>
                </View>

                <View style={styles.postBottom}>
                  <Text numberOfLines={2} style={styles.postCaption}>
                    {post.caption}
                  </Text>

                  <View style={styles.likesRow}>
                    <Ionicons name="heart" size={13} color="#FFFFFF" />

                    <Text style={styles.likesText}>
                      {formatCount(post.likes)}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );

  const renderActiveContent = () => {
    switch (activeTab) {
      case "accounts":
        return renderAccounts();

      case "audio":
        return renderAudio();

      case "places":
        return renderPlaces();

      case "hashtags":
        return renderHashtags();

      case "trending":
      default:
        return renderTrending();
    }
  };

  const showRecentSearches =
    searchVisible && search.trim().length === 0 && recentSearches.length > 0;

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
          accessibilityRole="button"
          accessibilityLabel="Back to feeds"
        >
          <Ionicons name="arrow-back" size={23} color="#111111" />
        </Pressable>

        <Text style={styles.headerTitle}>Discover</Text>

        <Pressable
          onPress={handleSearchButton}
          hitSlop={10}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open search"
        >
          <Ionicons name="search-outline" size={23} color="#111111" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#111111"
          />
        }
        contentContainerStyle={styles.content}
      >
        {/* Search */}
        {searchVisible ? (
          <View style={styles.searchArea}>
            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#777777" />

              <TextInput
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={handleSearchSubmit}
                autoFocus
                placeholder="Search Gists"
                placeholderTextColor="#999999"
                returnKeyType="search"
                style={styles.searchInput}
              />
            </View>

            {/* Recent searches */}
            {showRecentSearches ? (
              <View style={styles.recentSection}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle}>Recent searches</Text>

                  <Pressable onPress={handleClearAllRecentSearches} hitSlop={8}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                  </Pressable>
                </View>

                {recentSearches.map((item) => (
                  <View key={item} style={styles.recentItem}>
                    <Pressable
                      onPress={() => handleRecentSearch(item)}
                      style={styles.recentMain}
                    >
                      <View style={styles.recentIcon}>
                        <Ionicons
                          name="time-outline"
                          size={17}
                          color="#777777"
                        />
                      </View>

                      <Text numberOfLines={1} style={styles.recentText}>
                        {item}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleClearRecentSearch(item)}
                      hitSlop={10}
                      style={styles.recentRemove}
                    >
                      <Ionicons name="close" size={18} color="#999999" />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Discover tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {discoverCategories.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <Pressable
                key={tab.id}
                onPress={() => handleTabPress(tab.id)}
                style={[styles.discoverTab, active && styles.activeDiscoverTab]}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={active ? "#FFFFFF" : "#666666"}
                />

                <Text
                  style={[
                    styles.discoverTabText,
                    active && styles.activeDiscoverTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Content */}
        {renderActiveContent()}

        {/* Search empty state */}
        {query &&
        filteredUsers.length === 0 &&
        filteredAudio.length === 0 &&
        filteredPlaces.length === 0 &&
        filteredHashtags.length === 0 &&
        filteredTrending.length === 0 &&
        filteredPosts.length === 0 ? (
          <View style={styles.emptySearch}>
            <View style={styles.emptySearchIcon}>
              <Ionicons name="search-outline" size={30} color="#111111" />
            </View>

            <Text style={styles.emptySearchTitle}>Nothing found</Text>

            <Text style={styles.emptySearchText}>
              We couldn't find anything matching "{search.trim()}".
            </Text>
          </View>
        ) : null}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptySection({ icon, title, text }) {
  return (
    <View style={styles.emptySection}>
      <Ionicons name={icon} size={28} color="#999999" />

      <Text style={styles.emptySectionTitle}>{title}</Text>

      {text ? <Text style={styles.emptySectionText}>{text}</Text> : null}
    </View>
  );
}

function formatCount(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  if (number >= 1000000) {
    return `${(number / 1000000)
      .toFixed(number >= 10000000 ? 0 : 1)
      .replace(".0", "")}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000)
      .toFixed(number >= 10000 ? 0 : 1)
      .replace(".0", "")}K`;
  }

  return String(number);
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
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
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

  headerTitle: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },

  intro: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
  },

  introTitle: {
    color: "#111111",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  introText: {
    maxWidth: 380,
    marginTop: 7,
    color: "#777777",
    fontSize: 14,
    lineHeight: 21,
  },

  searchArea: {
    paddingTop: 16,
    paddingBottom: 4,
  },

  searchWrapper: {
    height: 52,
    marginHorizontal: 18,
    paddingHorizontal: 16,
    borderRadius: 26,
    backgroundColor: "#F4F4F4",
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    color: "#111111",
    fontSize: 15,
  },

  recentSection: {
    marginTop: 20,
    paddingHorizontal: 18,
  },

  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  recentTitle: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },

  clearAllText: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "700",
  },

  recentItem: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  recentMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  recentIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
  },

  recentText: {
    flex: 1,
    marginLeft: 10,
    color: "#333333",
    fontSize: 14,
    fontWeight: "500",
  },

  recentRemove: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  searchResultIntro: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 10,
  },

  searchResultTitle: {
    color: "#888888",
    fontSize: 12,
    fontWeight: "600",
  },

  searchResultQuery: {
    marginTop: 3,
    color: "#111111",
    fontSize: 21,
    fontWeight: "800",
  },

  tabsContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 2,
    gap: 8,
  },

  discoverTab: {
    height: 38,
    paddingHorizontal: 15,
    borderRadius: 19,
    backgroundColor: "#F4F4F4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  activeDiscoverTab: {
    backgroundColor: "#111111",
  },

  discoverTabText: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "700",
  },

  activeDiscoverTabText: {
    color: "#FFFFFF",
  },

  section: {
    marginTop: 26,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  sectionAction: {
    paddingVertical: 4,
    paddingLeft: 10,
  },

  sectionActionPressed: {
    opacity: 0.55,
  },

  sectionActionText: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "700",
  },

  userCard: {
    minHeight: 82,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userMain: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EAEAEA",
  },

  userInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 11,
  },

  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  userName: {
    flexShrink: 1,
    color: "#111111",
    fontSize: 13.5,
    fontWeight: "800",
  },

  verifiedIcon: {
    marginLeft: 4,
  },

  username: {
    marginTop: 1,
    color: "#777777",
    fontSize: 11.5,
    fontWeight: "500",
  },

  userBio: {
    marginTop: 3,
    color: "#999999",
    fontSize: 10.5,
  },

  mutualText: {
    marginTop: 3,
    color: "#777777",
    fontSize: 9.5,
    fontWeight: "600",
  },

  followButton: {
    minWidth: 76,
    height: 34,
    paddingHorizontal: 13,
    marginLeft: 8,
    borderRadius: 17,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  followingButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },

  followButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  followButtonText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "700",
  },

  followingButtonText: {
    color: "#555555",
  },

  audioCard: {
    minHeight: 72,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    alignItems: "center",
  },

  audioArtwork: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: "#EAEAEA",
  },

  audioInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },

  audioTitle: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
  },

  audioArtist: {
    marginTop: 2,
    color: "#666666",
    fontSize: 12,
    fontWeight: "500",
  },

  audioUses: {
    marginTop: 3,
    color: "#999999",
    fontSize: 10.5,
  },

  audioPlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  placeCard: {
    minHeight: 78,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    alignItems: "center",
  },

  placeImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#EAEAEA",
  },

  placeInfo: {
    flex: 1,
    marginLeft: 12,
  },

  placeName: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
  },

  placeLocation: {
    marginTop: 2,
    color: "#777777",
    fontSize: 11.5,
  },

  placePosts: {
    marginTop: 3,
    color: "#999999",
    fontSize: 10.5,
  },

  hashtagCard: {
    minHeight: 70,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    alignItems: "center",
  },

  hashtagRank: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  hashtagRankText: {
    color: "#999999",
    fontSize: 11,
    fontWeight: "800",
  },

  hashtagIcon: {
    width: 46,
    height: 46,
    marginLeft: 5,
    borderRadius: 23,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  hashtagSymbol: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  hashtagInfo: {
    flex: 1,
    marginLeft: 12,
  },

  hashtagTitle: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
  },

  hashtagPosts: {
    marginTop: 3,
    color: "#999999",
    fontSize: 10.5,
  },

  itemPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  trendingContent: {
    paddingHorizontal: 18,
    gap: 12,
  },

  trendingCard: {
    width: 270,
    height: 340,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
  },

  trendingCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  trendingImage: {
    width: "100%",
    height: "100%",
  },

  trendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  trendingTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  trendingBadge: {
    height: 25,
    paddingHorizontal: 9,
    borderRadius: 13,
    backgroundColor: "#111111",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  trendingBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  rankBadge: {
    minWidth: 32,
    height: 25,
    paddingHorizontal: 8,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  rankBadgeText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },

  trendingBottom: {
    width: "100%",
  },

  trendingUser: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  trendingAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  trendingUsername: {
    flex: 1,
    marginLeft: 7,
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
  },

  trendingTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  trendingCategory: {
    marginTop: 5,
    color: "rgba(255,255,255,0.8)",
    fontSize: 10.5,
    fontWeight: "600",
  },

  trendingStats: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  statText: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  postGrid: {
    paddingHorizontal: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  postCard: {
    width: "48.5%",
    aspectRatio: 0.86,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#EEEEEE",
  },

  postCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  postImage: {
    width: "100%",
    height: "100%",
  },

  postOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 11,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  postUserRow: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "90%",
  },

  postAvatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  postUsername: {
    flex: 1,
    marginLeft: 7,
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  postBottom: {
    width: "100%",
  },

  postCaption: {
    color: "#FFFFFF",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  likesRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  likesText: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  emptySection: {
    minHeight: 180,
    marginHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptySectionTitle: {
    marginTop: 10,
    color: "#333333",
    fontSize: 15,
    fontWeight: "800",
  },

  emptySectionText: {
    marginTop: 5,
    color: "#999999",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  emptySearch: {
    minHeight: 300,
    marginHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  emptySearchIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  emptySearchTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
  },

  emptySearchText: {
    maxWidth: 280,
    marginTop: 7,
    color: "#888888",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  bottomSpace: {
    height: 80,
  },
});
