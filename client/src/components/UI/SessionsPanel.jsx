import React, { useState, useEffect } from "react";
import { addMessage, clearMessages } from "../../services/sessionService";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function SessionsPanel() {
  const [sessions, setSessions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetchSessions();
  }, [open]);

  async function fetchSessions() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/session/list`);
      const data = await res.json();
      if (res.ok && data.sessions) setSessions(data.sessions);
      else setSessions([]);
    } catch (err) {
      console.error("Failed to list sessions", err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(id) {
    try {
      const res = await fetch(`${API_BASE}/api/session/${id}`);
      const data = await res.json();
      if (!res.ok || !data.events) throw new Error("Failed to fetch session events");

      // clear local messages and rehydrate
      clearMessages();
      for (const m of data.events) {
        addMessage(m.role || "user", m.content || "");
      }

      // Prime the LLM by sending the session summary to /api/story
      const summary = data.summary || "";
      if (summary) {
        const r2 = await fetch(`${API_BASE}/api/story`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: `Resume session:\n\n${summary}` }),
        });
        const jr = await r2.json();
        // attempt to append assistant reply
        const assistantText = jr.content || jr.summary || jr.message || JSON.stringify(jr);
        addMessage("assistant", assistantText);
      }

      setOpen(false);
      alert("Session restored and LLM primed.");
    } catch (err) {
      console.error(err);
      alert("Failed to restore session. See console.");
    }
  }

  return (
    <div style={{ display: "inline-block", marginLeft: 8 }}>
      <button className="fantasy-button" onClick={() => setOpen(true)}>Sessions</button>

      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 8, width: 640, maxHeight: "80%", overflow: "auto" }}>
            <h3>Saved Sessions</h3>
            <button style={{ float: "right" }} onClick={() => setOpen(false)}>Close</button>
            {loading && <div>Loading...</div>}
            {!loading && sessions.length === 0 && <div>No saved sessions found.</div>}
            <ul>
              {sessions.map((s) => (
                <li key={s.id} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                  <div style={{ fontSize: "0.9rem", color: "#333" }}>{s.start_time} — {String(s.summary || "").slice(0, 200)}</div>
                  <div style={{ marginTop: 6 }}>
                    <button className="fantasy-button" onClick={() => handleRestore(s.id)}>Restore</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
