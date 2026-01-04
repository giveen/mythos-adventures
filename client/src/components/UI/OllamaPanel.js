import React, { useEffect, useState, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

/*
  OllamaPanel — lightweight UI for Ollama-related actions.
  - Avoids importing Settings/useTTS to prevent cycles.
  - Calls backend endpoints under /api/ollama/* (adjust if your API path differs).
  - Keeps buttons styled with the app's "fantasy-button" class.
*/

export default function OllamaPanel({ showSysInfo = false }) {
  const [status, setStatus] = useState({ installed: false, local: [], gpu: null, version: null });
  const [loading, setLoading] = useState(false);
  const [modelToPull, setModelToPull] = useState("");
  const [modelToDelete, setModelToDelete] = useState("");
  const [modelToActivate, setModelToActivate] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ollama/status`);
      if (!res.ok) throw new Error("status fetch failed");
      const jd = await res.json();
      setStatus(jd || {});
      // set defaults for selects
      const local = jd && jd.local ? jd.local : [];
      if (local.length) {
        const first = (local[0] && (local[0].id || local[0].name)) || String(local[0]);
        if (!modelToActivate) setModelToActivate(first);
        if (!modelToDelete) setModelToDelete(first);
      }
    } catch (err) {
      console.warn("Failed to fetch Ollama status", err);
      setStatus({ installed: false, local: [], gpu: null, version: null });
    }
  }, [modelToActivate, modelToDelete]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function doInstall() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ollama/install`, { method: "POST" });
      const jd = await res.json();
      if (jd && jd.error) alert(`Install: ${jd.error}`); else alert("Ollama install triggered.");
      await fetchStatus();
    } catch (err) {
      alert("Install failed: " + (err?.message || String(err)));
    } finally { setLoading(false); }
  }

  async function doPull() {
    if (!modelToPull) return alert("Enter model id to pull");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ollama/pull`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelToPull })
      });
      const jd = await res.json();
      if (jd && jd.error) alert(`Pull: ${jd.error}`); else alert("Pull started.");
      await fetchStatus();
    } catch (err) {
      alert("Pull failed: " + (err?.message || String(err)));
    } finally { setLoading(false); }
  }

  async function doActivate() {
    if (!modelToActivate) return alert("Select a model to activate");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ollama/activate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelToActivate })
      });
      const jd = await res.json();
      if (jd && jd.error) alert(`Activate: ${jd.error}`); else alert("Activated.");
      await fetchStatus();
    } catch (err) {
      alert("Activate failed: " + (err?.message || String(err)));
    } finally { setLoading(false); }
  }

  async function doDelete() {
    if (!modelToDelete) return alert("Select a model to delete");
    if (!window.confirm(`Delete model ${modelToDelete}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ollama/model/delete`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelToDelete })
      });
      const jd = await res.json();
      if (jd && jd.error) alert(`Delete: ${jd.error}`); else alert("Deleted.");
      await fetchStatus();
    } catch (err) {
      alert("Delete failed: " + (err?.message || String(err)));
    } finally { setLoading(false); }
  }

  return (
    <div className="ollama-panel" style={{ padding: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0 }}>Ollama</h3>
          {showSysInfo && <small style={{ color: "rgba(255,255,255,0.7)" }}>Local model manager & installer</small>}
        </div>
        <div>
          <button className="fantasy-button" onClick={fetchStatus} disabled={loading}>Refresh</button>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <div><strong>Installed:</strong> {String(status.installed || false)}</div>
        <div><strong>Version:</strong> {status.version || "—"}</div>
        <div><strong>GPU:</strong> {status.gpu ? `${status.gpu.brand || ""} ${status.gpu.model || ""}` : "—"}</div>

        <div>
          <strong>Local models</strong>
          <div style={{ marginTop: 6 }}>
            {Array.isArray(status.local) && status.local.length ? (
              <select
                value={modelToActivate || ""}
                onChange={(e) => { setModelToActivate(e.target.value); setModelToDelete(e.target.value); }}
                style={{ minWidth: 260 }}
              >
                {status.local.map((m) => {
                  const id = (m && (m.id || m.name)) || String(m);
                  const title = (m && (m.title || m.name)) || id;
                  return <option key={id} value={id}>{title}</option>;
                })}
              </select>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.6)" }}>No local models</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
          <button className="fantasy-button" onClick={doInstall} disabled={loading}>Install</button>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              placeholder="model id to pull"
              value={modelToPull}
              onChange={(e) => setModelToPull(e.target.value)}
              style={{ minWidth: 220 }}
            />
            <button className="fantasy-button" onClick={doPull} disabled={loading || !modelToPull}>Pull</button>
          </div>

          <button className="fantasy-button" onClick={doActivate} disabled={loading || !modelToActivate}>Activate</button>
          <button className="fantasy-button" onClick={doDelete} disabled={loading || !modelToDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}