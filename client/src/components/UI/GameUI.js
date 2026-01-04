// entire file content ...
import React from 'react';
import { StatsPanel } from './StatsPanel';
import { QuestLog } from './QuestLog';

export function GameUI({ children }) {
  return (
    <div className="game-ui">
      <div className="main-content">
        {children}
      </div>
      <div className="sidebar">
        <StatsPanel />
        <QuestLog />
      </div>
    </div>
  );
}
