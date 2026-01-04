// Scrape DungeonMasterTools items list and upsert prices into equipment
// Usage: node scripts/import_dmtools.js

const equipmentModel = require('../models/equipmentModel');
const db = require('../db/init');
const cheerio = require('cheerio');

(async function run(){
  const URL = 'https://dungeonmastertools.github.io/items.html';
  console.log('Fetching', URL);
  const fetchFn = (typeof fetch === 'function') ? fetch : (await import('node-fetch')).default;
  const res = await fetchFn(URL, { headers: { 'User-Agent': 'mythos-dmtools-importer/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${URL}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  // heuristic: find the first table with rows where first column looks like a name and second looks like a price
  const tables = $('table');
  let rows = [];
  tables.each((i, table) => {
    $(table).find('tbody tr').each((j, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 2) {
        const name = $(tds[0]).text().trim();
        const cost = $(tds[1]).text().trim();
        if (name) rows.push({ name, cost });
      }
    });
  });

  if (rows.length === 0) {
    // fallback: any tr elements
    $('tr').each((i, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 2) {
        const name = $(tds[0]).text().trim();
        const cost = $(tds[1]).text().trim();
        if (name) rows.push({ name, cost });
      }
    });
  }

  console.log('Found', rows.length, 'rows, starting upsert...');
  let upserted = 0;
  const notParsed = [];

  for (const r of rows) {
    const item = {
      name: r.name,
      cost: r.cost || null,
      source: 'dmtools'
    };
    try {
      equipmentModel.upsertEquipment(item);
      upserted++;
    } catch (err) {
      notParsed.push({ name: r.name, cost: r.cost, error: err.message });
    }
  }

  console.log(`DMTools import complete. Upserted ${upserted} items, ${notParsed.length} failures.`);
  if (notParsed.length) console.log('Failures sample:', notParsed.slice(0,10));
})();
