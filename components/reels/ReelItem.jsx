// components/reels/ReelItem.jsx
// One full-screen reel with real video playback (expo-video, SDK 54) and
// polished chrome: gradient poster until the first frame lands, legibility
// scrims, a glass action rail, a 3-dot options sheet (share / download /
// copy link / repost / report / hide), a spinning audio disc and a live
// scrubber fed by the player's own timeUpdate / sourceLoad events.
// polished chrome: gradient poster until the first frame lands, legibility
// scrims, a glass action rail, a spinning audio disc and a live scrubber fed
// by the player's own timeUpdate / sourceLoad events.
//
// Playback ownership stays with the parent pager: only the visible reel is
// `isActive`. Each row owns one `useVideoPlayer` instance; the active row
// plays (+ loops, unmuted so the phone's volume buttons own the audio),
// neighbours mount paused so their first frames pre-render. Reels without a
// `videoUri` fall back to the poster + preview clock (utils/reelVisuals.js).

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Modal, Pressable, Share, StyleSheet, Switch, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { VerifiedBadge } from "../../components/ui";

import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import colors from "../../constants/colors";
import layout from "../../constants/layout";
import spacing from "../../constants/spacing";
import useReelStore from "../../stores/reelStore";
import useProfileStore from "../../stores/profileStore";
import useAppStore from "../../stores/appStore";
import useAppTheme from "../../hooks/useAppTheme";
import { formatClock, formatCount } from "../../utils/formatters";
import {
  POSTER_END,
  POSTER_LOCATIONS,
  POSTER_START,
  reelAccent,
  reelDurationSeconds,
  reelPoster,
} from "../../utils/reelVisuals";
import { downloadReel, getCachedReelUri } from "../../utils/reelCache";
import Avatar from "../ui/Avatar";
import IconButton from "../ui/IconButton";
import Text from "../ui/Text";

// Frosted control treatment: translucent white fill + hairline highlight, so
// the rail stays readable on top of any poster.
const GLASS = "rgba(255, 255, 255, 0.16)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.22)";
const GLASS_STYLE = {
  borderWidth: layout.borderWidth.thin,
  borderColor: GLASS_BORDER,
};

// How often the poster-only preview clock advances. Real videos report their
// own position via timeUpdate instead.
const PREVIEW_TICK_MS = 250;

// Double-tap window for like-on-tap; long-press saves (slightly longer than
// the OS default so a slow single tap never saves by mistake).
const DOUBLE_TAP_MS = 300;
const LONG_PRESS_MS = 450;

function ReelItem({ reel, isActive, height, bottomInset = 0, shouldPreload = false, onReelEnd }) {
  const router = useRouter();

  const toggleLike = useReelStore((s) => s.toggleLike);
  const toggleSave = useReelStore((s) => s.toggleSave);
  const incrementShare = useReelStore((s) => s.incrementShare);
  const toggleRepost = useReelStore((s) => s.toggleRepost);
  const hideReel = useReelStore((s) => s.hideReel);
  const togglePlay = useReelStore((s) => s.togglePlay);
  const isPlaying = useReelStore((s) => s.isPlaying);
  const autoScrollEnabled = useReelStore((s) => s.autoScrollEnabled);
  const toggleAutoScroll = useReelStore((s) => s.toggleAutoScroll);
  const setPosition = useReelStore((s) => s.setPosition);
  const setDuration = useReelStore((s) => s.setDuration);

  const toggleFollow = useProfileStore((s) => s.toggleFollow);
  const showToast = useAppStore((s) => s.showToast);
  const { theme, isDark } = useAppTheme();

  // 3-dot options sheet state (share / download / copy link / repost /
  // report / hide) — the Modal lives at the bottom of the render tree.
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Every hook runs before the null guard so the hook order never changes.
  const author = reel?.author || {};
  const authorId = author.id;
  const isFollowing = useProfileStore((s) =>
    authorId ? s.following.includes(authorId) : false,
  );

  const videoUri = reel?.videoUri ?? null;
  const hasVideo = Boolean(videoUri);

  // One player per row, created with the reel's URI (null for poster-only
  // reels) and configured once: loop like TikTok/Reels, muted by default,
  // 4Hz time updates for the scrubber. Play/pause/mute/source swaps below
  // are imperative calls on this instance — never a re-creation.
  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
    // Audio rides the phone's media volume stream — the hardware volume
    // up/down buttons are the volume control (no in-app mute toggle).
    p.muted = false;
    p.timeUpdateEventInterval = 0.25;
  });

  const [firstFrame, setFirstFrame] = useState(false);
  const [status, setStatus] = useState("idle");
  const [playbackError, setPlaybackError] = useState(null);
  const [likeBurst, setLikeBurst] = useState(0);
  // Local (fully downloaded) copy of this reel's video, when ready. Once set,
  // the player upgrades to it at the next safe boundary — replays then never
  // touch the network.
  const [localUri, setLocalUri] = useState(null);

  const playing = Boolean(isActive && isPlaying);
  const buffering = hasVideo && !playbackError && !firstFrame && status === "loading";

  const poster = useMemo(() => reelPoster(reel?.id), [reel?.id]);
  const accent = useMemo(() => reelAccent(reel?.id), [reel?.id]);

  // Keep the poster painted until the native view renders its first frame,
  // then cross-fade it out. Reset per reel so recycled rows don't flash the
  // previous clip's "ready" state.
  useEffect(() => {
    setFirstFrame(false);
    setPlaybackError(null);
    setStatus("idle");
  }, [reel?.id]);

  // Swap the source when the row is recycled for another reel. replaceAsync
  // loads the asset off the UI thread on iOS (replace blocks it).
  const sourceRef = useRef(videoUri);
  useEffect(() => {
    if (sourceRef.current === videoUri) return;
    sourceRef.current = videoUri;
    setFirstFrame(false);
    setPlaybackError(null);
    setLocalUri(null);
    if (!videoUri) return;
    player.replaceAsync(videoUri).catch(() => {
      setPlaybackError("This video couldn't be loaded.");
    });
  }, [videoUri, player]);

  // TikTok-style prefetch: while the row sits near the viewport, pull the
  // full clip into the cache. Failures are silent — the remote stream keeps
  // working either way.
  useEffect(() => {
    if (!hasVideo || (!isActive && !shouldPreload)) return undefined;
    const cached = getCachedReelUri(videoUri);
    if (cached) {
      setLocalUri(cached);
      return undefined;
    }
    let cancelled = false;
    downloadReel(videoUri)
      .then((uri) => {
        if (!cancelled && uri) setLocalUri(uri);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [hasVideo, videoUri, isActive, shouldPreload]);

  // Upgrade the player to the downloaded copy, but only at safe boundaries —
  // never mid-playback. Inactive rows swap right away (reels restart when you
  // swipe back); the playing row swaps on its next playToEnd / re-activation.
  useEffect(() => {
    if (!localUri || sourceRef.current === localUri) return;
    if (isActive && playing) return;
    sourceRef.current = localUri;
    player.replaceAsync(localUri).catch(() => {});
  }, [localUri, isActive, playing, player]);

  // Active row plays, everything else pauses. `shouldPreload` neighbours stay
  // paused so ExoPlayer/AVPlayer pre-rolls without decoding audio — mounting
  // the player IS the prefetch on SDK 54 (no preloadAsync exists).
  useEffect(() => {
    if (!hasVideo) return;
    if (playing) {
      try {
        // A reel that finished while you were away restarts from the top
        // (TikTok-style) instead of sitting on its final frame.
        const total = player.duration ?? 0;
        const at = player.currentTime ?? 0;
        if (total > 0 && at >= total - 0.25) player.replay();
        else player.play();
      } catch {
        // Throws while the source is still loading; the status listener
        // below retries as soon as it is readyToPlay.
      }
    } else {
      player.pause();
    }
  }, [hasVideo, playing, player, reel?.id]);

  // With auto-scroll on, the reel hands playback to the next clip when it
  // ends — so looping must be off while the preference is enabled. The flag
  // is a live player property, so no re-creation is needed.
  useEffect(() => {
    player.loop = !autoScrollEnabled;
  }, [autoScrollEnabled, player]);

  // Feed the shared scrubber clock from the real player. Subscribing on the
  // active row only keeps 4Hz set() calls off every background row; inactive
  // rows report nothing so the store's position belongs to what is on screen.
  useEffect(() => {
    if (!isActive || !hasVideo) return undefined;

    const subs = [
      player.addListener("timeUpdate", ({ currentTime }) => {
        // Publish position AND the authoritative duration together each tick,
        // so the scrubber can never stall at 0% if a sourceLoad never fired
        // (or fired for a different source).
        if (Number.isFinite(currentTime)) setPosition(currentTime);
        const d = player.duration ?? 0;
        if (Number.isFinite(d) && d > 0) setDuration(d);
      }),
      player.addListener("sourceLoad", ({ duration }) => {
        if (Number.isFinite(duration) && duration > 0) setDuration(duration);
      }),
      player.addListener("statusChange", ({ status: next, error }) => {
        setStatus(next);
        if (next === "readyToPlay") {
          // Duration is authoritative the moment the source is ready.
          const d = player.duration ?? 0;
          if (Number.isFinite(d) && d > 0) setDuration(d);
          if (playing) {
            try {
              player.play();
            } catch {}
          }
        }
        if (next === "error") {
          setPlaybackError(error?.message || "This video couldn't be loaded.");
        }
      }),
      player.addListener("playToEnd", () => {
        // Auto-scroll hands playback to the next reel via the parent pager.
        if (autoScrollEnabled) {
          onReelEnd?.();
          return;
        }
        // Rewind into the downloaded copy when it's ready so the rewatch
        // plays from disk and can't trip on the network; otherwise loop.
        if (localUri && localUri !== sourceRef.current) {
          sourceRef.current = localUri;
          player
            .replaceAsync(localUri)
            .then(() => player.replay())
            .catch(() => {
              try {
                player.replay();
              } catch {}
            });
          return;
        }
        player.replay();
      }),
    ];
    return () => subs.forEach((sub) => sub.remove());
  }, [
    isActive,
    hasVideo,
    player,
    playing,
    setPosition,
    setDuration,
    autoScrollEnabled,
    onReelEnd,
    localUri,
  ]);

  // Preview clock for poster-only reels (no videoUri). Only the visible reel
  // ticks, mirroring the real-player subscription above.
  const elapsed = useRef(0);
  useEffect(() => {
    elapsed.current = 0;
    if (!hasVideo) setPosition(0);
  }, [reel?.id, hasVideo, setPosition]);

  useEffect(() => {
    if (!isActive || !isPlaying || hasVideo) return undefined;

    const duration = reelDurationSeconds(reel?.id);
    setDuration(duration);
    setPosition(elapsed.current);

    const timer = setInterval(() => {
      elapsed.current = (elapsed.current + PREVIEW_TICK_MS / 1000) % duration;
      setPosition(elapsed.current);
    }, PREVIEW_TICK_MS);

    return () => clearInterval(timer);
  }, [isActive, isPlaying, hasVideo, reel?.id, setDuration, setPosition]);

  // Fade the centre play control out while playing.
  const controlOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(controlOpacity, {
      toValue: playing ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [playing, controlOpacity]);

  // Big-heart burst for double-tap likes.
  const burstScale = useRef(new Animated.Value(0)).current;
  const burstOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!likeBurst) return;
    burstScale.setValue(0.4);
    burstOpacity.setValue(1);
    Animated.parallel([
      Animated.spring(burstScale, {
        toValue: 1.15,
        useNativeDriver: true,
        speed: 22,
        bounciness: 8,
      }),
      Animated.timing(burstOpacity, {
        toValue: 0,
        duration: 700,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [likeBurst, burstScale, burstOpacity]);

  // Spin the audio disc while the reel plays.
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!playing) return undefined;

    spin.setValue(0);
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    return () => loop.stop();
  }, [playing, spin]);

  const discRotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    toggleLike({ reelId: reel?.id });
  }, [toggleLike, reel?.id]);

  const fireLikeBurst = useCallback(() => {
    if (!reel?.isLiked) handleLike();
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setLikeBurst((n) => n + 1);
  }, [handleLike, reel?.isLiked]);

  // Single / double tap + long-press share one timer: single tap toggles
  // play, double tap likes with a heart burst, long-press saves.
  const lastTapAt = useRef(0);
  const tapTimer = useRef(null);
  useEffect(() => () => clearTimeout(tapTimer.current), []);

  const handleMediaPress = useCallback(() => {
    if (!isActive) return;
    const now = Date.now();
    if (now - lastTapAt.current < DOUBLE_TAP_MS) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      lastTapAt.current = 0;
      fireLikeBurst();
      return;
    }
    lastTapAt.current = now;
    tapTimer.current = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      togglePlay();
    }, DOUBLE_TAP_MS);
  }, [isActive, fireLikeBurst, togglePlay]);

  const handleLongPress = useCallback(() => {
    if (!isActive) return;
    clearTimeout(tapTimer.current);
    tapTimer.current = null;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    toggleSave({ reelId: reel?.id });
    showToast(reel?.isSaved ? "Removed from saved" : "Saved — find it in your profile", "info");
  }, [isActive, toggleSave, reel?.id, reel?.isSaved, showToast]);

  const handleRetry = useCallback(() => {
    if (!videoUri) return;
    setPlaybackError(null);
    player.replaceAsync(videoUri).catch(() => {
      setPlaybackError("This video couldn't be loaded.");
    });
  }, [player, videoUri]);

  // Single tap toggles play; double tap likes with a heart burst. A ref timer
  // distinguishes them without delaying single-tap beyond the tap window.
  // (Refs live just above.)

  const handleFollow = useCallback(() => {
    if (!authorId) return;
    Haptics.selectionAsync().catch(() => {});
    toggleFollow({ userId: authorId });
  }, [toggleFollow, authorId]);

  // Reshare = repost to your profile (same toggle as the sheet's Repost row).
  const handleReshare = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const willReshare = !reel?.isReposted;
    toggleRepost({ reelId: reel?.id });
    showToast(willReshare ? "Reshared to your profile" : "Reshare removed", "success");
  }, [toggleRepost, reel?.id, reel?.isReposted, showToast]);

  // ── 3-dot options sheet ──────────────────────────────────────────────────
  // Share / download / copy link / repost / report / hide. "Share" and
  // "Copy link" both use the gists://reel/<id> deep link.
  const openMenu = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const handleMenuShare = useCallback(async () => {
    setMenuVisible(false);
    incrementShare(reel?.id);
    const url = `gists://reel/${reel?.id}`;
    try {
      await Share.share({
        title: "Reel on Gists",
        message: `${reel?.caption ? `${reel.caption}\n` : ""}${url}`,
        url,
      });
    } catch {
      showToast("Couldn't open the share sheet", "error");
    }
  }, [incrementShare, reel?.id, reel?.caption, showToast]);

  const handleMenuDownload = useCallback(async () => {
    setMenuVisible(false);
    if (!videoUri) {
      showToast("This reel can't be downloaded yet", "info");
      return;
    }
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission?.granted) {
        showToast("Allow photo access to save reels", "error");
        return;
      }
      // Cache the transfer, then register the finished file with the system
      // gallery (SDK 54: File.downloadFileAsync replaces downloadAsync).
      const file = await File.downloadFileAsync(videoUri, Paths.cache, {
        idempotent: true,
      });
      await MediaLibrary.saveToLibraryAsync(file.uri);
      showToast("Saved to your gallery", "success");
    } catch {
      showToast("Download failed. Try again", "error");
    } finally {
      setIsDownloading(false);
    }
  }, [videoUri, isDownloading, showToast]);

  const handleMenuCopyLink = useCallback(async () => {
    setMenuVisible(false);
    try {
      await Clipboard.setStringAsync(`gists://reel/${reel?.id}`);
      showToast("Link copied", "success");
    } catch {
      showToast("Couldn't copy the link", "error");
    }
  }, [reel?.id, showToast]);

  const handleMenuRepost = useCallback(() => {
    setMenuVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const willRepost = !reel?.isReposted;
    toggleRepost({ reelId: reel?.id });
    showToast(willRepost ? "Reposted to your profile" : "Repost removed", "success");
  }, [toggleRepost, reel?.id, reel?.isReposted, showToast]);

  const handleMenuReport = useCallback(() => {
    setMenuVisible(false);
    showToast("Report submitted — thanks for letting us know", "info");
  }, [showToast]);

  const handleMenuHide = useCallback(() => {
    setMenuVisible(false);
    hideReel(reel?.id);
    showToast("You won't see this reel again", "info");
  }, [hideReel, reel?.id, showToast]);

  // Auto-scroll preference (3-dot sheet): flip the store flag; the player's
  // loop setting syncs in the effect above.
  const handleToggleAutoScroll = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
    toggleAutoScroll();
  }, [toggleAutoScroll]);

  const handleScrub = useCallback(
    (seconds) => {
      if (!hasVideo || !isActive) return;
      const clamped = Math.max(0, Number(seconds) || 0);
      try {
        player.currentTime = clamped;
      } catch {}
      setPosition(clamped);
    },
    [hasVideo, isActive, player, setPosition],
  );

  if (!reel) return null;

  const username = author.username || author.name || "user";
  const liked = Boolean(reel.isLiked);
  const saved = Boolean(reel.isSaved);
  const isReposted = Boolean(reel.isReposted);

  // Mount the native view for the active reel + neighbours so ExoPlayer /
  // AVPlayer pre-rolls the next clip while the current one plays. Distant rows
  // keep the cheap gradient poster — players stay bounded to visible rows.
  const mountVideo = hasVideo && (isActive || shouldPreload);
  const showPoster = !hasVideo || !firstFrame;

  return (
    <View style={[styles.wrap, { height }]}>
      <Pressable
        style={styles.media}
        onPress={handleMediaPress}
        onLongPress={handleLongPress}
        delayLongPress={LONG_PRESS_MS}
        accessibilityRole="image"
        accessibilityLabel={`Reel by ${username}${playing ? ", playing" : ", paused"}`}
        accessibilityHint="Double tap to like, long press to save, single tap to play or pause"
      >
        {/* Poster painted under the video until the first frame renders, and
            on its own for reels with no source yet. */}
        {showPoster ? (
          <LinearGradient
            colors={poster}
            locations={POSTER_LOCATIONS}
            start={POSTER_START}
            end={POSTER_END}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        {showPoster ? (
          <LinearGradient
            colors={[`${accent}55`, `${accent}00`]}
            start={{ x: 0.9, y: 0.1 }}
            end={{ x: 0.35, y: 0.85 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        ) : null}

        {mountVideo ? (
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
            allowsFullscreen={false}
            onFirstFrameRender={() => setFirstFrame(true)}
          />
        ) : null}

        {showPoster && !hasVideo ? (
          <View
            style={[StyleSheet.absoluteFill, styles.center]}
            pointerEvents="none"
          >
            <Ionicons
              name="film-outline"
              size={200}
              color="rgba(255,255,255,0.06)"
            />
          </View>
        ) : null}

        {buffering ? (
          <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
            <View style={styles.bufferChip}>
              <Ionicons name="reload" size={layout.iconSize.md} color={colors.white} />
            </View>
          </View>
        ) : null}

        {playbackError ? (
          <View style={[StyleSheet.absoluteFill, styles.center]}>
            <View style={styles.errorChip}>
              <Ionicons name="cloud-offline-outline" size={layout.iconSize.md} color={colors.white} />
              <Text variant="bodySmall" style={styles.errorText}>
                {playbackError}
              </Text>
              <Pressable onPress={handleRetry} accessibilityRole="button" accessibilityLabel="Retry video">
                <Text variant="bodySmall" style={styles.retryText}>
                  Retry
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.center,
            { opacity: controlOpacity },
          ]}
          pointerEvents="none"
        >
          <View style={styles.playControl}>
            <Ionicons
              name={playing ? "pause" : "play"}
              size={layout.iconSize.xxl - 8}
              color={colors.white}
              style={playing ? undefined : styles.playGlyph}
            />
          </View>
        </Animated.View>

        {/* Double-tap heart burst. */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.center,
            { opacity: burstOpacity, transform: [{ scale: burstScale }] },
          ]}
          pointerEvents="none"
        >
          <Ionicons name="heart" size={96} color={colors.like} />
        </Animated.View>
      </Pressable>

      {/* Scrims keep the header and the caption/rail legible on any frame. */}
      <LinearGradient
        colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0)"]}
        style={styles.topScrim}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.92)"]}
        locations={[0, 0.45, 1]}
        style={styles.bottomScrim}
        pointerEvents="none"
      />

      <View
        style={[styles.overlay, { paddingBottom: bottomInset }]}
        pointerEvents="box-none"
      >
        <View style={styles.overlayRow} pointerEvents="box-none">
          {/* Left: author, caption, audio */}
          <View style={styles.bottomLeft}>
            <View style={styles.authorRow}>
              <Pressable
                style={styles.authorIdentity}
                onPress={() => router.navigate(`/profile/${author.id ?? "me"}`)}
                accessibilityRole="button"
                accessibilityLabel={`View ${username}'s profile`}
              >
                <Avatar
                  uri={author.avatarUrl}
                  name={author.name || author.username}
                  size="sm"
                />
                {authorId && useProfileStore.getState().verifiedUsers[authorId] && (
                  <VerifiedBadge
                    size={20}
                    color={useProfileStore.getState().getVerifiedBadge(authorId).color}
                    iconName="verified"
                  />
                )}
                <Text
                  variant="bodyMedium"
                  numberOfLines={1}
                  style={styles.authorName}
                >
                  {username}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.followPill,
                  isFollowing ? styles.followPillActive : styles.followPillSolid,
                ]}
                onPress={handleFollow}
                accessibilityRole="button"
                accessibilityState={{ selected: isFollowing }}
                accessibilityLabel={
                  isFollowing ? `Unfollow ${username}` : `Follow ${username}`
                }
              >
                <Text
                  variant="caption"
                  style={
                    isFollowing
                      ? styles.followLabelActive
                      : styles.followLabelSolid
                  }
                >
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </Pressable>
            </View>

            {reel.caption ? (
              <Text variant="bodySmall" numberOfLines={2} style={styles.caption}>
                {reel.caption}
              </Text>
            ) : null}

            <View style={styles.audioRow}>
              <Animated.View
                style={[styles.disc, { transform: [{ rotate: discRotation }] }]}
              >
                <Ionicons
                  name="musical-notes"
                  size={layout.iconSize.xs - 2}
                  color={colors.white}
                />
              </Animated.View>

              <Text variant="caption" numberOfLines={1} style={styles.audioText}>
                {reel.audioName || "Original audio"}
              </Text>
            </View>
          </View>

          {/* Right: action rail */}
          <View style={styles.rail}>
            <RailAction
              icon={liked ? "heart" : "heart-outline"}
              color={liked ? colors.like : colors.white}
              label={formatCount(reel.likesCount ?? 0)}
              onPress={handleLike}
              accessibilityLabel={liked ? "Unlike reel" : "Like reel"}
            />
            <RailAction
              icon="chatbubble-outline"
              label={formatCount(reel.commentsCount ?? 0)}
              onPress={() => router.navigate(`/(main)/reels/comments/${reel.id}`)}
              accessibilityLabel="Comments"
            />
            <RailAction
              icon="repeat"
              provider="feather"
              color={isReposted ? colors.repost : colors.white}
              label={formatCount(reel.repostsCount ?? 0)}
              onPress={handleReshare}
              accessibilityLabel={isReposted ? "Remove reshare" : "Reshare reel"}
            />
            <RailAction
              icon={saved ? "bookmark" : "bookmark-outline"}
              color={saved ? colors.save : colors.white}
              onPress={() => toggleSave({ reelId: reel.id })}
              accessibilityLabel={saved ? "Remove from saved" : "Save reel"}
            />
            <RailAction
              icon="ellipsis-horizontal"
              compact
              onPress={openMenu}
              accessibilityLabel="Reel options"
            />
          </View>
        </View>

        <ReelScrubber isActive={isActive} onSeek={handleScrub} seekable={hasVideo && !playbackError} seed={reel?.id} />
      </View>

      {/* ── Options sheet (3-dot): share, download, copy link, repost,
          report and hide. Tap the backdrop or an action to dismiss. ── */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.sheetBackdrop} onPress={closeMenu}>
          <View style={styles.sheetContainer}>
            <View
              style={[
                styles.sheetContent,
                {
                  backgroundColor: isDark ? colors.surface : colors.white,
                  paddingBottom: spacing.lg + bottomInset,
                },
              ]}
            >
              <View style={styles.sheetHandle} />
              <SheetToggle
                label="Auto-scroll"
                description="Play the next reel when one ends"
                value={autoScrollEnabled}
                onValueChange={handleToggleAutoScroll}
              />
              <SheetItem
                divided
                icon="share-social-outline"
                label="Share"
                onPress={handleMenuShare}
              />
              <SheetItem
                icon="download-outline"
                label={isDownloading ? "Downloading…" : "Download"}
                onPress={handleMenuDownload}
              />
              <SheetItem
                icon="link-outline"
                label="Copy link"
                onPress={handleMenuCopyLink}
              />
              <SheetItem
                icon="repeat"
                label={isReposted ? "Remove repost" : "Repost"}
                color={isReposted ? colors.repost : null}
                onPress={handleMenuRepost}
              />
              <SheetItem
                icon="flag-outline"
                label="Report"
                color={theme.status.warning}
                divided
                onPress={handleMenuReport}
              />
              <SheetItem
                icon="eye-off-outline"
                label="Hide"
                onPress={handleMenuHide}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// The scrubber is the only transport UI and the only piece that reads the
// fast-changing playback state, so a 4x/second tick re-renders this leaf
// instead of the whole reel row.
//
// Custom, modern controls (expo-video's native controls stay off): a hairline
// track with a white fill and a knob that appears while you scrub, plus a
// floating elapsed / total readout above it.
//
// Scrubbing is relative and frame-smooth: the fill/knob run on one
// Animated.Value driven straight from the gesture — no React renders during
// the drag, and no store tick fighting your finger. Grab the track anywhere
// and slide: the knob moves from the playback position under your finger,
// clamped at both ends, so you can reach any second — including 0:00 and the
// very end. The player is seeked once on release with a soft landing.
const ReelScrubber = memo(function ReelScrubber({ isActive, onSeek, seekable = false, seed = "" }) {
  const position = useReelStore((s) => s.position);
  const duration = useReelStore((s) => s.duration);

  const trackRef = useRef(null);
  // Window-space anchor/width of the track plus the touch-down x of the
  // current gesture. Rows never move horizontally on this screen, so both
  // stay valid for the life of a drag.
  const geomRef = useRef({ x: 0, width: 1, touchX: 0 });
  const progressRef = useRef(0);
  const totalRef = useRef(0);
  const draggingRef = useRef(false);
  // The drag's start progress and its live value (0..1), mirrored so the
  // gesture callbacks never read stale state.
  const anchorRef = useRef(0);
  const dragValueRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  // Bubble text only — the moving parts are pure Animated and bypass React.
  const [dragSeconds, setDragSeconds] = useState(0);
  // 0..1 progress of the fill/knob, animated. useNativeDriver is off because
  // the value drives layout percent strings, not transforms.
  const animProgress = useRef(new Animated.Value(0)).current;
  // Hides the store-driven glide briefly after release so the settle spring
  // owns the bar and the next 4Hz tick can't snap it mid-flight.
  const settleAtRef = useRef(0);
  // Deterministic fallback total: used only until the player reports its real
  // duration — never zero, so the fill can never be pinned at 0%.
  const fallbackTotal = useMemo(() => reelDurationSeconds(seed), [seed]);

  const elapsed = isActive ? position : 0;
  const storeTotal = isActive ? duration : 0;
  const total = storeTotal > 0 ? storeTotal : fallbackTotal;
  const progress = total > 0 ? Math.min(1, elapsed / total) : 0;
  // Mirrored for the gesture callbacks so they never read stale state.
  progressRef.current = progress;
  totalRef.current = total;

  // Idle: the bar follows playback with a short glide, so the 4Hz ticks read
  // as continuous motion instead of discrete steps. Skipped while dragging
  // and just after release (the settle spring owns the bar then).
  useEffect(() => {
    if (draggingRef.current) return;
    if (Date.now() < settleAtRef.current) return;
    Animated.timing(animProgress, {
      toValue: progress,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
      isInteraction: false,
    }).start();
  }, [progress, animProgress]);

  const onGestureEvent = useCallback(
    (event) => {
      if (!draggingRef.current) return;
      // Relative scrubbing: progress moves from where playback was when you
      // touched, by however far your finger travels, clamped so you can slide
      // freely to any position — including past the edges (0 or full).
      const p = Math.min(
        1,
        Math.max(
          0,
          anchorRef.current + event.nativeEvent.translationX / (geomRef.current.width || 1),
        ),
      );
      dragValueRef.current = p;
      animProgress.setValue(p);
      setDragSeconds(p * totalRef.current);
    },
    [animProgress],
  );

  const onHandlerStateChange = useCallback(
    (event) => {
      const { state, absoluteX } = event.nativeEvent;
      if (state === State.BEGAN) {
        if (!seekable || totalRef.current <= 0) return;
        geomRef.current.touchX = absoluteX;
        anchorRef.current = progressRef.current;
        draggingRef.current = true;
        dragValueRef.current = progressRef.current;
        setDragSeconds(progressRef.current * totalRef.current);
        setDragging(true);
      } else if (
        draggingRef.current &&
        (state === State.END || state === State.CANCELLED || state === State.FAILED)
      ) {
        draggingRef.current = false;
        setDragging(false);
        onSeek?.(dragValueRef.current * totalRef.current);
        // Soft landing on the sought position; shield the bar from ticks for
        // a beat while the store catches up with the seek.
        settleAtRef.current = Date.now() + 320;
        Animated.spring(animProgress, {
          toValue: dragValueRef.current,
          friction: 9,
          tension: 60,
          useNativeDriver: false,
          isInteraction: false,
        }).start();
      }
    },
    [seekable, onSeek, animProgress],
  );

  // A tap without a drag jumps straight to the tapped position.
  const handleTrackPress = useCallback(
    (event) => {
      if (!seekable || totalRef.current <= 0) return;
      const p = Math.min(
        1,
        Math.max(0, (event.nativeEvent.locationX ?? 0) / (geomRef.current.width || 1)),
      );
      onSeek?.(p * totalRef.current);
    },
    [seekable, onSeek],
  );

  const readoutElapsed = dragging ? dragSeconds : elapsed;

  return (
    <View style={styles.scrubber} pointerEvents={seekable ? "auto" : "none"}>
      {dragging ? (
        <View style={styles.scrubberBubble} pointerEvents="none">
          <Text variant="caption" style={styles.scrubberTime}>
            {formatClock(readoutElapsed)} / {formatClock(total)}
          </Text>
        </View>
      ) : null}
      <PanGestureHandler
        enabled={seekable}
        activeOffsetX={12}
        failOffsetY={24}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Pressable
          style={styles.scrubberHit}
          onPress={handleTrackPress}
          disabled={!seekable}
          accessibilityRole="adjustable"
          accessibilityLabel="Scrub reel position"
        >
          <View
            ref={trackRef}
            style={styles.scrubberTrack}
            onLayout={(e) => {
              // Width for the drag math; measureInWindow also grabs the
              // window-space x once the row is attached to the screen.
              geomRef.current.width = e.nativeEvent.layout.width || 1;
              trackRef.current?.measureInWindow((x, _y, width) => {
                geomRef.current.x = x || 0;
                geomRef.current.width = width || geomRef.current.width;
              });
            }}
          >
            <Animated.View
              style={[
                styles.scrubberFill,
                {
                  width: animProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
            {dragging ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.scrubberKnob,
                  {
                    left: animProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            ) : null}
          </View>
        </Pressable>
      </PanGestureHandler>
    </View>
  );
});

function RailAction({
  icon,
  provider,
  label,
  color = colors.white,
  compact = false,
  onPress,
  accessibilityLabel,
}) {
  return (
    <View style={styles.railAction}>
      <IconButton
        icon={icon}
        provider={provider}
        size={compact ? "medium" : "large"}
        color={color}
        background={GLASS}
        style={GLASS_STYLE}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      />

      {label ? (
        <Text variant="caption" numberOfLines={1} style={styles.railLabel}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

// One row of the options sheet. An explicit `color` tints entries that need
// emphasis (active repost, report); everything else follows the theme text.
function SheetItem({ icon, label, color, divided = false, onPress }) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={[styles.sheetItem, divided ? styles.sheetItemDivided : null]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons
        name={icon}
        size={24}
        color={color || theme.text.primary}
        style={styles.sheetIcon}
      />
      <Text variant="bodyLarge" color={color || "default"}>
        {label}
      </Text>
    </Pressable>
  );
}

// The auto-scroll preference row: label + description on the left, the switch
// on the right. Stays open so the flip is visible; the player's loop flag
// syncs from the store automatically.
function SheetToggle({ label, description, value, onValueChange }) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.sheetItem}>
      <Ionicons
        name="play-forward"
        size={24}
        color={theme.text.primary}
        style={styles.sheetIcon}
      />
      <View style={styles.sheetToggleText}>
        <Text variant="bodyLarge" color="default">
          {label}
        </Text>
        {description ? (
          <Text variant="caption" color="secondary_text">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: theme.colors.primary, false: colors.border }}
      />
    </View>
  );
}

export default memo(ReelItem);

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    backgroundColor: colors.black,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  playControl: {
    width: 72,
    height: 72,
    borderRadius: layout.borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GLASS,
    borderWidth: layout.borderWidth.thin,
    borderColor: GLASS_BORDER,
  },
  playGlyph: {
    // Nudge the triangle onto the optical centre of the circle.
    marginLeft: 4,
  },
  topScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  bottomScrim: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 380,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
  },
  overlayRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bottomLeft: {
    flex: 1,
    justifyContent: "flex-end",
    marginRight: spacing.lg,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  authorIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  authorName: {
    marginLeft: spacing.sm,
    flexShrink: 1,
    color: colors.white,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowRadius: 6,
  },
  followPill: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.round,
    borderWidth: layout.borderWidth.thin,
  },
  followPillSolid: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  followPillActive: {
    backgroundColor: GLASS,
    borderColor: GLASS_BORDER,
  },
  followLabelSolid: {
    color: colors.black,
    fontWeight: "600",
  },
  followLabelActive: {
    color: "rgba(255,255,255,0.75)",
  },
  caption: {
    color: colors.white,
    marginBottom: spacing.sm,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowRadius: 6,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  disc: {
    width: 22,
    height: 22,
    borderRadius: layout.borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: layout.borderWidth.thin,
    borderColor: GLASS_BORDER,
    marginRight: spacing.sm,
  },
  audioText: {
    flexShrink: 1,
    color: "rgba(255,255,255,0.85)",
  },
  rail: {
    alignItems: "center",
    paddingBottom: spacing.xs,
  },
  railAction: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  railLabel: {
    color: colors.white,
    marginTop: spacing.xs,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowRadius: 6,
  },
  scrubber: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  scrubberBubble: {
    position: "absolute",
    top: -32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scrubberHit: {
    alignSelf: "stretch",
    paddingVertical: 10,
  },
  scrubberTrack: {
    height: 3,
    borderRadius: 2,
    overflow: "visible",
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  bufferChip: {
    width: 56,
    height: 56,
    borderRadius: layout.borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: layout.borderWidth.thin,
    borderColor: GLASS_BORDER,
  },
  errorChip: {
    alignItems: "center",
    maxWidth: 260,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: layout.borderWidth.thin,
    borderColor: GLASS_BORDER,
  },
  errorText: {
    marginTop: spacing.sm,
    textAlign: "center",
    color: "rgba(255,255,255,0.85)",
  },
  retryText: {
    marginTop: spacing.sm,
    color: colors.white,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  scrubberFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  scrubberKnob: {
    position: "absolute",
    top: -5,
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: -6,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  scrubberTime: {
    overflow: "hidden",
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    color: "rgba(255,255,255,0.92)",
    backgroundColor: "rgba(0,0,0,0.55)",
    fontVariant: ["tabular-nums"],
  },
  // ── Options sheet (3-dot modal) ──
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "transparent",
  },
  sheetHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sheetContent: {
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: layout.borderRadius.xl,
    borderTopRightRadius: layout.borderRadius.xl,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.md,
  },
  sheetItemDivided: {
    marginTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  sheetIcon: {
    width: 28,
    textAlign: "center",
  },
  sheetToggleText: {
    flex: 1,
  },
});
