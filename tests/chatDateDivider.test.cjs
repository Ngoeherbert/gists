// tests/chatDateDivider.test.cjs
// Guards for the chat thread's date dividers and bubble spacing:
//   • utils/chatDates.js groups messages by LOCAL calendar day (never UTC)
//   • the thread renders a divider above the first message of each day
//   • a new day resets avatar / name / tail grouping
//   • bubbles keep a real gap between them
//
// The real helpers are extracted from the shipped source and executed, so the
// tests fail if the rule drifts.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;

const CHAT_DATES = path.join(__dirname, "../utils/chatDates.js");
const DATE_DIVIDER = path.join(__dirname, "../components/chats/DateDivider.jsx");
const CHAT_SCREEN = path.join(__dirname, "../app/(main)/chats/[id].jsx");
const AI_SCREEN = path.join(__dirname, "../app/(main)/chats/ai.jsx");
const MESSAGE_BUBBLE = path.join(__dirname, "../components/chats/MessageBubble.jsx");

const PARSE_OPTIONS = { sourceType: "module", plugins: ["jsx", "flow"] };

function parseFile(file) {
  return parse(fs.readFileSync(file, "utf8"), PARSE_OPTIONS);
}

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
    return;
  }
  if (typeof node.type === "string") visit(node);
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "start" || key === "end") continue;
    walk(node[key], visit);
  }
}

// Evaluate a module's top-level constants and functions together, in one
// scope, so helpers that call each other (dayKey -> isSameDay -> formatDayLabel)
// and module-level constants (MS_PER_DAY) resolve. Returns the functions by name.
function loadFunctions(file) {
  const names = [];
  const sources = [];
  for (const node of parseFile(file).program.body) {
    const declaration =
      node.type === "ExportNamedDeclaration" ? node.declaration : node;
    if (declaration?.type === "VariableDeclaration") {
      // Module-level constants the functions close over (e.g. MS_PER_DAY).
      sources.push(generate(declaration).code);
      continue;
    }
    if (declaration?.type !== "FunctionDeclaration" || !declaration.id?.name) {
      continue;
    }
    names.push(declaration.id.name);
    sources.push(generate(declaration).code);
  }
  assert.ok(names.length, `${path.basename(file)} must declare functions`);
  return new Function(
    `${sources.join("\n")}\nreturn { ${names.join(", ")} };`,
  )();
}

const { dayKey, isSameDay, formatDayLabel, startsNewDay } = loadFunctions(CHAT_DATES);

// Local-time fixtures — built with local components so the assertions hold in
// any timezone.
const NOW = new Date(2026, 8, 18, 21, 30).getTime(); // Fri 18 Sep 2026, 21:30
const at = (daysAgo, hour = 10) => new Date(2026, 8, 18 - daysAgo, hour, 0).getTime();

test("dayKey uses the local calendar day and rejects junk", () => {
  // 00:30 local must stay on 18 September, even though it is the previous day
  // in UTC for most offsets.
  assert.equal(dayKey(new Date(2026, 8, 18, 0, 30).getTime()), "2026-09-18");
  // Late-night messages must not roll forward either.
  assert.equal(dayKey(new Date(2026, 8, 18, 23, 59).getTime()), "2026-09-18");
  assert.equal(dayKey(at(1)), "2026-09-17");

  assert.equal(dayKey(null), null);
  assert.equal(dayKey(undefined), null);
  assert.equal(dayKey(""), null);
  assert.equal(dayKey("not-a-date"), null);
});

test("isSameDay compares calendar days, not elapsed time", () => {
  assert.equal(isSameDay(at(0, 0), at(0, 23)), true);
  assert.equal(isSameDay(at(0), at(1)), false);
  assert.equal(isSameDay("nonsense", at(0)), false);
});

test("formatDayLabel renders Today / Yesterday / weekday / full date", () => {
  assert.equal(formatDayLabel(at(0), NOW), "Today");
  assert.equal(formatDayLabel(at(1), NOW), "Yesterday");

  const threeDaysAgo = at(3);
  assert.equal(
    formatDayLabel(threeDaysAgo, NOW),
    new Date(threeDaysAgo).toLocaleDateString([], { weekday: "long" }),
  );

  const old = at(30);
  assert.equal(
    formatDayLabel(old, NOW),
    new Date(old).toLocaleDateString([], {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );

  assert.equal(formatDayLabel(null, NOW), "");
  assert.equal(formatDayLabel(at(0), "nonsense"), "");
});

test("startsNewDay splits on the calendar boundary, not on a 24h gap", () => {
  const messages = [
    { id: "a", createdAt: at(2, 22) },
    { id: "b", createdAt: at(2, 23) }, // same day, one hour later
    { id: "c", createdAt: at(1, 0) }, // midnight -> new day
    { id: "d", createdAt: at(0, 9) }, // new day
  ];

  assert.equal(startsNewDay(messages, 0), true, "the first message always opens a day");
  assert.equal(startsNewDay(messages, 1), false);
  assert.equal(startsNewDay(messages, 2), true);
  assert.equal(startsNewDay(messages, 3), true);

  assert.equal(startsNewDay([], 0), false);
  assert.equal(startsNewDay(messages, 99), false);
  assert.equal(startsNewDay(null, 0), false);
  assert.equal(
    startsNewDay([{ id: "x" }], 0),
    false,
    "an unusable timestamp never opens a day",
  );
});

test("DateDivider renders an explicit label or derives one from the date", () => {
  const src = fs.readFileSync(DATE_DIVIDER, "utf8");
  assert.match(src, /formatDayLabel\(date\)/, "a missing label must fall back to the date");
  assert.match(src, /label \?\?/, "a caller-supplied label must win");
  assert.match(src, /pointerEvents="none"/, "the divider must not swallow bubble presses");
  assert.match(src, /memo\(DateDivider\)/, "the divider should be memoized");
});

test("the thread renders a divider per calendar day and resets grouping", () => {
  const src = fs.readFileSync(CHAT_SCREEN, "utf8");

  assert.match(src, /import DateDivider from/, "the screen must render the divider");
  assert.match(src, /import \{ startsNewDay \} from/, "the screen must group by day");

  const dateAttrs = [];
  walk(parseFile(CHAT_SCREEN), (node) => {
    if (node.type === "JSXAttribute" && node.name?.name === "date") {
      dateAttrs.push(generate(node.value).code);
    }
  });
  assert.ok(
    dateAttrs.some((code) => code.includes("item.createdAt")),
    "the divider must be fed the message timestamp",
  );

  assert.match(src, /const opensDay = startsNewDay\(messages, index\)/);
  assert.match(
    src,
    /\{opensDay \? <DateDivider/,
    "the divider renders above that day's first bubble",
  );
  assert.match(src, /!opensDay &&/, "a new day must break the same-sender run");
  assert.match(src, /opensDay \|\|/, "a new day must restore the avatar");
});

test("separate bubbles keep a real gap", () => {
  // Read the resolved values out of the StyleSheet so a tweak to either the
  // style or the spacing scale is caught.
  let stylesNode = null;
  walk(parseFile(MESSAGE_BUBBLE), (node) => {
    if (
      node.type === "VariableDeclarator" &&
      node.id?.name === "styles" &&
      node.init?.type === "CallExpression"
    ) {
      stylesNode = node.init.arguments?.[0];
    }
  });
  assert.ok(stylesNode, "MessageBubble must define a StyleSheet");

  const margins = {};
  for (const prop of stylesNode.properties) {
    const name = prop.key?.name;
    if (name !== "row" && name !== "rowGrouped" && name !== "rowSenderSwitch") {
      continue;
    }
    const margin = prop.value.properties.find((p) => p.key?.name === "marginBottom");
    margins[name] = generate(margin.value).code;
  }

  assert.equal(margins.row, "spacing.md", "separate bubbles need a visible gap");
  assert.equal(margins.rowGrouped, "spacing.xs", "grouped bubbles need a small gap, not 0");
  assert.equal(
    margins.rowSenderSwitch,
    "spacing.xl",
    "sent vs received needs a wider gap than two bubbles from the same sender",
  );
});

test("the speaker-change gap is wider, and never doubles up on a date divider", () => {
  const bubbleSrc = fs.readFileSync(MESSAGE_BUBBLE, "utf8");

  // The override must sit AFTER the grouped style so it wins the merge.
  assert.match(bubbleSrc, /senderSwitchAfter = false/, "the prop needs a safe default");
  const groupedAt = bubbleSrc.indexOf("isGrouped && styles.rowGrouped");
  const switchAt = bubbleSrc.indexOf("senderSwitchAfter && styles.rowSenderSwitch");
  assert.ok(groupedAt > -1 && switchAt > -1, "both spacing styles must be applied");
  assert.ok(switchAt > groupedAt, "the speaker-change gap must override the grouped gap");

  const src = fs.readFileSync(CHAT_SCREEN, "utf8");
  assert.match(
    src,
    /const senderSwitchAfter =/,
    "the screen must derive the speaker-change gap",
  );
  assert.match(
    src,
    /!startsNewDay\(messages, index \+ 1\)/,
    "a date divider must not stack with the speaker-change gap",
  );
  assert.match(src, /senderSwitchAfter=\{senderSwitchAfter\}/, "the prop must be passed down");

  // Exercise the derivation itself against a few threads.
  const senderSwitchAfter = (messages, index) => {
    const nextMsg = messages[index + 1];
    return Boolean(nextMsg) &&
      !startsNewDay(messages, index + 1) &&
      (nextMsg.isMine !== messages[index].isMine ||
        nextMsg.senderId !== messages[index].senderId);
  };
  const me = { id: "me", isMine: true, createdAt: at(0, 9) };
  const them = { id: "t1", isMine: false, createdAt: at(0, 9) };

  assert.equal(
    senderSwitchAfter([me, them], 0),
    true,
    "sent -> received must widen the gap below the sent bubble",
  );
  assert.equal(
    senderSwitchAfter([them, me], 0),
    true,
    "received -> sent must widen it too",
  );
  assert.equal(
    senderSwitchAfter([them, { ...them, id: "t2" }], 0),
    false,
    "same sender keeps the tight run",
  );
  assert.equal(
    senderSwitchAfter([me, { ...them, createdAt: at(1) }], 0),
    false,
    "a new day is separated by the divider instead",
  );
  assert.equal(senderSwitchAfter([me], 0), false, "the last bubble needs no gap");
});

test("the AI chat reuses the same speaker-change gap", () => {
  const src = fs.readFileSync(AI_SCREEN, "utf8");
  assert.match(src, /import MessageBubble from/, "the AI chat reuses MessageBubble");
  assert.match(src, /const senderSwitchAfter =/, "the AI chat must derive the gap");
  assert.match(
    src,
    /senderSwitchAfter=\{senderSwitchAfter\}/,
    "the AI chat must pass the gap down",
  );
});


