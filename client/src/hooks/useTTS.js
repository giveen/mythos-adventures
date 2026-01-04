import { useState, useEffect, useCallback } from 'react';

// useTTS now reports TTS as unsupported and exposes no-op actions.
export default function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => { setVoices([]); }, []);

  const speak = useCallback(async (_text, _opts = {}) => {
    // No-op
    return;
  }, []);

  const stop = useCallback(() => {
    setIsSpeaking(false);
  }, []);

  return {
    isSupported: false,
    isSpeaking,
    voices,
    speak,
    stop
  };
}
