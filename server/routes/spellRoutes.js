const express = require('express');
const router = express.Router();
const db = require('../db/characters');

// GET /api/spells?level=1&class=Wizard
router.get('/', (req, res) => {
  try {
    const level = req.query.level ? Number(req.query.level) : null;
    const cls = (req.query.class || '').toLowerCase();
    const schoolQ = (req.query.school || '').toLowerCase();

    const magicClasses = ['wizard','sorcerer','warlock','cleric','druid','bard','paladin','ranger','artificer'];
    if (cls && !magicClasses.includes(cls)) {
      return res.json([]);
    }

    // base where clauses and params
    const where = [];
    const params = [];
    if (level != null) {
      where.push(`(level IS NOT NULL AND level <= ?)`);
      params.push(level);
    }

    // class membership: require classes column to include requested class when provided
    if (cls) {
      where.push(`(classes IS NOT NULL AND lower(classes) LIKE ?)`);
      params.push(`%${cls}%`);
    }

    // school filter when provided
    if (schoolQ) {
      where.push(`(school IS NOT NULL AND lower(school) = ?)`);
      params.push(schoolQ);
    }

    // avoid extreme spells for starters
    const deny = ['summon','demon','devil','planar','resurrect','resurrection','wish','true ','power word','meteor','create undead','animate dead'];
    for (const d of deny) {
      where.push(`lower(name) NOT LIKE ?`);
      params.push(`%${d}%`);
    }

    const sql = `SELECT id,name,level,school,components,source,classes FROM spells ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY RANDOM() LIMIT 200`;
    const rows = db.prepare(sql).all(...params);
    res.json(rows);
  } catch (err) {
    console.error('spells list error', err);
    res.status(500).json({ error: 'Failed to list spells' });
  }
});

module.exports = router;
