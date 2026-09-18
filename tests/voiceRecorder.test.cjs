const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Load the actual ESM source without changing the Expo app's package type.
const source = fs.readFileSync(path.join(__dirname, "../utils/voiceRecorder.js"), "utf8");
const modulePromise = import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

function fixture(createVoiceRecorder, overrides = {}) {
  const calls = [];
  const states = [];
  const errors = [];
  const native = {
    uri: "file:///voice-note.m4a",
    prepareToRecordAsync: async () => { calls.push("prepare"); },
    record: () => { calls.push("record"); },
    pause: () => { calls.push("pause"); },
    stop: async () => { calls.push("stop"); },
    release: () => { calls.push("release"); },
    getStatus: () => ({ isRecording: true, durationMillis: 1200, metering: -20 }),
  };
  const controller = createVoiceRecorder({
    audio: { requestRecordingPermissionsAsync: async () => {
      calls.push("permission");
      return { granted: true, status: "granted" };
    } },
    createRecorder: () => { calls.push("create"); return native; },
    setAudioMode: async (mode) => { calls.push(mode.allowsRecording ? "mode:on" : "mode:off"); },
    onState: (state) => states.push(state),
    onError: (error) => errors.push(error),
    ...overrides,
  });
  return { controller, calls, states, errors, native };
}

test("mount is inert; native constructor error is handled and returns to idle", async () => {
  const { createVoiceRecorder } = await modulePromise;
  const unhandled = [];
  const handler = (error) => unhandled.push(error);
  process.on("unhandledRejection", handler);
  const f = fixture(createVoiceRecorder, {
    createRecorder: () => { throw new Error("Native AudioRecorder initialization failed"); },
  });
  try {
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(f.calls, [], "mount must not request permission or initialize native audio");
    assert.equal(f.controller.phase, "idle");
    assert.equal(await f.controller.start(), false);
    assert.equal(f.controller.phase, "idle");
    assert.deepEqual(f.calls, ["permission", "mode:on", "mode:off"]);
    assert.deepEqual(f.errors, ["Native AudioRecorder initialization failed"]);
    await f.controller.dispose();
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(unhandled, []);
  } finally { process.off("unhandledRejection", handler); }
});

test("permission denial never constructs a recorder", async () => {
  const { createVoiceRecorder } = await modulePromise;
  for (const status of ["denied", "undetermined"]) {
    const f = fixture(createVoiceRecorder, {
      audio: { requestRecordingPermissionsAsync: async () => ({ status, granted: false, canAskAgain: false }) },
    });
    assert.equal(await f.controller.start(), false);
    assert.deepEqual(f.calls, []);
    assert.equal(f.controller.phase, "idle");
    assert.match(f.errors[0], /Settings/);
    await f.controller.dispose();
  }
});

test("record, pause, resume, stop returns final URI and releases exactly once", async () => {
  const { createVoiceRecorder } = await modulePromise;
  const f = fixture(createVoiceRecorder);
  assert.equal(await f.controller.start(), true);
  assert.equal(await f.controller.start(), false);
  f.controller.pause();
  f.controller.pause();
  f.controller.resume();
  f.controller.resume();
  const finishing = f.controller.finish();
  assert.equal(await f.controller.finish(), null);
  const take = await finishing;
  assert.equal(take.uri, "file:///voice-note.m4a");
  assert.equal(take.duration, 2);
  await f.controller.dispose();
  assert.deepEqual(f.calls, ["permission", "mode:on", "create", "prepare", "record", "pause", "record", "stop", "release", "mode:off"]);
});

test("unmount during permission prevents native allocation and later callbacks", async () => {
  const { createVoiceRecorder } = await modulePromise;
  let resolvePermission;
  const f = fixture(createVoiceRecorder, {
    audio: { requestRecordingPermissionsAsync: () => new Promise((resolve) => { resolvePermission = resolve; }) },
  });
  const starting = f.controller.start();
  await new Promise((resolve) => setImmediate(resolve));
  const count = f.states.length;
  const disposing = f.controller.dispose();
  resolvePermission({ granted: true });
  assert.equal(await starting, false);
  await disposing;
  assert.deepEqual(f.calls, []);
  assert.equal(f.states.length, count);
});
