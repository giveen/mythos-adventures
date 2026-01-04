const db = require("../db/characters");

function seedIfEmpty() {
  const row = db.prepare(`SELECT COUNT(1) as c FROM equipment`).get();
  if (row && row.c > 0) return;

  const items = [
    { name: 'Longsword', category: 'Martial Weapon', cost: '15 gp', weight: 3, properties: ['versatile'], description: 'A versatile slashing weapon.' },
    { name: 'Shortsword', category: 'Simple/Martial', cost: '10 gp', weight: 2, properties: ['finesse'], description: 'A light blade useful for quick attacks.' },
    { name: 'Shield', category: 'Armor/Shield', cost: '10 gp', weight: 6, properties: [], description: 'A simple shield that grants +2 AC when used.' },
    { name: 'Potion of Healing', category: 'Consumable', cost: '50 gp', weight: 0.5, properties: [], description: 'Heals 2d4+2 hit points when consumed.' }
  ];

  const stmt = db.prepare(`INSERT INTO equipment (name, category, cost, cost_gp, weight, properties, description, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertMany = db.transaction((rows) => {
    for (const r of rows) {
      const costGp = null;
      stmt.run(r.name, r.category, r.cost, costGp, r.weight, JSON.stringify(r.properties || []), r.description || '', r.source || 'seed');
    }
  });

  insertMany(items);
}

function getAllEquipment() {
  seedIfEmpty();
  const rows = db.prepare(`SELECT * FROM equipment ORDER BY name ASC`).all();
  return rows.map(r => ({ ...r, properties: r.properties ? JSON.parse(r.properties) : [] }));
}

function getEquipment(id) {
  const row = db.prepare(`SELECT * FROM equipment WHERE id = ?`).get(id);
  if (!row) return null;
  return { ...row, properties: row.properties ? JSON.parse(row.properties) : [] };
}

module.exports = { getAllEquipment, getEquipment };

function _asString(val) {
  if (val == null) return null;
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val);
  } catch (e) {
    return String(val);
  }
}

function _asNumber(val) {
  if (val == null) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

const { parseCostToGp } = require('../services/costService');

function upsertEquipment(item) {
  // item: { name, category, cost, weight, properties, description, source }
  if (!item || !item.name) return null;
  const existing = db.prepare(`SELECT id FROM equipment WHERE name = ?`).get(String(item.name));

  const payload = {
    name: String(item.name),
    category: _asString(item.category),
    cost: _asString(item.cost),
    cost_gp: parseCostToGp(item.cost) || null,
    weight: _asNumber(item.weight),
    properties: item.properties ? _asString(item.properties) : null,
    description: _asString(item.description),
    source: _asString(item.source) || 'open5e'
  };

  if (existing && existing.id) {
    const stmt = db.prepare(`UPDATE equipment SET category = @category, cost = @cost, cost_gp = @cost_gp, weight = @weight, properties = @properties, description = @description, source = @source WHERE id = @id`);
    stmt.run({ ...payload, id: existing.id });
    return existing.id;
  } else {
    const stmt = db.prepare(`INSERT INTO equipment (name, category, cost, cost_gp, weight, properties, description, source) VALUES (@name, @category, @cost, @cost_gp, @weight, @properties, @description, @source)`);
    const info = stmt.run(payload);
    return info.lastInsertRowid;
  }
}

module.exports = { getAllEquipment, getEquipment, upsertEquipment };
