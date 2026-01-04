// client/src/hooks/useLLM.js

import { useState } from "react";
import sessionService from "../services/sessionService";
import { useGame } from "../context/GameContext";
// Narrator removed — no audio playback

export function useLLM() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper: detect if LLM returned a roll request
  function parseRollRequest(text) {
    try {
      const obj = JSON.parse(text);
      if (obj.roll) return obj.roll;
    } catch (e) {
      return null;
    }
    return null;
  }

  // Helper: send roll result back to LLM
  async function sendRollResultToLLM(originalPrompt, rollResult) {
    const res = await fetch("http://localhost:4000/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `ROLL_RESULT:${JSON.stringify(rollResult)}\n${originalPrompt}`
      })
    });

    const data = await res.json();
    // If an action was executed as a result of this response, refresh characters
    if (data.actionResult) {
      try {
        fetchCharacters();
      } catch (err) {
        console.warn('Failed to refresh characters after action', err);
      }
    }

    return data.reply;
  }

  const { fetchCharacters } = useGame();

  const generate = async (prompt) => {
    setLoading(true);

    try {
      // 1. Send user prompt to backend
      sessionService.addMessage("user", prompt);
      const res = await fetch("http://localhost:4000/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      let reply = data.reply ?? "⚠️ No response from backend.";

      // If an action was executed by the LLM, refresh characters so UI stays in sync
      if (data.actionResult) {
        try {
          await fetchCharacters();
        } catch (err) {
          console.warn('Failed to refresh characters after LLM action', err);
        }
      }

      // 2. Check if LLM requested a roll
      const ability = parseRollRequest(reply);

      if (ability) {
        console.log("LLM requested roll:", ability);

        // 3. Call backend dice engine
        const rollRes = await fetch("http://localhost:4000/api/roll/skill-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ability })
        });

        const rollData = await rollRes.json();
        console.log("Backend roll result:", rollData);

        // 4. Send roll result back to LLM
        const finalNarration = await sendRollResultToLLM(prompt, rollData);

        sessionService.addMessage("assistant", finalNarration);
        // Narration removed — only text output
        setResponse(finalNarration);
      } else {
        // No roll requested — normal response
        sessionService.addMessage("assistant", reply);
        // Narration removed — only text output
        setResponse(reply);
      }
    } catch (err) {
      console.error("Backend error:", err);
      setResponse("⚠️ Error communicating with backend.");
    }

    setLoading(false);
  };

  return { response, loading, generate };
}
