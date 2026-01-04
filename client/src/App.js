import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { GameProvider } from "./context/GameContext";
import { useGame } from "./context/GameContext";
import { useLLM } from "./hooks/useLLM";

import { ChatBox } from "./components/UI/ChatBox";
import { ResponseBox } from "./components/UI/ResponseBox";
import SessionHistory from "./components/UI/SessionHistory";
import SessionsPanel from "./components/UI/SessionsPanel";
import SettingsPage from "./pages/Settings";

import CharacterManagement from "./pages/CharacterManagement";
import { CharacterCreator } from "./components/characters/CharacterCreator";
import Market from "./components/Market";

function AppContent() {
  const { response, loading, generate } = useLLM();

  const handleSend = async (prompt) => {
    await generate(prompt);
  };

  return (
    <div className="main-container">
      <ResponseBox response={response} loading={loading} />
      <ChatBox onSend={handleSend} />
    </div>
  );
}

// ⭐ Character list page wrapper
function CharacterPageWrapper() {
  const { characters, deleteCharacter, useCharacter, activeCharacter } = useGame();

  return (
    <CharacterManagement
      characters={characters}
      onCreate={() => (window.location.href = "/characters/new")}
      onUse={useCharacter}
      onDelete={deleteCharacter}
      activeCharacter={activeCharacter}
    />
  );
}

// ⭐ Character creation page wrapper
function CreateCharacterWrapper() {
  const { createCharacter } = useGame();

  const handleCreate = async (character) => {
    await createCharacter(character);
    window.location.href = "/characters";
  };

  return (
    <CharacterCreator
      onCreate={handleCreate}
      onCancel={() => (window.location.href = "/characters")}
    />
  );
}

export default function App() {
  const [showHistory, setShowHistory] = useState(false);
  return (
    <GameProvider>
      <Router>

        {/* HEADER + NAV */}
        <div className="header-bar">

          <div className="header-top">
            <img
              src="/mythos-logo.png"
              alt="MythOS Logo"
              style={{
                height: "70px",
                borderRadius: "8px",
                objectFit: "contain"
              }}
            />
            <h1 style={{ margin: 0, fontSize: "2.2rem" }}>MythOS Adventures</h1>
          </div>

          <nav className="header-nav">
            <Link to="/">
              <button className="fantasy-button">Home</button>
            </Link>

            <Link to="/characters">
                <button className="fantasy-button">Characters</button>
            </Link>

            <Link to="/market">
              <button className="fantasy-button">Market</button>
            </Link>

            <button
              className="fantasy-button"
              onClick={() => setShowHistory(true)}
              style={{ marginLeft: 8 }}
            >
              History
            </button>
            <SessionsPanel />
            <Link to="/settings">
              <button className="fantasy-button" style={{ marginLeft: 8 }}>Settings</button>
            </Link>
            <button
              className="fantasy-button"
              onClick={async () => {
                const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";
                const { getMessages, clearMessages } = await import("./services/sessionService");
                const msgs = getMessages();

                // send to backend for summarization and saving
                try {
                  const res = await fetch(`${API_BASE}/api/session/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: "Quick Save", messages: msgs })
                  });

                  if (!res.ok) throw new Error("Failed to save session");
                  const jd = await res.json();
                  alert(jd && jd.summary ? "Session saved and summarized successfully." : "Session saved.");
                  clearMessages();
                } catch (err) {
                  console.error(err);
                  alert("Failed to save session to server.");
                }
              }}
            >
              Exit
            </button>
          </nav>

        </div>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/characters" element={<CharacterPageWrapper />} />
          <Route path="/characters/new" element={<CreateCharacterWrapper />} />
          <Route path="/market" element={<Market />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

      </Router>
      {showHistory && <SessionHistory onClose={() => setShowHistory(false)} />}
    </GameProvider>
  );
}
