// tests/reelVisuals.test.cjs
// Guards for the reels player's presentation layer:
//   • utils/reelVisuals.js paints a deterministic poster + preview clock
//   • utils/formatters.js renders count / clock labels the way the UI expects
//   • reelStore ships a real "following" feed bucket instead of {}
//   • the reel player + pager actually render the modern chrome
//
// The helpers are executed straight from the shipped source, so these tests
// fail if the rules drift.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Load an ESM source file without changing the Expo app's package type.
function loadModule(relativePath) {
  const source = fs.readFileSync(path.join(__dirname, relativePath), "utf8");
  return import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );
}

const reelVisuals = loadModule("../utils/reelVisuals.js");
const formatters = loadModule("../utils/formatters.js");

const reelStoreSource = fs.readFileSync(
  path.join(__dirname, "../stores/reelStore.js"),
  "utf8",
);

test("formatCount compacts engagement numbers", async () => {
  const { formatCount } = await formatters;

  const cases = [
    [0, "0"],
    [7, "7"],
    [999, "999"],
    [1000, "1K"],
    [1200, "1.2K"],
    [12500, "12.5K"],
    [99999, "100K"],
    [125000, "125K"],
    [1000000, "1M"],
    [2400000, "2.4M"],
  ];

  for (const [input, expected] of cases) {
    assert.equal(formatCount(input), expected, `${input} -> ${expected}`);
  }

  // Missing / invalid counts must not leak "NaN" into the rail labels.
  assert.equal(formatCount(), "0");
  assert.equal(formatCount(undefined), "0");
  assert.equal(formatCount(null), "0");
  assert.equal(formatCount("nope"), "0");
  assert.equal(formatCount(-1500), "-1.5K");
});

test("formatClock renders a mm:ss clock and never NaN", async () => {
  const { formatClock } = await formatters;

  assert.equal(formatClock(0), "0:00");
  assert.equal(formatClock(7), "0:07");
  assert.equal(formatClock(63), "1:03");
  assert.equal(formatClock(125.9), "2:05");
  assert.equal(formatClock(3599), "59:59");

  for (const bad of [undefined, null, -4, "nope", NaN]) {
    assert.equal(formatClock(bad), "0:00", `${String(bad)} clamps to 0:00`);
  }
});

test("reel posters are deterministic, in-palette and paintable", async () => {
  const {
    POSTER_END,
    POSTER_GRADIENTS,
    POSTER_LOCATIONS,
    POSTER_START,
    reelAccent,
    reelPoster,
  } = await reelVisuals;

  assert.ok(POSTER_GRADIENTS.length >= 4, "the poster set should be varied");
  for (const stops of POSTER_GRADIENTS) {
    assert.equal(stops.length, 3, "a poster needs from/via/to");
    for (const hex of stops) {
      assert.match(hex, /^#[0-9A-Fa-f]{6}$/, `${hex} must be a 6-digit hex`);
    }
  }

  // LinearGradient needs matching colors/locations and explicit handles.
  assert.equal(POSTER_LOCATIONS.length, 3);
  assert.deepEqual(POSTER_START, { x: 0, y: 0 });
  assert.deepEqual(POSTER_END, { x: 1, y: 1 });

  for (const seed of ["r_1", "r_2", "r_37", "local-1"]) {
    const poster = reelPoster(seed);
    assert.deepEqual(poster, reelPoster(seed), "same reel -> same poster");
    assert.ok(POSTER_GRADIENTS.includes(poster), "poster comes from the set");
    assert.equal(reelAccent(seed), poster[1], "accent is the middle stop");
  }

  // Reels must actually spread across the palette (no single-colour feed).
  const used = new Set(
    Array.from({ length: 40 }, (_, i) => reelPoster(`r_${i + 1}`).join()),
  );
  assert.ok(used.size >= 3, `expected several posters, got ${used.size}`);

  // Missing seeds still paint something.
  assert.ok(Array.isArray(reelPoster()));
  assert.ok(Array.isArray(reelPoster(undefined)));
});

test("preview durations stay inside the 15-45s window", async () => {
  const { reelDurationSeconds } = await reelVisuals;

  for (let i = 1; i <= 40; i += 1) {
    const id = `r_${i}`;
    const duration = reelDurationSeconds(id);
    assert.ok(Number.isInteger(duration), `${duration} must be whole seconds`);
    assert.ok(duration >= 15 && duration <= 45, `${id} -> ${duration}s`);
    assert.equal(duration, reelDurationSeconds(id), "duration is stable");
  }
});

test("reelStore ships a real following-feed bucket", () => {
  assert.match(
    reelStoreSource,
    /followingFeed: makeFeed\(\)/,
    "followingFeed must be a feed bucket, not {} — the pager reads .ids",
  );

  const makeFeed = reelStoreSource.match(/const makeFeed = \(\) => \(\{[\s\S]*?\n\}\);/);
  assert.ok(makeFeed, "makeFeed not found in reelStore");

  for (const key of ["ids", "cursor", "hasMore", "isLoading"]) {
    assert.match(makeFeed[0], new RegExp(`${key}:`), `makeFeed must expose ${key}`);
  }
});

// --- the modern chrome ------------------------------------------------------

const REEL_ITEM = fs.readFileSync(
  path.join(__dirname, "../components/reels/ReelItem.jsx"),
  "utf8",
);
const REELS_SCREEN = fs.readFileSync(
  path.join(__dirname, "../app/(main)/reels/index.jsx"),
  "utf8",
);

test("ReelItem paints a poster, scrims and a preview scrubber", () => {
  assert.match(REEL_ITEM, /from "expo-linear-gradient"/, "poster/scrims use LinearGradient");
  assert.match(REEL_ITEM, /colors=\{poster\}/, "the poster gradient must be painted");
  assert.match(REEL_ITEM, /styles\.topScrim/, "the header needs a legibility scrim");
  assert.match(REEL_ITEM, /styles\.bottomScrim/, "the caption/rail need a scrim");
  assert.match(REEL_ITEM, /ReelScrubber/, "the reel must render a scrubber");
  assert.match(REEL_ITEM, /formatClock\(readoutElapsed\)/, "the scrubber shows the live position");
  assert.match(REEL_ITEM, /formatClock\(total\)/, "the scrubber shows the duration");
  assert.match(REEL_ITEM, /const playing = Boolean\(isActive && isPlaying\)/);
});

test("ReelItem rail is glass and the follow pill is wired", () => {
  assert.match(REEL_ITEM, /background=\{GLASS\}/, "rail controls use the glass fill");
  assert.match(REEL_ITEM, /accessibilityLabel=/, "rail controls stay labelled");
  assert.match(REEL_ITEM, /useProfileStore/, "the follow pill must use profileStore");
  assert.match(REEL_ITEM, /toggleFollow\(\{ userId: authorId \}\)/, "follow must toggle");
  assert.match(REEL_ITEM, /isFollowing \? "Following" : "Follow"/, "the pill reflects state");
  assert.doesNotMatch(
    REEL_ITEM,
    /volume-mute|volume-high|toggleMute/,
    "volume is owned by the phone's hardware buttons (no in-app mute control)",
  );
  assert.match(REEL_ITEM, /p\.muted = false/, "reel audio rides the media volume stream");
});

test("ReelItem uses custom transport controls and offline replay", () => {
  // expo-video's own controls stay off — the custom scrubber is the player UI.
  assert.match(REEL_ITEM, /nativeControls=\{false\}/, "no native expo-video controls");
  assert.match(REEL_ITEM, /PanGestureHandler/, "scrubbing is a custom drag gesture");
  assert.doesNotMatch(
    REEL_ITEM,
    /scrubberNudge/,
    "nudge buttons are replaced by drag/tap seeking",
  );

  // TikTok-style offline replay: mounted rows prefetch the full clip and the
  // player upgrades to the downloaded copy at safe boundaries.
  assert.match(REEL_ITEM, /utils\/reelCache/, "the offline cache lives in utils/reelCache");
  assert.match(REEL_ITEM, /downloadReel\(/, "mounted rows prefetch the full clip");
  assert.match(REEL_ITEM, /getCachedReelUri\(/, "cached copies are detected without network");
  assert.match(REEL_ITEM, /localUri/, "the player upgrades to the downloaded copy");
});

test("ReelItem keeps hooks above the null guard", () => {
  const start = REEL_ITEM.indexOf("function ReelItem(");
  const guard = REEL_ITEM.indexOf("if (!reel) return null;");
  assert.ok(start >= 0 && guard > start, "ReelItem still guards against a missing reel");

  // ReelScrubber uses useRef and useCallback at module level, not inside
  // ReelItem, so it's fine.
  const body = REEL_ITEM.slice(start, REEL_ITEM.indexOf("const ReelScrubber"));
  const before = body.slice(0, body.indexOf("if (!reel) return null;"));
  for (const hook of ["useReelStore", "useProfileStore", "useAppStore", "useCallback", "useEffect", "useMemo", "useRef"]) {
    assert.ok(before.includes(hook), `${hook} must be called before the null guard`);
  }
  assert.equal(
    body.slice(body.indexOf("if (!reel) return null;")).includes("useEffect("),
    false,
    "no hook may run after the null guard",
  );
});

test("the reels screen ships the floating glass chrome", () => {
  assert.match(REELS_SCREEN, /from "expo-linear-gradient"/, "the header scrim uses a gradient");
  assert.match(REELS_SCREEN, /function FeedSwitcher/, "the feed switcher is a pill");
  assert.match(REELS_SCREEN, /styles\.switcherItemActive/, "the active feed gets a pill highlight");
  assert.match(REELS_SCREEN, /RefreshControl/, "the pager supports pull-to-refresh");
  assert.match(REELS_SCREEN, /fetchReels\(\{ refresh: true, feedType \}\)/, "refresh targets the open feed");
  assert.match(REELS_SCREEN, /useSafeAreaInsets/, "the header respects the safe area");
  assert.match(REELS_SCREEN, /bottomInset=\{bottomInset\}/, "reels clear the floating tab bar");
  assert.match(REELS_SCREEN, /const TAB_BAR_CLEARANCE/, "the tab-bar clearance is explicit");
});

test("the reels screen no longer duplicates the tab bar's create button", () => {
  assert.equal(
    /camera-outline/.test(REELS_SCREEN),
    false,
    "the floating tab bar already owns the create affordance",
  );
  assert.equal(
    /SegmentedControl/.test(REELS_SCREEN),
    false,
    "the underlined feed tabs are replaced by the glass pill switcher",
  );
  assert.match(REELS_SCREEN, /setIndex\(0\)/, "switching feeds resets the pager");
  assert.match(REELS_SCREEN, /scrollToOffset/, "switching feeds resets the scroll");
});

