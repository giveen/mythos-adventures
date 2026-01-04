const equipmentModel = require('../models/equipmentModel');
const characterModel = require('../models/characterModel');
const { parseCostToGp } = require('../services/costService');

function _parseRarityFromText(text) {
  if (!text) return null;
  const t = String(text).toLowerCase();
  if (t.includes('legendary')) return 'legendary';
  if (t.includes('very rare') || t.includes('very-rare')) return 'very rare';
  if (t.includes('rare')) return 'rare';
  if (t.includes('uncommon')) return 'uncommon';
  if (t.includes('common')) return 'common';
  return null;
}

function _minLevelForRarity(r) {
  if (!r) return 1;
  switch (r) {
    case 'common': return 1;
    case 'uncommon': return 5;
    case 'rare': return 11;
    case 'very rare': return 17;
    case 'legendary': return 20;
    default: return 1;
  }
}

const activeCharModel = require('../models/activeCharacter');

async function listMarket(req, res) {
  try {
    const { characterId } = req.query || {};
    let effectiveCharacterId = characterId;
    // if no characterId provided, try server-side active character
    if (!effectiveCharacterId) {
      const ac = activeCharModel.getActiveCharacter();
      if (ac && ac.id) effectiveCharacterId = ac.id;
    }
    const items = equipmentModel.getAllEquipment();

    // remove trinkets from any market listing
    const nonTrinketItems = items.filter(it => !(it.category && String(it.category).toLowerCase() === 'trinket'));
    if (!effectiveCharacterId) return res.json(nonTrinketItems);

    const char = characterModel.getCharacter(effectiveCharacterId);
    if (!char) return res.status(404).json({ error: 'Character not found' });

    const charLevel = Number(char.level || 1);
    const charGold = Number(char.gold || 0);

    const filtered = nonTrinketItems.filter(it => {
      // affordability: require a known cost_gp and cost <= gold
      const gp = it.cost_gp != null ? Number(it.cost_gp) : null;
      // treat null or zero as unknown/unpriced and hide from affordable list
      if (gp == null || gp === 0) return false;
      if (gp > charGold) return false;

      // level usability: try to infer rarity from category/description/properties
      const catText = it.category ? String(it.category) : '';
      const descText = it.description ? String(it.description) : '';
      const propsText = Array.isArray(it.properties) ? it.properties.join(' ') : (it.properties || '');
      const rarity = _parseRarityFromText(catText) || _parseRarityFromText(descText) || _parseRarityFromText(propsText);
      const minLevel = _minLevelForRarity(rarity);
      if (charLevel < minLevel) return false;

      return true;
    });

    res.json(filtered);
  } catch (err) {
    console.error('Market list error:', err);
    res.status(500).json({ error: 'Failed to list market items' });
  }
}

async function purchase(req, res) {
  try {
    const { characterId, equipmentId, quantity = 1 } = req.body || {};
    if (!characterId || !equipmentId) return res.status(400).json({ error: 'characterId and equipmentId required' });

    const char = characterModel.getCharacter(characterId);
    if (!char) return res.status(404).json({ error: 'Character not found' });

    const item = equipmentModel.getEquipment(equipmentId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // prevent purchasing trinkets through the market
    if (item.category && String(item.category).toLowerCase() === 'trinket') return res.status(400).json({ error: 'Item not available in market' });

    const unitQty = Number(quantity || 1);
    const baseGp = item.cost_gp != null ? Number(item.cost_gp) : (parseCostToGp(item.cost) || 0);
    const costGp = baseGp * unitQty;
    const curGold = Number(char.gold || 0);
    if (curGold < costGp) return res.status(400).json({ error: 'Insufficient gold' });

    // Deduct gold and add to inventory
    const inv = Array.isArray(char.inventory) ? [...char.inventory] : [];
    // store simplified item representation
    inv.push({ id: item.id, name: item.name, cost: item.cost, qty: Number(quantity) });

    const updated = characterModel.updateCharacter(characterId, { gold: curGold - costGp, inventory: inv });
    res.json({ success: true, character: updated });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
}

module.exports = { listMarket, purchase };
