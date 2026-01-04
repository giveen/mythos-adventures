import React, { useEffect, useState, useRef } from 'react';
import './OllamaPanel.css';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Helper: compare version strings
function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0, nb = pb[i] || 0;
    if (na < nb) return -1;
    if (na > nb) return 1;
  }
  return 0;
}

export default function OllamaPanel() {
  // No gear icon, no floating panel logic. This is now a full settings panel.
  // Delete a model
  async function doDeleteModel(modelName) {
    if (!window.confirm(`Delete model ${modelName}? This cannot be undone.`)) return;
    setActivating(true);
    try {
      // Use JSON delete endpoint to avoid URL-encoding issues with slashes
      const res = await fetch(`${API_BASE}/api/ollama/model/delete`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelName })
      });
      const jd = await res.json();
      if (jd.deleted) {
        setMessage('Deleted: ' + modelName);
        await refreshStatusAndAvailable();
      } else {
        setMessage('Delete failed: ' + (jd.error || 'unknown error'));
      }
    } catch (e) {
      setMessage('Delete failed: ' + String(e));
    } finally {
      setActivating(false);
    }
  }
  // Remove open state, always open as a settings page
  const [status, setStatus] = useState(null);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [message, setMessage] = useState('');
  const [latest, setLatest] = useState(null);
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(null);
  const [progressModel, setProgressModel] = useState(null);
  const [activeModel, setActiveModel] = useState(null);
  const [activating, setActivating] = useState(false);
  const progressInterval = useRef(null);
  const rootRef = useRef(null);

  async function loadActiveModel() {
    try {
      const res = await fetch(`${API_BASE}/api/ollama/active-model`);
      const jd = await res.json();
      setActiveModel(jd.active);
    } catch (e) {
      setActiveModel(null);
    }
  }

  async function checkLatest() {
    setChecking(true);
    try {
      const res = await fetch(`${API_BASE}/api/ollama/latest-version`);
      const jd = await res.json();
      setLatest(jd.latest);
    } catch (e) {
      setLatest('error');
    } finally {
      setChecking(false);
    }
  }

  async function loadStatus() {
    try {
      const res = await fetch(`${API_BASE}/api/ollama/status`);
      const jd = await res.json();
      setStatus(jd);
    } catch (e) {
      setStatus({ error: String(e) });
    }
  }

  useEffect(() => {
    loadStatus();
    loadActiveModel();
    loadAvailable();
  }, []);

  // cleanup polling interval when component unmounts
  useEffect(() => {
    return () => {
      if (progressInterval.current) { clearInterval(progressInterval.current); progressInterval.current = null; }
    };
  }, []);

  async function doActivate(model) {
    setActivating(true);
    try {
      // refresh state before activating
      await refreshStatusAndAvailable();
      await loadActiveModel();
      const res = await fetch(`${API_BASE}/api/ollama/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model })
      });
      const jd = await res.json();
      setActiveModel(jd.active);
      setMessage('Activated: ' + model);
      // refresh after activation so Available is updated
      await refreshStatusAndAvailable();
    } catch (e) {
      setMessage('Activation failed: ' + String(e));
    } finally {
      setActivating(false);
    }
  }

  async function loadAvailable() {
    try {
      const res = await fetch(`${API_BASE}/api/ollama/available`);
      const jd = await res.json();
      setAvailable(jd || []);
    } catch (e) {
      setAvailable([]);
    }
  }

  // Refresh status and available, filtering available to exclude installed models
  async function refreshStatusAndAvailable() {
    try {
      const sres = await fetch(`${API_BASE}/api/ollama/status`);
      const sjson = await sres.json();
      setStatus(sjson);
      const ares = await fetch(`${API_BASE}/api/ollama/available`);
      const ajson = await ares.json();
      const localList = (sjson && sjson.local ? sjson.local : []).map(x => (typeof x === 'string' ? x : (x.name || '')));
      const localNorm = new Set(localList.map(x => String(x).split('/').pop().split(':')[0]));
      const filtered = (ajson || []).filter(m => {
        const full = m && m.id ? m.id : (m || '');
        const norm = String(full).split('/').pop().split(':')[0];
        if (localList.includes(full)) return false;
        if (localNorm.has(norm)) return false;
        return true;
      });
      setAvailable(filtered);
    } catch (e) {
      await loadStatus();
      await loadAvailable();
    }
  }

  async function doDeactivate() {
    setActivating(true);
    try {
      const res = await fetch(`${API_BASE}/api/ollama/deactivate`, { method: 'POST' });
      const jd = await res.json();
      setActiveModel(null);
      setMessage('Deactivated');
      await refreshStatusAndAvailable();
    } catch (e) {
      setMessage('Deactivation failed: ' + String(e));
    } finally {
      setActivating(false);
    }
  }

  // No floating panel, so no need for document click listener

  async function doInstall() {
    setInstalling(true);
    setMessage('Installing/upgrading Ollama...');
    try {
      const res = await fetch(`${API_BASE}/api/ollama/install`, { method: 'POST' });
      await res.json();
      await loadStatus();
      setMessage('Install/upgrade complete');
    } catch (e) {
      setMessage('Install failed: ' + String(e));
    } finally { setInstalling(false); }
  }

  async function doPull(modelId) {
    setPulling(true);
    setMessage('Pulling ' + modelId + '...');
    setProgress(0);
    setProgressModel(modelId);
    // start polling pull-progress
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(async () => {
      try {
        const r = await fetch(`${API_BASE}/api/ollama/pull-progress?model=${encodeURIComponent(modelId)}`);
        const j = await r.json();
        if (j && typeof j.progress === 'number') setProgress(j.progress);
        if (j && j.status === 'done') setProgress(100);
      } catch (e) {
        // ignore polling errors
      }
    }, 800);

    try {
      const resPromise = fetch(`${API_BASE}/api/ollama/pull`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelId })
      });
      const res = await resPromise; // allow polling to run concurrently
      const jd = await res.json();
      if (jd.ok) {
        setMessage('Pulled: ' + modelId);
        // Re-fetch status and available lists and filter out the pulled model robustly
        try {
          const sres = await fetch(`${API_BASE}/api/ollama/status`);
          const sjson = await sres.json();
          setStatus(sjson);
          const ares = await fetch(`${API_BASE}/api/ollama/available`);
          const ajson = await ares.json();
          const localList = (sjson && sjson.local ? sjson.local : []).map(x => (typeof x === 'string' ? x : (x.name || '')));
          const localNorm = new Set(localList.map(x => String(x).split('/').pop().split(':')[0]));
          const filtered = (ajson || []).filter(m => {
            const full = m && m.id ? m.id : (m || '');
            const norm = String(full).split('/').pop().split(':')[0];
            if (localList.includes(full)) return false;
            if (localNorm.has(norm)) return false;
            return true;
          });
          setAvailable(filtered);
        } catch (e) {
          // fallback to robust local removal by normalized basename
          try {
            const normPulled = String(modelId).split('/').pop().split(':')[0];
            setAvailable(prev => (prev || []).filter(m => {
              const full = m && m.id ? m.id : '';
              const norm = String(full).split('/').pop().split(':')[0];
              if (!full) return true;
              if (full === modelId) return false;
              if (norm === normPulled) return false;
              if ((full || '').includes(modelId)) return false;
              return true;
            }));
          } catch (e2) {
            setAvailable(prev => (prev || []).filter(m => m.id !== modelId));
          }
        }
      } else {
        setMessage('Pull failed: ' + (jd.error || 'unknown'));
      }
    } catch (e) {
      setMessage('Pull failed: ' + String(e));
    } finally {
      if (progressInterval.current) { clearInterval(progressInterval.current); progressInterval.current = null; }
      setProgress(null);
      setProgressModel(null);
      setPulling(false);
    }
  }


  return (
    <div className="ollama-root" ref={rootRef}>
      {/* System info removed for now */}
      <div className="ollama-top-row">
        <div className="ollama-title">
          <strong>Ollama</strong>
          <div className="ollama-version">
            {status ? (
              status.installed ? `Installed — v${status.version || 'unknown'}` : 'Ollama not installed'
            ) : 'Checking...'}
          </div>
        </div>
        <div>
          {!status || !status.installed ? (
            <button className="fantasy-button" onClick={doInstall} disabled={installing}>{installing ? 'Installing...' : 'Install'}</button>
          ) : (
            <button className="fantasy-button" onClick={doInstall} disabled={installing}>{installing ? 'Upgrading...' : 'Upgrade'}</button>
          )}
        </div>
      </div>

      {/* Available models */}
      <div style={{marginBottom:12}}>
        <h3 style={{margin:'6px 0 8px 0'}}>Available Models</h3>
        <div className="ollama-model-list">
          {available && available.length > 0 ? (() => {
            const localList = (status && status.local ? status.local : []).map(m => (typeof m === 'string' ? m : (m.name || m)));
            const normalize = (id) => String(id || '').split('/').pop().split(':')[0];
            const localSetFull = new Set(localList);
            const localSetNorm = new Set(localList.map(normalize));
            const activeNorm = normalize(activeModel);
            return available.map(a => {
              const aFull = a.id;
              const aNorm = normalize(aFull);
              const installed = localSetFull.has(aFull) || localSetNorm.has(aNorm);
              const isActive = (activeModel === aFull) || (activeNorm && aNorm && activeNorm === aNorm);
              return (
                <div key={a.id} className="ollama-row model-item">
                  <div className="ollama-model-meta">
                    <div style={{fontWeight:600,color:'var(--text-color)'}}>{a.title || a.id}</div>
                    <div className="ollama-model-id">{a.id}</div>
                  </div>
                  <div className="ollama-actions">
                    {installed ? (
                      <>
                        <span className="ollama-installed-badge">Installed</span>
                        {!isActive && (
                          <button className="fantasy-button ollama-btn-small ollama-activate-button" onClick={()=>doActivate(aFull)} disabled={activating}>Activate</button>
                        )}
                      </>
                    ) : (
                      <>
                        {progressModel === aFull ? (
                          <div className="ollama-spinner-wrapper">
                            <div className="ollama-spinner" aria-hidden="true">⚙️</div>
                            <div style={{minWidth:72, textAlign:'right', fontSize:12, color:'var(--muted-color)'}}>{progress ? `${Math.round(progress)}%` : 'Starting...'}</div>
                          </div>
                        ) : (
                          <button className="fantasy-button ollama-btn-small ollama-pull-button" onClick={()=>doPull(aFull)} disabled={!!progressModel || pulling}>Pull</button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            });
          })() : (
            <div style={{color:'var(--muted-color)'}}>No available models found.</div>
          )}
        </div>
      </div>
      {status && status.local && status.local.length > 0 && (
        <div className="ollama-local-list">
          {status.local.map(m => {
            const modelName = typeof m === 'string' ? m : m.name;
            const shortName = (() => {
              if (!modelName) return '';
              const slash = modelName.lastIndexOf('/') >= 0 ? modelName.substring(modelName.lastIndexOf('/')+1) : modelName;
              return slash.split(':')[0];
            })();
            const isActive = activeModel === modelName || (activeModel && activeModel.split('/').pop().split(':')[0] === shortName);
            return (
              <div key={modelName} className="ollama-local-item">
                <div className="ollama-local-name" style={{color:isActive?'#7f7':'#9bd',fontWeight:isActive?'bold':'600'}}>{shortName}</div>
                <div className="ollama-actions">
                  {isActive ? (
                    <>
                      <button className="fantasy-button ollama-btn-small" onClick={doDeactivate} disabled={activating}>Deactivate</button>
                    </>
                  ) : (
                    <button className="fantasy-button ollama-btn-small ollama-activate-button" onClick={()=>doActivate(modelName)} disabled={activating}>Activate</button>
                  )}
                  <button className="fantasy-button ollama-btn-small ollama-delete-button" onClick={()=>doDeleteModel(modelName)} disabled={activating}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {message && <div className="ollama-message">{message}</div>}
    </div>
  );
}
