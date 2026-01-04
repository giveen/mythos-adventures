const db = require("../db/characters");
const { v4: uuidv4 } = require("uuid");
const { levelForXp } = require("../services/levelService");
const equipmentModel = require('./equipmentModel');
const spellsDb = require('../db/characters');

// Safely parse JSON fields from SQLite
function safeParse(value, fallback) {
  try {
    if (typeof value === "string") return JSON.parse(value);
    if (typeof value === "object" && value !== null) return value;
  } catch (err) {
    console.warn("Failed to parse JSON:", value);
  }
  return fallback;
}

function createCharacter(data) {
  const id = uuidv4();
  const now = new Date().toISOString();

    // compute starting gold based on class
    const classKey = (data.class || '').toLowerCase();
    const diceService = require('../services/diceService');
    let gold = 0;
    try {
      switch (classKey) {
        case 'barbarian': {
          const r = diceService.rollDice('2d4');
          gold = r.total * 10;
          break;
        }
        case 'bard':
        case 'cleric':
        case 'fighter':
        case 'paladin':
        case 'ranger': {
          const r = diceService.rollDice('5d4');
          gold = r.total * 10;
          break;
        }
        case 'rogue':
        case 'warlock':
        case 'wizard':
        case 'sorcerer':
        case 'sorceros':
        case 'mage':
        case 'mages': {
          const r = diceService.rollDice('4d4');
          gold = r.total * 10;
          break;
        }
        case 'druid': {
          const r = diceService.rollDice('2d4');
          gold = r.total * 10;
          break;
        }
        case 'monk': {
          const r = diceService.rollDice('5d4');
          gold = r.total; // monk does not multiply by 10
          break;
        }
        default:
          gold = 0;
      }
    } catch (e) {
      gold = 0;
    }
    // starting-gold computed

    // prepare initial inventory and always assign one random trinket (if available)
    const initialInventory = Array.isArray(data.inventory) ? [...data.inventory] : [];
    try {
      const all = equipmentModel.getAllEquipment();
      const trinkets = all.filter(e => e.category && String(e.category).toLowerCase() === 'trinket');
      if (trinkets.length) {
        const pick = trinkets[Math.floor(Math.random() * trinkets.length)];
        initialInventory.push({ id: pick.id, name: pick.name, source: pick.source || 'dnd2024' });
      }
    } catch (e) {
      // non-fatal; proceed without trinket
      console.warn('Failed to assign trinket at creation', e);
    }

    // assign a starter spell for magic-using classes
    const magicClasses = ['wizard','sorcerer','warlock','cleric','druid','bard','paladin','ranger','artificer'];
    const assignedSpells = [];
    try {
      // If client provided a selected spell in metadata.spells, validate it against the spells table
      const charLevel = Number(data.level || levelForXp(data.xp || 0) || 1);
      if (data.metadata) {
        try {
          const meta = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata;
          if (Array.isArray(meta.spells) && meta.spells.length) {
            for (const s of meta.spells) {
              try {
                if (!s || (!s.id && !s.name)) continue;
                // prefer id-based lookup
                let row = null;
                if (s.id) {
                  row = spellsDb.prepare('SELECT id,name,level,school,source,classes FROM spells WHERE id = ?').get(s.id);
                }
                if (!row && s.name) {
                  // fallback to name match (case-insensitive)
                  row = spellsDb.prepare('SELECT id,name,level,school,source,classes FROM spells WHERE lower(name) = ?').get(String(s.name).toLowerCase());
                }
                if (!row) {
                  console.warn('Provided starter spell not found in DB:', s);
                  continue;
                }
                // Validate level
                if (row.level != null && Number(row.level) > charLevel) {
                  console.warn('Provided starter spell exceeds character level:', row.name, row.level, '>', charLevel);
                  continue;
                }
                // If spells table has a `classes` column, validate class membership (simple substring match)
                if (row.classes && classKey) {
                  try {
                    const classesStr = String(row.classes).toLowerCase();
                    if (!classesStr.includes(classKey.toLowerCase())) {
                      console.warn('Provided starter spell is not available to class:', row.name, 'for', classKey);
                      continue;
                    }
                  } catch (e) {
                    // ignore
                  }
                }
                assignedSpells.push({ id: row.id, name: row.name, level: row.level, school: row.school, source: row.source });
              } catch (inner) {
                console.warn('Error validating provided starter spell', inner && inner.message ? inner.message : inner);
              }
            }
          }
        } catch (e) {
          // ignore parsing errors
        }
      }

      // If no valid provided spells and this is a magic class, pick a random safe spell
      if (!assignedSpells.length) {
        if (magicClasses.includes(classKey)) {
          const denyWords = ['summon','demon','devil','planar','resurrect','resurrection','wish','true ','power word','meteor','create undead','animate dead'];
          let whereClauses = [`level IS NOT NULL AND level <= ${charLevel}`];
          for (const w of denyWords) whereClauses.push(`lower(name) NOT LIKE '%${w}%'`);
          const sql = `SELECT id,name,level,school,source FROM spells WHERE ${whereClauses.join(' AND ')} ORDER BY RANDOM() LIMIT 1`;
          const pick = spellsDb.prepare(sql).get();
          if (pick) assignedSpells.push(pick);
        }
      }
    } catch (err) {
      console.warn('Failed to assign starter spell:', err && err.message ? err.message : err);
    }

    const stmt = db.prepare(`INSERT INTO characters (id, name, class, race, background, alignment, level, xp, gold, hit_points, proficiency_bonus, stats, inventory, skills, class_features, race_traits, notes, metadata, portrait, createdAt, updatedAt) VALUES (@id, @name, @class, @race, @background, @alignment, @level, @xp, @gold, @hit_points, @proficiency_bonus, @stats, @inventory, @skills, @class_features, @race_traits, @notes, @metadata, @portrait, @createdAt, @updatedAt)`);
    // attach spells into metadata
    let initialMetadata = {};
    try {
      if (data.metadata) {
        initialMetadata = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata;
      }
    } catch (e) {
      initialMetadata = {};
    }
    if (!initialMetadata) initialMetadata = {};
    if (!Array.isArray(initialMetadata.spells) || initialMetadata.spells.length === 0) {
      initialMetadata.spells = assignedSpells.slice();
    } else {
      // merge without duplicates (by id)
      const seen = new Set(initialMetadata.spells.map(s => s.id));
      for (const s of assignedSpells) {
        if (!seen.has(s.id)) {
          initialMetadata.spells.push(s);
          seen.add(s.id);
        }
      }
    }

    stmt.run({
      id,
      name: data.name || "",
      class: data.class || "",
      race: data.race || "",
      background: data.background || "",
      alignment: data.alignment || "",
      level: data.level || levelForXp(data.xp || 0),
      xp: data.xp || 0,
      gold: gold || 0,
      hit_points: data.hit_points || 10,
      proficiency_bonus: data.proficiency_bonus || 2,
      stats: JSON.stringify(data.stats || {}),
      inventory: JSON.stringify(initialInventory || []),
      skills: JSON.stringify(data.skills || []),
      class_features: JSON.stringify(data.class_features || []),
      race_traits: JSON.stringify(data.race_traits || []),
      notes: data.notes || "",
      metadata: JSON.stringify(initialMetadata || {}),
      portrait: data.portrait || "",
      createdAt: now,
      updatedAt: now
    });

    return id;
}

function getAllCharacters() {
  const rows = db.prepare(`SELECT * FROM characters`).all();

  return rows.map((row) => ({
    ...row,
    stats: safeParse(row.stats, {}),
    inventory: safeParse(row.inventory, []),
    skills: safeParse(row.skills, []),
    class_features: safeParse(row.class_features, []),
    race_traits: safeParse(row.race_traits, []),
    metadata: safeParse(row.metadata, {})
  }));
}

function getCharacter(id) {
  const row = db.prepare(`SELECT * FROM characters WHERE id = ?`).get(id);
  if (!row) return null;

  return {
    ...row,
    stats: safeParse(row.stats, {}),
    inventory: safeParse(row.inventory, []),
    skills: safeParse(row.skills, []),
    class_features: safeParse(row.class_features, []),
    race_traits: safeParse(row.race_traits, []),
    metadata: safeParse(row.metadata, {})
  };
}

function deleteCharacter(id) {
  return db.prepare(`DELETE FROM characters WHERE id = ?`).run(id);
}

function updateCharacter(id, data) {
  const existing = getCharacter(id);
  if (!existing) return null;

  const merged = {
    ...existing,
    ...data,
    stats: data.stats ? data.stats : existing.stats,
    inventory: data.inventory ? data.inventory : existing.inventory,
    skills: data.skills ? data.skills : existing.skills,
    class_features: data.class_features ? data.class_features : existing.class_features,
    race_traits: data.race_traits ? data.race_traits : existing.race_traits,
    metadata: data.metadata ? data.metadata : existing.metadata
  };

  // Normalize xp to number and auto-calc level from xp if xp provided
  merged.xp = Number(merged.xp || 0);
  // derive level from xp (ensures level stays in sync with xp)
  try {
    merged.level = levelForXp(merged.xp);
  } catch (err) {
    // fallback to existing
    merged.level = merged.level || existing.level || 1;
  }

  const now = new Date().toISOString();

  const stmt = db.prepare(`
    UPDATE characters SET
      name = ?, race = ?, class = ?, background = ?, alignment = ?,
      level = ?, xp = ?, gold = ?, hit_points = ?, proficiency_bonus = ?,
      stats = ?, inventory = ?, skills = ?, class_features = ?, race_traits = ?,
      notes = ?, metadata = ?, portrait = ?, updatedAt = ?
    WHERE id = ?
  `);

  stmt.run(
    merged.name || "",
    merged.race || "",
    merged.class || "",
    merged.background || "",
    merged.alignment || "",
    merged.level || 1,
    merged.xp || 0,
    merged.gold || 0,
    merged.hit_points || 0,
    merged.proficiency_bonus || 2,
    JSON.stringify(merged.stats || {}),
    JSON.stringify(merged.inventory || []),
    JSON.stringify(merged.skills || []),
    JSON.stringify(merged.class_features || []),
    JSON.stringify(merged.race_traits || []),
    merged.notes || "",
    JSON.stringify(merged.metadata || {}),
    merged.portrait || "",
    now,
    id
  );

  return getCharacter(id);
}

module.exports = {
  createCharacter,
  getAllCharacters,
  getCharacter,
  deleteCharacter,
  updateCharacter
};

