// Simple narrator service: settings persisted to localStorage and a minimal Soprano-TTS space caller.

const STORAGE_KEY = "narratorConfig_v1";
// Use local TTS server URL if provided, otherwise default to common local gradio port
const LOCAL_TTS_URL = process.env.REACT_APP_TTS_URL || "http://localhost:7860/api/predict";
// treat test env or explicit flag as "test" mode
const IS_TEST = process.env.REACT_APP_ENV === "test" || process.env.NODE_ENV === "test" || process.env.REACT_APP_TTS_TEST === "1";

function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { enabled: false, voice: "default", speed: 1.0, pitch: 1.0, downloaded: false };
  } catch (e) {
    return { enabled: false, voice: "default", speed: 1.0, pitch: 1.0, downloaded: false };
  }
}

function saveConfig(cfg) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

async function synthesize(_text, _opts = {}) {
  // Audio disabled — do not attempt synthesis.
  console.info('narratorService.synthesize called but audio is disabled.');
  return null;
}

async function playText(_text, _opts = {}) {
  // Audio disabled — do not play audio. Keep API for callers.
  console.info('narratorService.playText called but audio is disabled.');
  return null;
}

function isEnabled() {
  return !!loadConfig().enabled;
}

function enable() {
  const cfg = loadConfig();
  cfg.enabled = true;
  saveConfig(cfg);
}

function disable() {
  const cfg = loadConfig();
  cfg.enabled = false;
  saveConfig(cfg);
}

function getConfig() {
  return loadConfig();
}

function setConfig(partial) {
  const cfg = { ...loadConfig(), ...partial };
  saveConfig(cfg);
}

function getVoiceOptions() {
  return ["default", "soprano", "alto"];
}

// Check local TTS reachability and mark downloaded if available
async function downloadAndActivate() {
  const cfg = loadConfig();
  try {
    // TTS removed: do not attempt synthesis or speechSynthesis checks
    cfg.downloaded = false;
  } catch (e) {
    cfg.downloaded = false;
  }
  saveConfig(cfg);
  return cfg;
}

const narratorService = {
  synthesize,
  playText,
  isEnabled,
  enable,
  disable,
  getConfig,
  setConfig,
  getVoiceOptions,
  downloadAndActivate
};

export default narratorService;
