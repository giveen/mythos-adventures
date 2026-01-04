const express = require("express");
const router = express.Router();
const { rollDice } = require("../services/diceService");
const { getActiveCharacter } = require("../models/activeCharacter");

router.post("/skill-check", (req, res) => {
  const { ability } = req.body;
  const character = getActiveCharacter();

  if (!character) {
    return res.status(400).json({ error: "No active character selected" });
  }

  // Normalize ability keys and support stats stored under `character.stats`.
  const key = (ability || "").toLowerCase();
  const score = (character.stats && character.stats[key]) ?? character[key];

  if (typeof score !== "number") {
    return res.status(400).json({ error: `Invalid ability '${ability}' for active character` });
  }

  const mod = Math.floor((score - 10) / 2);
  const notation = `1d20${mod >= 0 ? "+" + mod : mod}`;
  const result = rollDice(notation);

  res.json({
    ability,
    modifier: mod,
    notation,
    ...result
  });
});

module.exports = router;
