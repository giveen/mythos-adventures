// TTS service removed — provide a minimal, safe API that does not perform audio.

const SETTINGS_KEY = "narratorSettings";
const DL_KEY = "narratorDownloadedVoices";

export default {
	getVoices: async function () {
		return [];
	},

	speak: function (_text, _opts = {}) {
		// Audio disabled: no-op
		console.info('ttsService.speak called but audio is disabled.');
	},

	saveSettings: function (settings) {
		try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
	},

	loadSettings: function () {
		try { const v = localStorage.getItem(SETTINGS_KEY); return v ? JSON.parse(v) : null; } catch (e) { return null; }
	},

	downloadVoice: async function (_voiceName) {
		// No-op; record request locally
		try { return true; } catch (e) { return false; }
	},

	loadDownloadedVoices: function () {
		try { const v = localStorage.getItem(DL_KEY); return v ? JSON.parse(v) : []; } catch (e) { return []; }
	}
};
