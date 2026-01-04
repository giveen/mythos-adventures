const characterModel = require("../models/characterModel");
const activeCharacter = require("../models/activeCharacter");

function ensureArray(a) {
  return Array.isArray(a) ? a : [];
}

async function executeAction(action) {
  if (!action || typeof action !== "object") {
    throw new Error("Invalid action");
  }

  const type = action.action;
  const charId = action.character_id || action.characterId || null;
  if (!charId) throw new Error("Missing character_id in action");

  const character = characterModel.getCharacter(charId);
  if (!character) throw new Error("Character not found: " + charId);

  // Permissions: only allow actions targeting the currently active character
  const active = activeCharacter.getActiveCharacter();
  if (!active || active.id !== charId) {
    throw new Error("Action not allowed: target character is not the active character");
  }

  // Simple rate limiter per-character: maxActions per windowMs
  const now = Date.now();
  const windowMs = 60 * 1000; // 60 seconds
  const maxActions = 15;
  const record = rateLimits.get(charId) || { count: 0, start: now };
  if (now - record.start > windowMs) {
    record.count = 0;
    record.start = now;
  }
  if (record.count >= maxActions) {
    throw new Error("Rate limit exceeded for character actions");
  }
  record.count += 1;
  rateLimits.set(charId, record);

  switch (type) {
    case "give_item": {
      const item = action.item;
      if (!item) throw new Error("Missing item in give_item action");

      const inventory = ensureArray(character.inventory).slice();
      inventory.push(item);

      const updated = characterModel.updateCharacter(charId, { inventory });
      return { success: true, updated };
    }
    case "remove_item": {
      const item = action.item || action.item_name || action.itemName;
      if (!item) throw new Error("Missing item or item_name in remove_item action");

      const inventory = ensureArray(character.inventory).slice();
      const idx = inventory.findIndex((it) => {
        if (!it) return false;
        if (typeof it === "string") return it === item;
        return (it.id && it.id === item) || (it.name && it.name === item) || (it.name && it.name === item.name);
      });

      if (idx === -1) {
        return { success: false, message: "Item not found in inventory" };
      }

      inventory.splice(idx, 1);
      const updated = characterModel.updateCharacter(charId, { inventory });
      return { success: true, updated };
    }
    case "level_up": {
      const levels = Number(action.levels || 1);
      const newLevel = (Number(character.level) || 1) + levels;
      // Optionally adjust HP or proficiency here; keep simple increment.
      const updated = characterModel.updateCharacter(charId, { level: newLevel });
      return { success: true, updated };
    }
    case "add_xp": {
      const xpAdd = Number(action.xp || 0);
      const newXp = (Number(character.xp) || 0) + xpAdd;
      const updated = characterModel.updateCharacter(charId, { xp: newXp });
      return { success: true, updated };
    }
    case "set_stat": {
      const stat = (action.stat || action.attribute || "").toLowerCase();
      const value = Number(action.value);
      if (!stat || Number.isNaN(value)) throw new Error("Missing/invalid stat or value in set_stat action");

      const stats = Object.assign({}, character.stats || {});
      stats[stat] = value;
      const updated = characterModel.updateCharacter(charId, { stats });
      return { success: true, updated };
    }
    case "add_feature": {
      const feature = action.feature;
      if (!feature) throw new Error("Missing feature in add_feature action");

      const features = ensureArray(character.class_features).slice();
      features.push(feature);
      const updated = characterModel.updateCharacter(charId, { class_features: features });
      return { success: true, updated };
    }
    case "remove_feature": {
      const feature = action.feature;
      if (!feature) throw new Error("Missing feature in remove_feature action");

      const features = ensureArray(character.class_features).slice();
      const idx = features.findIndex((f) => {
        if (typeof f === "string") return f === feature || f === feature.name;
        return (f.id && f.id === feature) || (f.name && (f.name === feature || f.name === feature.name));
      });

      if (idx === -1) return { success: false, message: "Feature not found" };
      features.splice(idx, 1);
      const updated = characterModel.updateCharacter(charId, { class_features: features });
      return { success: true, updated };
    }
    case "grant_spell": {
      const spell = action.spell;
      if (!spell) throw new Error("Missing spell in grant_spell action");

      const metadata = Object.assign({}, character.metadata || {});
      metadata.spells = ensureArray(metadata.spells).slice();
      metadata.spells.push(spell);
      const updated = characterModel.updateCharacter(charId, { metadata });
      return { success: true, updated };
    }
    case "remove_spell": {
      const spell = action.spell || action.spell_name;
      if (!spell) throw new Error("Missing spell in remove_spell action");

      const metadata = Object.assign({}, character.metadata || {});
      metadata.spells = ensureArray(metadata.spells).slice();
      const idx = metadata.spells.findIndex((s) => {
        if (!s) return false;
        if (typeof s === "string") return s === spell;
        return (s.id && s.id === spell) || (s.name && (s.name === spell || s.name === spell.name));
      });

      if (idx === -1) return { success: false, message: "Spell not found" };
      metadata.spells.splice(idx, 1);
      const updated = characterModel.updateCharacter(charId, { metadata });
      return { success: true, updated };
    }
    case "adjust_hp": {
      const amount = Number(action.amount || action.hp || 0);
      if (Number.isNaN(amount)) throw new Error("Missing/invalid amount in adjust_hp action");

      const current = Number(character.hit_points || 0);
      const newHp = Math.max(0, current + amount);
      const updated = characterModel.updateCharacter(charId, { hit_points: newHp });
      return { success: true, updated };
    }
    default:
      throw new Error("Unknown action type: " + String(type));
  }
}

const rateLimits = new Map();

function resetRateLimits() {
  rateLimits.clear();
}

module.exports = { executeAction, resetRateLimits };
