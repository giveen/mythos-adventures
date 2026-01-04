const {
  createCharacter,
  getAllCharacters,
  getCharacter,
  deleteCharacter
} = require("../models/characterModel");

async function create(req, res) {
  try {
    const id = createCharacter(req.body);
    res.json({ success: true, id });
  } catch (err) {
    console.error("Character create error:", err);
    res.status(500).json({ error: "Failed to create character" });
  }
}

async function list(req, res) {
  try {
    const chars = getAllCharacters();
    res.json(chars);
  } catch (err) {
    console.error("Character list error:", err);
    res.status(500).json({ error: "Failed to fetch characters" });
  }
}

async function get(req, res) {
  try {
    const char = getCharacter(req.params.id);
    if (!char) return res.status(404).json({ error: "Not found" });
    res.json(char);
  } catch (err) {
    console.error("Character get error:", err);
    res.status(500).json({ error: "Failed to fetch character" });
  }
}

async function remove(req, res) {
  try {
    deleteCharacter(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Character delete error:", err);
    res.status(500).json({ error: "Failed to delete character" });
  }
}

module.exports = {
  create,
  list,
  get,
  remove
};
