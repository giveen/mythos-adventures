// entire file content ...
import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';

export function QuestLog() {
  const { questLog, completeQuest } = useContext(GameContext);

  return (
    <div className="quest-log">
      <h2>Quests</h2>
      {questLog.length === 0 ? (
        <p>No quests available. Speak to NPCs to find adventures!</p>
      ) : (
        <ul className="quest-list">
          {questLog.map(quest => (
            <li key={quest.id} className={`quest-item ${quest.completed ? 'completed' : ''}`}>
              <div className="quest-header">
                <h3>{quest.title}</h3>
                {!quest.completed && (
                  <button
                    onClick={() => completeQuest(quest.id)}
                    className="complete-button"
                  >
                    Complete
                  </button>
                )}
              </div>
              <p>{quest.description}</p>
              {quest.reward_gold > 0 && <p>Reward: {quest.reward_gold} gold</p>}
              {quest.reward_xp > 0 && <p>XP: {quest.reward_xp}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
