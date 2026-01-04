const db = require("../db/init");
const { v4: uuid } = require("uuid");

module.exports = {
  addEvent(sessionId, role, content) {
    const id = uuid();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO story_events (
        id, session_id, event_type, description, importance, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      sessionId,
      role,          // "player" or "gm"
      content,
      3,             // default importance
      now
    );

    return id;
  },

  getEvents(sessionId) {
    const stmt = db.prepare(`
      SELECT * FROM story_events
      WHERE session_id = ?
      ORDER BY timestamp ASC
    `);

    return stmt.all(sessionId).map(row => ({
      role: row.event_type,
      content: row.description,
      timestamp: row.timestamp
    }));
  }
};
