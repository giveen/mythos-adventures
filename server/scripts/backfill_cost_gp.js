// require init so migrations run and schema is applied
const db = require('../db/init');
const { parseCostToGp } = require('../services/costService');

function backfill() {
  const rows = db.prepare('SELECT id, cost FROM equipment').all();
  let updated = 0;
  const stmt = db.prepare('UPDATE equipment SET cost_gp = ? WHERE id = ?');
  const tx = db.transaction((rows) => {
    for (const r of rows) {
      const gp = parseCostToGp(r.cost);
      if (gp != null) {
        stmt.run(gp, r.id);
        updated++;
      }
    }
  });
  tx(rows);
  console.log(`Backfill complete. Updated ${updated} rows with cost_gp.`);
}

backfill();
