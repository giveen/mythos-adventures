#!/usr/bin/env node
const db = require('../db/characters');

// Fetch Open5e spells and update local spells.classes column by matching name
async function fetchJson(url) {
  const fetchFn = (typeof fetch === 'function') ? fetch : (await import('node-fetch')).default;
  const res = await fetchFn(url, { headers: { 'User-Agent': 'mythos-importer/1.0 (+https://example.local)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.json();
}

async function run() {
  console.log('Populating spell classes from Open5e...');
  const base = 'https://api.open5e.com/v2/spells/?limit=100';
  let url = base;
  let totalUpdated = 0;

  while (url) {
    console.log('Fetching', url);
    const data = await fetchJson(url);
    const results = data.results || [];
    for (const sp of results) {
      const name = (sp.name || '').trim();
      const classes = (sp.dnd_class || sp.classes || sp.class || sp.class_levels || null) || sp.classes;
      // open5e provides 'classes' as an array string or comma list; prefer sp.classes if present
      // normalize classes to comma-separated lowercase string
      let clsList = [];
      if (Array.isArray(sp.classes) && sp.classes.length) clsList = sp.classes.map(c => String(c).toLowerCase());
      else if (sp.classes && typeof sp.classes === 'string') clsList = sp.classes.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      else if (sp.dnd_class && typeof sp.dnd_class === 'string') clsList = sp.dnd_class.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

      if (!name) continue;

      // update local spells matching name (case-insensitive)
      try {
        const row = db.prepare('SELECT id, name FROM spells WHERE lower(name) = ? COLLATE NOCASE').get(name.toLowerCase());
        if (row) {
          const classesText = clsList.join(',');
          db.prepare('UPDATE spells SET classes = ? WHERE id = ?').run(classesText || null, row.id);
          totalUpdated++;
        } else {
          // try fuzzy match: like '%name%'
          const likeRow = db.prepare('SELECT id,name FROM spells WHERE lower(name) LIKE ? LIMIT 1').get(`%${name.toLowerCase()}%`);
          if (likeRow) {
            const classesText = clsList.join(',');
            db.prepare('UPDATE spells SET classes = ? WHERE id = ?').run(classesText || null, likeRow.id);
            totalUpdated++;
          }
        }
      } catch (err) {
        console.error('DB update failed for', name, err && err.message ? err.message : err);
      }
    }

    url = data.next || null;
    // be polite to API
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('Done. Updated', totalUpdated, 'spells with classes.');
}

run().catch(err => { console.error('Populate failed:', err); process.exit(1); });
