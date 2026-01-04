const db = require("../db/characters");

function ensureDefaultGame() {
  // Create or return an existing default game owned by user_id 1.
  const row = db.prepare(`SELECT id FROM games WHERE id = 1`).get();
  if (row && row.id) return row.id;

  // Ensure a default user exists (create if missing)
  let user = db.prepare(`SELECT id FROM users WHERE username = ?`).get('default');
  if (!user) {
    const ustmt = db.prepare(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`);
    const uinfo = ustmt.run('default', 'default@localhost', '');
    user = { id: uinfo.lastInsertRowid || uinfo.lastInsertRowId };
  }

  const stmt = db.prepare(`INSERT INTO games (user_id, title, description) VALUES (?, ?, ?)`);
  const info = stmt.run(user.id, "Default Game", "Auto-created game container");
  return info.lastInsertRowid || info.lastInsertRowId;
}

function summarizeAndSaveSession({ title, summary, messages = [] }) {
  const gameId = ensureDefaultGame();
  const start = new Date().toISOString();
  const end = new Date().toISOString();

  const insert = db.prepare(`INSERT INTO game_sessions (game_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)`);
  const info = insert.run(gameId, start, end, summary);

  const sessionId = info.lastInsertRowid || info.lastInsertRowId || info.lastInsertRowid; // compatibility

  if (messages && messages.length) {
    const evStmt = db.prepare(`INSERT INTO story_events (session_id, event_type, description, importance, timestamp) VALUES (?, ?, ?, ?, ?)`);
    const insertMany = db.transaction((msgs) => {
      for (const m of msgs) {
        const role = (m.role || "user").toString();
        const desc = (m.content || m.message || "").toString();
        const ts = m.timestamp || new Date().toISOString();
        evStmt.run(sessionId, role, desc, 3, ts);
      }
    });

    try {
      insertMany(messages);
    } catch (err) {
      console.error("Failed to insert story events:", err);
    }
  }

  return sessionId;
}

module.exports = {
  ensureDefaultGame,
  summarizeAndSaveSession
};

function listSessions() {
  const rows = db.prepare(`SELECT id, game_id, start_time, end_time, summary FROM game_sessions ORDER BY start_time DESC LIMIT 50`).all();
  return rows.map(r => ({ id: r.id, game_id: r.game_id, start_time: r.start_time, end_time: r.end_time, summary: r.summary }));
}

function getSessionWithEvents(sessionId) {
  const session = db.prepare(`SELECT id, game_id, start_time, end_time, summary FROM game_sessions WHERE id = ?`).get(sessionId);
  if (!session) return { session: null, events: [] };
  const events = db.prepare(`SELECT event_type, description, timestamp FROM story_events WHERE session_id = ? ORDER BY timestamp ASC`).all(sessionId).map(e => ({ role: e.event_type, content: e.description, timestamp: e.timestamp }));
  return { session, events };
}

module.exports = {
  ensureDefaultGame,
  summarizeAndSaveSession,
  listSessions,
  getSessionWithEvents
};
