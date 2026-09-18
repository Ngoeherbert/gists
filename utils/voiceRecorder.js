// No native work happens when this controller is created. Serialize audio
// operations across composers so an old chat's cleanup cannot reset a new session.
let audioQueue = Promise.resolve();
const enqueue = (work) => {
  const result = audioQueue.then(work);
  audioQueue = result.catch(() => {});
  return result;
};

export function createVoiceRecorder({ audio, createRecorder, setAudioMode, onState, onError }) {
  let phase = "idle";
  let recorder = null;
  let disposed = false;
  let generation = 0;
  let timer = null;
  let modeActive = false;
  let prepared = false;
  let durationMillis = 0;
  let energy = 0;

  const emit = () => {
    if (!disposed) onState({ phase, durationMillis, energy });
  };
  const transition = (next) => { phase = next; emit(); };
  const report = (error) => {
    console.warn("Voice recorder:", error);
    if (!disposed) onError(error.message || String(error));
  };
  const clearTimer = () => { clearInterval(timer); timer = null; };
  const cleanup = async () => {
    clearTimer();
    if (recorder) {
      try {
        if (prepared) { prepared = false; await recorder.stop(); }
      } catch (error) { report(error); }
      finally {
        try { recorder.release(); } catch (error) { report(error); }
        recorder = null;
      }
    }
    if (modeActive) {
      try {
        await setAudioMode({ allowsRecording: false, playsInSilentMode: true });
      } catch (error) { report(error); }
      modeActive = false;
    }
  };
  const sample = () => {
    if (!recorder || !["recording", "paused"].includes(phase)) return;
    const status = recorder.getStatus();
    if (status.mediaServicesDidReset || (phase === "recording" && !status.isRecording)) {
      throw new Error("Recording interrupted. Please try again.");
    }
    durationMillis = Math.max(durationMillis, status.durationMillis || 0);
    if (phase === "recording" && Number.isFinite(status.metering)) {
      energy = Math.round(Math.max(0, Math.min(1, (status.metering + 60) / 60)) * 100) / 100;
    }
    emit();
  };

  const controller = {
    get phase() { return phase; },
    start() {
      if (disposed || phase !== "idle") return Promise.resolve(false);
      const token = ++generation;
      const current = () => !disposed && token === generation;
      transition("permission");
      return enqueue(async () => {
        try {
          if (!current()) return false;
          const permission = await audio.requestRecordingPermissionsAsync();
          if (!current()) return false;
          if (!permission.granted && permission.status !== "granted") {
            throw new Error(permission.canAskAgain === false
              ? "Microphone access denied — enable it in Settings"
              : permission.status === "denied"
                ? "Microphone access denied"
                : "Microphone access required. Hold the microphone to try again.");
          }
          // Also restore after a partially failed audio-mode change.
          modeActive = true;
          await setAudioMode({ allowsRecording: true, playsInSilentMode: true });
          if (!current()) return false;
          recorder = createRecorder();
          await recorder.prepareToRecordAsync();
          prepared = true;
          if (!current()) return false;
          transition("ready");
          recorder.record();
          durationMillis = 0;
          energy = 0;
          transition("recording");
          timer = setInterval(() => {
            try { sample(); }
            catch (error) { report(error); void controller.finish(true); }
          }, 100);
          return true;
        } catch (error) {
          report(error);
          return false;
        } finally {
          if (!current() || phase !== "recording") {
            await cleanup();
            transition("idle");
          }
        }
      });
    },
    cancelStart() {
      if (["permission", "ready"].includes(phase)) ++generation;
    },
    pause() {
      if (disposed || phase !== "recording") return;
      try { sample(); recorder.pause(); transition("paused"); }
      catch (error) { report(error); void controller.finish(true); }
    },
    resume() {
      if (disposed || phase !== "paused") return;
      try { recorder.record(); transition("recording"); }
      catch (error) { report(error); void controller.finish(true); }
    },
    finish(cancelled = false) {
      if (disposed || !["recording", "paused"].includes(phase)) return Promise.resolve(null);
      clearTimer();
      try { sample(); } catch (error) { report(error); cancelled = true; }
      transition("stopping");
      return enqueue(async () => {
        let result = null;
        try {
          prepared = false; // Never call stop twice, even when it rejects.
          await recorder.stop();
          transition("stopped");
          const uri = recorder.uri;
          if (!cancelled && !disposed) {
            if (!uri || durationMillis <= 0) throw new Error("Recording is empty. Please try again.");
            result = { uri, duration: Math.max(1, Math.ceil(durationMillis / 1000)), energy };
          }
        } catch (error) { report(error); }
        finally { await cleanup(); transition("idle"); }
        return disposed ? null : result;
      });
    },
    dispose() {
      disposed = true;
      ++generation;
      clearTimer();
      return enqueue(cleanup);
    },
  };
  return controller;
}
