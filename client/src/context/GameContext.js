import React, { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [error, setError] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);

  async function fetchCharacters() {
    setLoadingCharacters(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/characters");
      if (!res.ok) throw new Error("Failed to fetch characters");
      const data = await res.json();

      // Ensure stats/inventory/skills always exist
      const normalized = data.map((char) => ({
        ...char,
        stats: char.stats || {},
        inventory: char.inventory || [],
        skills: char.skills || []
      }));

      setCharacters(normalized);
    } catch (err) {
      console.error("Fetch characters error:", err);
      setError(err.message || "Failed to load characters");
    } finally {
      setLoadingCharacters(false);
    }
  }

  async function createCharacter(payload) {
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to create character");
      const { id } = await res.json();

      // Option A: refetch list
      await fetchCharacters();

      return id;
    } catch (err) {
      console.error("Create character error:", err);
      setError(err.message || "Failed to create character");
      throw err;
    }
  }

  async function deleteCharacter(id) {
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/characters/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete character");
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete character error:", err);
      setError(err.message || "Failed to delete character");
    }
  }

  async function useCharacter(char) {
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/active-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: char.id })
      });

      if (!res.ok) throw new Error("Failed to set active character");
      setActiveCharacter(char);
    } catch (err) {
      console.error("Set active character error:", err);
      setError(err.message || "Failed to set active character");
      throw err;
    }
  }

  useEffect(() => {
    fetchCharacters();
  }, []);

  const value = {
    characters,
    loadingCharacters,
    error,
    fetchCharacters,
    createCharacter,
    deleteCharacter,
    useCharacter,
    activeCharacter
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
