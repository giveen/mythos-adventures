import React, { useState } from "react";
import "./CharacterManagement.css";
// XP thresholds (DnD5e)
const XP_THRESHOLDS = [
  0,300,900,2700,6500,14000,23000,34000,48000,64000,
  85000,100000,120000,140000,165000,195000,225000,265000,305000,355000
];

export default function CharacterManagement({ characters = [], onCreate, onUse, onDelete, activeCharacter }) {
  const [viewCharId, setViewCharId] = useState(null);

  function openCharacterView(char) {
    setViewCharId(char.id);
  }

  function closeCharacterView() {
    setViewCharId(null);
  }
  return (
    <div className="page-container">
      <h1 className="page-title">Character Management</h1>

      <button className="fantasy-button create-button" onClick={onCreate}>
        + Create New Character
      </button>

      <h2 className="section-title">Existing Characters</h2>

      <div className="character-list">
        {characters.map((char) => {
          // Safe defaults so the UI never crashes
          const stats = char.stats || {};
          const isActive = activeCharacter && activeCharacter.id === char.id;

          return (
            <div key={char.id} className={`character-card${isActive ? " active" : ""}`}>
              <h3 className="character-name">
                {char.name} — {char.class} (Lv {char.level})
              </h3>

              <div className="character-meta">
                <p><strong>Alignment:</strong> {char.alignment}</p>
                <p><strong>Background:</strong> {char.background}</p>
                <p><strong>Gold:</strong> {Number(char.gold || 0)} gp</p>
                <p><strong>XP:</strong> {Number(char.xp || 0)} {char.level < 20 ? `(${Number(char.xp||0)}/${XP_THRESHOLDS[char.level]})` : '(max level)'}</p>
              </div>

              <div className="attributes-grid">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="attribute">
                    <span className="attr-label">{key.toUpperCase()}</span>
                    <span className="attr-value">{value}</span>
                  </div>
                ))}
              </div>

              <button
                className="fantasy-button use-button"
                onClick={() => {
                  if (!isActive) onUse(char);
                }}
                disabled={isActive}
              >
                {isActive ? "Using" : "Use This Character"}
              </button>

              <button className="fantasy-button view-button" onClick={() => openCharacterView(char)}>
                View
              </button>
              <button className="fantasy-button delete-button"
                onClick={() => {
                  if (!onDelete) return;
                  if (window.confirm(`Delete character '${char.name}'? This cannot be undone.`)) {
                    onDelete(char.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {viewCharId && (() => {
        const viewed = characters.find((c) => c.id === viewCharId);
        if (!viewed) return null;

        const stats = viewed.stats || {};
        const inventory = Array.isArray(viewed.inventory) ? viewed.inventory : [];
        const metadata = viewed.metadata || {};
        const spells = Array.isArray(metadata.spells) ? metadata.spells : [];
        const curXp = Number(viewed.xp || 0);
        const nextXp = viewed.level < 20 ? XP_THRESHOLDS[viewed.level] : null;
        const pct = nextXp ? Math.min(100, Math.round((curXp / nextXp) * 100)) : 100;

        return (
          <div className="character-view-panel">
            <div className="view-header">
              <h2>{viewed.name} — {viewed.class} (Lv {viewed.level})</h2>
              <div style={{textAlign:'right'}}>
                <div><strong>Gold:</strong> {Number(viewed.gold || 0)} gp</div>
                <div style={{marginTop:6}}><strong>XP:</strong> {curXp} {nextXp ? ` / ${nextXp}` : ''}</div>
                {nextXp && (
                  <div style={{height:8,background:'rgba(0,0,0,0.25)',borderRadius:6,marginTop:6}}>
                    <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#7a4f22,#c9a86a)',borderRadius:6}} />
                  </div>
                )}
              </div>
              <div className="view-actions">
                <button className="fantasy-button" onClick={closeCharacterView}>Close</button>
              </div>
            </div>

            <div className="view-grid">
              <div className="view-section">
                <h3>Attributes</h3>
                <div className="grid">
                  {Object.entries(stats).map(([k, v]) => (
                    <div key={k} className="pill"><strong>{k.toUpperCase()}</strong><div>{v}</div></div>
                  ))}
                </div>
              </div>

              <div className="view-section">
                <h3>Inventory</h3>
                {inventory.length === 0 ? <div className="pill">(empty)</div> : (
                  <div className="list">
                    {inventory.map((it, i) => (
                      <div key={i} className="pill">{typeof it === 'string' ? it : (it.name || JSON.stringify(it))}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="view-section">
                <h3>Spells</h3>
                {spells.length === 0 ? <div className="pill">(none)</div> : (
                  <div className="list">
                    {spells.map((s, i) => (
                      <div key={i} className="pill">{typeof s === 'string' ? s : (s.name || JSON.stringify(s))}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="view-section full">
                <h3>Background / Notes</h3>
                <pre className="notes">{viewed.background || ''}</pre>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
