const equipmentModel = require("../models/equipmentModel");

function listEquipment(req, res) {
  try {
    const items = equipmentModel.getAllEquipment();
    res.json(items);
  } catch (err) {
    console.error("Equipment list error:", err);
    res.status(500).json({ error: "Failed to list equipment" });
  }
}

function getEquipment(req, res) {
  try {
    const id = req.params.id;
    const item = equipmentModel.getEquipment(id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("Get equipment error:", err);
    res.status(500).json({ error: "Failed to load equipment" });
  }
}

module.exports = { listEquipment, getEquipment };
