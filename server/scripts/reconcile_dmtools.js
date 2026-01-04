const db = require('../db/init');
const { parseCostToGp } = require('../services/costService');

function normalizeName(n) {
  return String(n || '').toLowerCase().replace(/[^a-z0-9]+/g, '').trim();
}

function reconcile() {
  const dmrows = db.prepare("SELECT id,name,cost,cost_gp FROM equipment WHERE source='dmtools'").all();
  const map = new Map();
  for (const r of dmrows) map.set(normalizeName(r.name), r);

  const targets = db.prepare("SELECT id,name,cost,cost_gp,source FROM equipment WHERE cost_gp IS NULL OR cost_gp = 0").all();
  let updated = 0;
  const upd = db.prepare('UPDATE equipment SET cost = ?, cost_gp = ?, source = ? WHERE id = ?');

  for (const t of targets) {
    const key = normalizeName(t.name);
    const match = map.get(key);
    if (match) {
      const cost = match.cost || null;
      const gp = (match.cost_gp != null) ? match.cost_gp : parseCostToGp(cost);
      if (gp != null && gp > 0) {
        upd.run(cost, gp, (t.source || '') + '|dmtools', t.id);
        updated++;
      }
    }
  }

  console.log(`Reconcile complete. Updated ${updated} equipment rows from dmtools.`);
}

reconcile();
