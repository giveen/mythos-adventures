import React, { useEffect, useState } from "react";
// TTS removed: do not import useTTS

const STORAGE_KEY = "mythos.tts.settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        enabled: false,
        voiceURI: "",
        rate: 1,
        pitch: 1,
        volume: 1,
      };
    return JSON.parse(raw);
  } catch (e) {
    return {
      enabled: false,
      voiceURI: "",
      rate: 1,
      pitch: 1,
      volume: 1,
    };
  }
}

export default function SettingsPage(props) {
  const [settings, setSettings] = useState(loadSettings());

  // lazy-load OllamaPanel to avoid circular import recursion
  const [OllamaPanel, setOllamaPanel] = useState(null);
  useEffect(() => {
    let mounted = true;
    import("../components/UI/OllamaPanel")
      .then((mod) => {
        if (mounted) setOllamaPanel(() => mod.default || mod);
      })
      .catch(() => {
        if (mounted) setOllamaPanel(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    alert("Settings saved");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Settings</h1>

      <div style={{ marginTop: 12 }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}>
          <h2 style={{ marginTop: 0 }}>Ollama</h2>
          {OllamaPanel ? (
            <OllamaPanel showSysInfo={true} />
          ) : (
            <div>Loading Ollama configuration...</div>
          )}
        </div>
      </div>
    </div>
  );
}
