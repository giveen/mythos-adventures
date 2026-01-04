// Disabled TTS client — audio features removed to comply with policy.
// This module preserves the original API but implements safe no-op behavior.

export function isSupported() {
  return false;
}

export function listVoices() {
  return [];
}

export function speak(_text, _opts = {}) {
  // No audio allowed — resolve immediately without producing sound.
  return Promise.resolve();
}

export function stop() {
  // No-op
}
