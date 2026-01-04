const axios = require("axios");
const { loadSystemPrompt } = require("./promptService");
const { getActiveCharacter } = require("../models/activeCharacter");
require("dotenv").config();

let ollama = null;
try {
  ollama = require('./ollamaService');
} catch (e) {
  // not available
}

// Load base system prompt from file
const BASE_SYSTEM_PROMPT = loadSystemPrompt();
console.log("SYSTEM PROMPT LENGTH:", BASE_SYSTEM_PROMPT.length);

const { executeAction } = require("./llmActionService");

// Build dynamic system prompt including active character
function buildSystemPrompt() {
  const character = getActiveCharacter();

  let characterBlock = "";

  if (character) {
    const s = character.stats || {};
    const str = Number(s.str || s.STR || 10);
    const dex = Number(s.dex || s.DEX || 10);
    const con = Number(s.con || s.CON || 10);
    const intel = Number(s.int || s.INT || 10);
    const wis = Number(s.wis || s.WIS || 10);
    const cha = Number(s.cha || s.CHA || 10);

    const mod = (n) => Math.floor((n - 10) / 2);

    characterBlock = `
=== PLAYER CHARACTER ===
Name: ${character.name}
Race: ${character.race}
Class: ${character.class}
Level: ${character.level}
Alignment: ${character.alignment}

Background:
${character.background}

Attributes:
STR ${str} (mod ${mod(str)})
DEX ${dex} (mod ${mod(dex)})
CON ${con} (mod ${mod(con)})
INT ${intel} (mod ${mod(intel)})
WIS ${wis} (mod ${mod(wis)})
CHA ${cha} (mod ${mod(cha)})

Inventory: ${JSON.stringify(character.inventory || [])}

Use these stats for:
- Skill checks
- Combat rolls
- Saving throws
- Dialogue flavor
- Roleplay consistency
- Class/race-specific narrative hooks
========================
`;
  }

  return `
${BASE_SYSTEM_PROMPT}

${characterBlock}

=== GAME MECHANICS GUIDANCE ===
- Describe when checks or combat would be appropriate, and narrate outcomes.
- Do not emit or wait for raw dice-roll JSON objects in assistant messages.
- If you want the backend to apply a structured change to a character (give item, add xp, level up), use the character update contract (a single JSON object with an "action" field) and nothing else in that message; otherwise, continue narrating normally.
================================
`;
}

async function generateStoryResponse(messages) {
  const systemPrompt = buildSystemPrompt();

  // Prefer local Ollama if available and enabled
  let content = null;
  if (ollama && (process.env.LLM_USE_OLLAMA !== 'false') && ollama.hasOllamaCLI()) {
    try {
      const model = process.env.LLM_MODEL || 'adi0adi/ollama_stheno-8b_v3.1_q6k';
      const msgs = [ { role: 'system', content: systemPrompt }, ...messages ];
      const gen = ollama.generateModel(model, msgs);
      if (gen && gen.content) content = gen.content;
    } catch (e) {
      console.warn('Ollama generation failed, falling back to remote LLM:', e && e.message);
    }
  }

  if (!content) {
    const payload = {
      model: process.env.LLM_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.9,
      top_p: 0.9,
      max_tokens: 350
    };

    const response = await axios.post(
      process.env.LLM_URL,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    content = response.data.choices[0].message.content;
  }

  // Remove any stray roll-only JSON objects the model may have emitted (defensive).
  // Match JSON objects containing a "roll" key but not an "action" key.
  try {
    const rollObjRegex = /\{[^}]*"roll"\s*:\s*"?[A-Za-z0-9_ ]+"?[^}]*\}/g;
    const sanitized = String(content).replace(rollObjRegex, (m) => {
      if (/"action"\s*:/.test(m)) return m; // keep action objects
      console.log('Stripped roll object from LLM output:', m);
      return '';
    }).trim();
    // Use sanitized content moving forward
    content = sanitized;
  } catch (e) {
    // if sanitization fails, just proceed with original content
  }

  // If the model returned a JSON action object (per CONTRACT), try to parse and execute it.
  let actionResult = null;
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.action) {
      try {
        const result = await executeAction(parsed);
        actionResult = result;
        console.log("LLM action executed:", parsed.action, result && result.success);
      } catch (err) {
        console.error("Failed to execute LLM action:", err);
        actionResult = { success: false, error: String(err && err.message ? err.message : err) };
      }
    }
  } catch (err) {
    // not JSON — ignore
  }

  return { content, actionResult };
}

module.exports = {
  generateStoryResponse
};
