// tests/messageEdit.test.cjs
// Regression guards for the long-press action sheet on a chat message:
//   • Edit / Delete must be reachable for the sender's own messages
//   • the bubble must hand the *message* to onPress / onLongPress (passing the
//     handler straight through gave the host a GestureResponderEvent instead,
//     so `isMine` was undefined and both actions were hidden)
//   • ChatInput must route a save through onEditSubmit while edit mode is live
//
// The real `canEditMessage` predicate is extracted from the shipped screen
// source and executed, so the test fails if the rule drifts.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;

const CHAT_SCREEN = path.join(__dirname, "../app/(main)/chats/[id].jsx");
const MESSAGE_BUBBLE = path.join(__dirname, "../components/chats/MessageBubble.jsx");
const CHAT_INPUT = path.join(__dirname, "../components/chats/ChatInput.jsx");

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

// Pull a top-level function declaration out of a source file and return it as
// a live function, so the assertions run against the real implementation.
function extractFunction(file, name) {
  let found = null;
  for (const node of parseFile(file).program.body) {
    if (node.type === "FunctionDeclaration" && node.id?.name === name) found = node;
  }
  assert.ok(found, `${name} must be declared in ${path.basename(file)}`);
  // The generated code can end in a `//` comment (babel attaches the next
  // node's leading comment as this node's trailing comment), so the return
  // statement goes on its own line.
  return new Function(`${generate(found).code}\nreturn ${name};`)();
}

// Every JSX attribute with the given name, as generated source text.
function jsxAttributes(file, attributeName) {
  const found = [];
  walk(parseFile(file), (node) => {
    if (node.type !== "JSXAttribute") return;
    if (node.name?.name !== attributeName) return;
    found.push(generate(node.value).code);
  });
  return found;
}

test("canEditMessage allows the sender's own text and captioned media", () => {
  const canEditMessage = extractFunction(CHAT_SCREEN, "canEditMessage");

  assert.equal(canEditMessage({ id: "m1", isMine: true, text: "hello" }), true);
  assert.equal(
    canEditMessage({ id: "m2", isMine: true, text: "caption", mediaType: "image", mediaUrl: "x" }),
    true,
    "a media message with a caption must stay editable",
  );
});

test("canEditMessage rejects received, view-once and textless messages", () => {
  const canEditMessage = extractFunction(CHAT_SCREEN, "canEditMessage");

  assert.equal(canEditMessage({ id: "m3", isMine: false, text: "hi" }), false);
  assert.equal(canEditMessage({ id: "m4", isMine: true, viewOnce: true, text: "hi" }), false);
  assert.equal(canEditMessage({ id: "m5", isMine: true, text: "   " }), false);
  assert.equal(canEditMessage({ id: "m6", isMine: true }), false);
  assert.equal(canEditMessage(null), false, "a missing message must never be editable");
});

test("MessageBubble hands the message (not the press event) to the host", () => {
  const longPress = jsxAttributes(MESSAGE_BUBBLE, "onLongPress");
  const press = jsxAttributes(MESSAGE_BUBBLE, "onPress");

  assert.ok(
    longPress.some((code) => code.includes("onLongPress") && code.includes("message")),
    "onLongPress must be invoked with the message object",
  );
  assert.ok(
    press.some((code) => code.includes("onPress") && code.includes("message")),
    "onPress must be invoked with the message object",
  );
  // The old bug: the bare handler reference received a GestureResponderEvent.
  assert.ok(
    !longPress.some((code) => /onLongPress\}/.test(code)),
    "onLongPress must not be passed through by reference",
  );
  assert.ok(
    !press.some((code) => /onPress\}/.test(code)),
    "onPress must not be passed through by reference",
  );
});

test("action sheet wires Edit and Delete to real handlers", () => {
  const onPress = jsxAttributes(CHAT_SCREEN, "onPress");

  assert.ok(
    onPress.some((code) => code.includes("startEditing")),
    "the Edit row must call startEditing",
  );
  assert.ok(
    onPress.some((code) => code.includes("confirmDelete")),
    "the Delete row must call confirmDelete",
  );
  assert.ok(
    !onPress.some((code) => code.includes("/* edit */") || code.includes("/* delete */")),
    "placeholder no-op handlers must be gone",
  );
});

test("the screen feeds ChatInput the edit-mode props", () => {
  const src = fs.readFileSync(CHAT_SCREEN, "utf8");
  assert.match(src, /editingMessage=\{editingMessage\}/);
  assert.match(src, /onEditSubmit=\{submitEdit\}/);
  assert.match(src, /onCancelEdit=\{cancelEditing\}/);
});

test("ChatInput prefills, cancels and submits an edit", () => {
  const src = fs.readFileSync(CHAT_INPUT, "utf8");

  assert.match(src, /editingMessage,\s*\n\s*onEditSubmit,/, "ChatInput must accept the edit props");
  assert.match(src, /onEditSubmit\?\.\(\{/, "an active edit must be submitted through onEditSubmit");
  assert.match(src, /Editing message/, "edit mode must be visible to the user");
  assert.match(src, /messageId: editingMessage\.id/, "the edit payload must target the message id");
  assert.match(
    src,
    /setDraft\(editingMessage\.text \?\? ""\)/,
    "entering edit mode must seed the draft with the message text",
  );
});
