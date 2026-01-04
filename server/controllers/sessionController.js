const { summarizeAndSaveSession } = require("../models/sessionModel");
const { generateStoryResponse } = require("../services/llmService");

async function saveSession(req, res) {
  try {
    const { title, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    // Build a summarization prompt for the LLM
    const userPrompt = `Please summarize the following game session into a concise narrative summary and a short "resume" bullet list of next steps for the player. Return only the summary text. Messages: ${JSON.stringify(
      messages
    )}`;

    let summary = "";
    try {
      const resp = await generateStoryResponse([{ role: "user", content: userPrompt }]);
      summary = resp && resp.content ? String(resp.content).trim() : String(resp || "").trim();
    } catch (err) {
      console.error("LLM summarization failed, falling back to minimal summary:", err && err.message ? err.message : err);
      // fallback summary: short description and message count
      try {
        summary = `Session saved (${Array.isArray(messages) ? messages.length : 0} messages).`; 
      } catch (e) {
        summary = "Session saved (unsummarized).";
      }
    }

    // Persist to DB (creates default game if needed) and include raw messages as events
    const sessionId = summarizeAndSaveSession({ title: title || "Quick Save", summary, messages });

    res.json({ success: true, sessionId, summary });
  } catch (err) {
    console.error("Session save error:", err);
    res.status(500).json({ error: "Failed to save session" });
  }
}

async function summarizeSession(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    // Craft a focused summarization prompt asking for two concise bullet lists
    const prompt = `You are the Dungeon Master. From the following chronological messages between the assistant (DM) and the player, produce two short concise bullet lists: 1) "Dungeon Master Actions" summarizing what the DM did or announced (3-8 bullets), and 2) "Player Actions" summarizing the player's meaningful actions (3-8 bullets). Use short sentences or fragments, do not include extra commentary. Messages: ${JSON.stringify(
      messages
    )}`;

    const resp = await generateStoryResponse([{ role: "user", content: prompt }]);
    const summary = resp && resp.content ? String(resp.content).trim() : String(resp || '').trim();

    res.json({ success: true, summary });
  } catch (err) {
    console.error("Summarize session error:", err);
    res.status(500).json({ error: "Failed to summarize session" });
  }
}

async function listSessions(req, res) {
  try {
    const sessions = require('../models/sessionModel').listSessions();
    res.json({ success: true, sessions });
  } catch (err) {
    console.error("List sessions error:", err);
    res.status(500).json({ error: "Failed to list sessions" });
  }
}

async function getSession(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Missing session id' });
    const { session, events } = require('../models/sessionModel').getSessionWithEvents(id);
    res.json({ success: true, session, events });
  } catch (err) {
    console.error('Get session error:', err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
}

module.exports = { saveSession, summarizeSession, listSessions, getSession };
