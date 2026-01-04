import React, { useState } from "react";
import sessionService from "../../services/sessionService";

export default function SessionHistory({ onClose }) {
  const [messages] = useState(sessionService.getMessages());
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  async function handleSummarize() {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch("http://localhost:4000/api/session/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Summarization failed");
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Error summarizing session. See console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Session History</h3>
        <div className="session-messages">
          {messages.length === 0 && <p>No messages in this session yet.</p>}
          {messages.map((m, i) => (
            <div key={i} className={`session-message ${m.role}`}>
              <strong>{m.role}:</strong> {m.content}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="fantasy-button" onClick={handleSummarize} disabled={loading}>
            {loading ? "Summarizing..." : "Summarize Actions"}
          </button>
          <button className="fantasy-button" onClick={onClose} style={{ marginLeft: 8 }}>
            Close
          </button>
        </div>

        {summary && (
          <div style={{ marginTop: 12 }}>
            <h4>Summary</h4>
            <pre className="summary-pre">{summary}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
