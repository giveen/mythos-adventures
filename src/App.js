import React, { useState, useEffect } from 'react';
import { GameProvider, GameContext } from './context/GameContext';
import ChatBox from './components/ChatBox';
import ResponseBox from './components/ResponseBox';
import {
  createGameSession,
  updateGameSession,
  addStoryEvent,
  getWorldState,
  updateWorldState
} from './services/dbService';

const AppContent = () => {
  const [inputHistory, setInputHistory] = useState([]);
  const [storySessionId, setStorySessionId] = useState(null);
  const { currentScene, setCurrentScene, playerStats } = React.useContext(GameContext);

  // Initialize story tracking when component mounts
  useEffect(() => {
    async function initializeStoryTracking() {
      try {
        // Create a new game session if we have a player name
        if (playerStats.name) {
          const sessionId = await createGameSession(
            null, // We'll need to get the actual game ID from context
            new Date().toISOString(),
            currentScene || "Game started"
          );

          setStorySessionId(sessionId);

          // Add initial event for game start
          if (currentScene) {
            await addStoryEvent(sessionId, 'story', `Game began with scene: ${currentScene}`, 4);
          }
        }
      } catch (error) {
        console.error('Error initializing story tracking:', error);
      }
    }

    initializeStoryTracking();
  }, [playerStats.name, currentScene]);

  const handleSendMessage = async (message) => {
    // Add the message to input history
    setInputHistory([...inputHistory, { text: message, sender: 'user' }]);

    try {
      // In a real app, you would call your LLM API here
      // For this example, we'll just echo back with a casual response
      const llmResponse = `Got it! You said: "${message}". What's next?`;

      // Add LLM response to history
      setInputHistory(prev => [...prev, { text: llmResponse, sender: 'llm' }]);

      // Update current scene with the new interaction
      setCurrentScene(llmResponse);

      // Record this interaction in story tracking if we have a session
      if (storySessionId) {
        await addStoryEvent(
          storySessionId,
          'dialogue',
          `Player: ${message}\nLLM: ${llmResponse}`,
          3
        );
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  const handleGameEnd = async () => {
    try {
      // Update the story session with end time and summary
      if (storySessionId && currentScene) {
        await updateGameSession(storySessionId, {
          end_time: new Date().toISOString(),
          summary: `Game ended. Final scene: ${currentScene}`
        });

        // Add final event
        await addStoryEvent(
          storySessionId,
          'story',
          'Game session ended',
          5
        );
      }
    } catch (error) {
      console.error('Error handling game end:', error);
    }
  };

  return (
    <div className="app-container">
      <ResponseBox messages={inputHistory} />
      <ChatBox onSendMessage={handleSendMessage} onGameEnd={handleGameEnd} />
    </div>
  );
};

const App = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
