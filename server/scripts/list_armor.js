const db = require('../db/init');

const sql = "SELECT id,name,category,cost,cost_gp,source FROM equipment WHERE category LIKE '%Armor%' OR name LIKE '%plate%' OR name LIKE '%Armor%' OR category LIKE '%armor%' ORDER BY cost_gp DESC LIMIT 200";
const rows = db.prepare(sql).all();
console.log('armor count:', rows.length);
console.log(rows.slice(0,40));
