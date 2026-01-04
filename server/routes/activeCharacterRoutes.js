const express = require("express");
const router = express.Router();
const { setActiveCharacter, getActiveCharacter } = require("../models/activeCharacter");

// Set active character
router.post("/", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Character ID is required" });
  }

  setActiveCharacter(id);
  res.json({ success: true, id });
});

// Get active character
router.get("/", (req, res) => {
  const active = getActiveCharacter();

  if (!active) {
    return res.json({}); // No active character selected yet
  }

  res.json({ id: active.id });
});

module.exports = router;
