// entire file content ...
import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';

export function StatsPanel() {
  const { playerStats, gameStats } = useContext(GameContext);

  return (
    <div className="stats-panel">
      <h2>Adventurer</h2>
      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-label">Name:</span>
          <span className="stat-value">{playerStats.name || 'Unnamed'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">HP:</span>
          <span className="stat-value">{playerStats.hp}/100</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Gold:</span>
          <span className="stat-value">{playerStats.gold}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Level:</span>
          <span className="stat-value">{playerStats.level}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">XP:</span>
          <span className="stat-value">{playerStats.xp}</span>
        </div>
      </div>

      {gameStats && (
        <div className="quest-stats">
          <h3>Quest Log</h3>
          <p>Completed: {gameStats.completed_quests || 0}</p>
          <p>Last saved: {new Date(gameStats.last_save).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
