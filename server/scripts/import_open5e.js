// Import equipment from Open5e API into local equipment table
// Usage: node scripts/import_open5e.js

const equipmentModel = require('../models/equipmentModel');

const BASE = 'https://api.open5e.com';
const INDEX = '/equipment/';
const PAGE_SIZE = 100;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function costToString(cost) {
  // open5e cost may be an object {quantity, unit} or a string
  if (!cost) return null;
  if (typeof cost === 'string') return cost;
  if (typeof cost === 'object' && cost.quantity != null) {
    return `${cost.quantity} ${cost.unit || 'gp'}`.trim();
  }
  return String(cost);
}

async function fetchJson(url) {
  const fetchFn = (typeof fetch === 'function') ? fetch : (await import('node-fetch')).default;
  const res = await fetchFn(url, { headers: { 'User-Agent': 'mythos-importer/1.0 (+https://example.local)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.json();
}

async function importAll() {
  console.log('Starting Open5e import...');
  const endpoints = ['/v2/weapons/', '/v2/armor/', '/v2/magicitems/', '/v2/equipment/'];
  let total = 0;

  for (const ep of endpoints) {
    let url = `${BASE}${ep}?limit=${PAGE_SIZE}`;
    try {
      while (url) {
        console.log('Fetching', url);
        const data = await fetchJson(url);
        const results = data.results || [];
        for (const r of results) {
          const item = {
            name: r.name,
            category: r.equipment_category || r.category || r.type || null,
            cost: costToString(r.cost || r.price || r.cost_string || null),
            weight: r.weight != null ? r.weight : (r.weight_kg != null ? r.weight_kg : null),
            properties: r.properties || r.property || r.properties || null,
            description: Array.isArray(r.desc) ? r.desc.join('\n\n') : (r.desc || r.description || r.long_description || null),
            source: `open5e:${ep}`,
          };
          try {
            equipmentModel.upsertEquipment(item);
            total++;
          } catch (err) {
            console.error('Upsert failed for', item.name, err.message);
          }
          await sleep(50);
        }
        url = data.next || null;
      }
    } catch (err) {
      console.warn(`Endpoint ${ep} failed or not found: ${err.message}`);
      // continue to next endpoint
    }
  }

  console.log(`Import complete. Upserted ~${total} items (est).`);
}

importAll().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
