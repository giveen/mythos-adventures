// Scrape dnd2024.wikidot.com equipment lists for selected categories and upsert items
// Usage: node scripts/import_dnd2024.js

const equipmentModel = require('../models/equipmentModel');
const db = require('../db/init');
const cheerio = require('cheerio');

const BASE = 'http://dnd2024.wikidot.com';
const INDEX = BASE + '/equipment:all';

const CATEGORIES = new Set([
  'Mounts and Vehicles',
  'Trinkets',
  'Currency',
  'Poisons',
  'Tools',
  'Armor',
  'Weapons',
  'Adventuring Gear'
]);

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

function normalizeName(n){return String(n||'').trim();}

async function fetchText(url){
  const fetchFn = (typeof fetch === 'function') ? fetch : (await import('node-fetch')).default;
  const res = await fetchFn(url, { headers: { 'User-Agent': 'mythos-dnd2024-import/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function parseKeyValueFromTable($page) {
  const out = {};
  const table = $page('table').first();
  if (!table || table.length === 0) return out;
  table.find('tr').each((i, tr) => {
    const tds = $page(tr).find('td');
    if (tds.length === 2) {
      const k = $page(tds[0]).text().trim().replace(/[:\s]+$/,'');
      const v = $page(tds[1]).text().trim();
      if (k) out[k] = v;
    }
  });
  return out;
}

function extractFields($page) {
  // heuristics for fields
  const title = $page('h1').first().text().trim() || $page('title').text().trim();
  const kv = parseKeyValueFromTable($page);

  const get = (names) => {
    for (const n of names) if (kv[n]) return kv[n];
  };

  let damage = get(['Damage', 'Damage/Type', 'Damage Dice']) || null;
  const props = get(['Properties', 'Property', 'Properties/Traits']) || null;
  const mastery = get(['Mastery', 'Proficiency']) || null;
  const weight = get(['Weight', 'Mass']) || null;
  const cost = get(['Cost', 'Price', 'Value']) || null;

  // fallback: look for lines with 'Damage:' in paragraphs
  if (!damage) {
    const ptext = $page('body').text();
    const m = ptext.match(/Damage:\s*([^\n\r]+)/i);
    if (m) damage = m[1].trim();
  }

  return {
    name: title,
    damage: damage ? String(damage).trim() : null,
    properties: props ? String(props).split(/[,;]\s*/).map(s=>s.trim()).filter(Boolean) : [],
    mastery: mastery ? String(mastery).trim() : null,
    weight: weight ? String(weight).trim() : null,
    cost: cost ? String(cost).trim() : null
  };
}

async function collectLinks() {
  const html = await fetchText(INDEX);
  const $ = cheerio.load(html);
  const links = [];

  // find headings and gather following links until next heading
  $('h2, h3').each((i, h) => {
    const heading = $(h).text().trim();
    if (!heading) return;
    if (!CATEGORIES.has(heading)) return;
    // collect anchors after this heading until next heading
    let node = $(h).next();
    while (node && node.length) {
      if (node[0].name && /^h[12-6]$/.test(node[0].name)) break;
      node.find('a').each((j, a) => {
        const href = $(a).attr('href');
        const text = $(a).text().trim();
        if (href && href.startsWith('/')) links.push({ href: BASE + href, text, category: heading });
      });
      node = node.next();
    }
  });

  // fallback: gather links that include '/equipment:'
  if (links.length === 0) {
    $('a').each((i,a)=>{
      const href = $(a).attr('href');
      const text = $(a).text().trim();
      if (href && href.includes('/equipment:')) links.push({ href: href.startsWith('http')?href:BASE+href, text, category: null });
    });
  }

  // dedupe
  const uniq = [];
  const seen = new Set();
  for (const l of links) {
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    uniq.push(l);
  }
  return uniq;
}

async function importAll() {
  console.log('Collecting links from', INDEX);
  const links = await collectLinks();
  console.log('Found', links.length, 'links to process');

  let processed = 0, upserted = 0, failed = 0;

  for (const l of links) {
    try {
      const html = await fetchText(l.href);
      const $ = cheerio.load(html);
      const fields = extractFields($);
      if (!fields.name) { failed++; continue; }

      const item = {
        name: normalizeName(fields.name),
        category: l.category || null,
        cost: fields.cost || null,
        weight: fields.weight || null,
        properties: fields.properties || [],
        description: `imported from dnd2024: ${l.href} (mastery: ${fields.mastery || ''}, damage: ${fields.damage || ''})`,
        source: 'dnd2024'
      };

      equipmentModel.upsertEquipment(item);
      upserted++;
      processed++;
      await sleep(50);
    } catch (err) {
      console.warn('Failed', l.href, err.message);
      failed++;
    }
  }

  console.log(`Import finished. processed=${processed}, upserted=${upserted}, failed=${failed}`);
}

importAll().catch(err=>{console.error('Import failed:',err);process.exit(1);});
