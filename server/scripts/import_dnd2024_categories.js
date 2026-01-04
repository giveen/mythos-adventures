// Scrape specified dnd2024.wikidot.com category pages and import items
// Usage: node scripts/import_dnd2024_categories.js

const db = require('../db/init');
const equipmentModel = require('../models/equipmentModel');
const { parseCostToGp } = require('../services/costService');
const cheerio = require('cheerio');

const CATEGORY_URLS = [
  'http://dnd2024.wikidot.com/equipment:armor',
  'http://dnd2024.wikidot.com/equipment:weapon',
  'http://dnd2024.wikidot.com/equipment:adventuring-gear',
  'http://dnd2024.wikidot.com/equipment:mounts-and-vehicles',
  'http://dnd2024.wikidot.com/equipment:trinket',
  'http://dnd2024.wikidot.com/equipment:currency',
  'http://dnd2024.wikidot.com/equipment:poison',
  'http://dnd2024.wikidot.com/equipment:tool',
  'http://dnd2024.wikidot.com/equipment:crafting'
];

const BASE = 'http://dnd2024.wikidot.com';

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

async function fetchText(url){
  const fetchFn = (typeof fetch === 'function') ? fetch : (await import('node-fetch')).default;
  const res = await fetchFn(url, { headers: { 'User-Agent': 'mythos-dnd2024-categories/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function normalizeKeyName(n){return String(n||'').toLowerCase().replace(/[^a-z0-9]+/g,'').trim();}

function parseItemPage($, href){
  const title = $('h1').first().text().trim() || $('title').text().trim() || href;

  // Parse key/value tables
  const kv = {};
  $('table').each((i, t)=>{
    $(t).find('tr').each((j,tr)=>{
      const tds = $(tr).find('td');
      if (tds.length === 2) {
        const k = $(tds[0]).text().trim();
        const v = $(tds[1]).text().trim();
        if (k) kv[k] = v;
      }
    });
  });

  function get(keys){
    for (const k of keys) if (kv[k]) return kv[k];
    return null;
  }

  const damage = get(['Damage','Damage Dice','Damage/Type']) || null;
  const props = get(['Properties','Property','Properties/Traits']) || null;
  const mastery = get(['Mastery','Proficiency']) || null;
  const weight = get(['Weight','Mass']) || null;
  const cost = get(['Cost','Price','Value']) || null;

  return {
    name: title,
    damage: damage && String(damage).trim(),
    properties: props ? String(props).split(/[,;]\s*/).map(s=>s.trim()).filter(Boolean) : [],
    mastery: mastery && String(mastery).trim(),
    weight: weight && String(weight).trim(),
    cost: cost && String(cost).trim()
  };
}

async function collectItemLinks(categoryUrl){
  const html = await fetchText(categoryUrl);
  const $ = cheerio.load(html);
  const links = [];
  $('a').each((i,a)=>{
    const href = $(a).attr('href');
    if (!href) return;
    // accept links that look like equipment pages (match 'equipment:' anywhere)
    if (href.includes('equipment:') && !href.includes(':all')){
      const url = href.startsWith('http') ? href : (href.startsWith('/') ? BASE+href : BASE + '/' + href);
      links.push(url);
    }
  });
  // dedupe
  return Array.from(new Set(links));
}

async function collectTableItems(categoryUrl){
  const html = await fetchText(categoryUrl);
  const $ = cheerio.load(html);
  const items = [];

  $('table').each((i,table)=>{
    const $table = $(table);
    // detect header row text
    const headers = [];
    $table.find('tr').first().find('th,td').each((j,th)=>{
      headers.push($(th).text().trim().toLowerCase());
    });
    // accept tables that have an 'item'/'armor'/'name' header, or tables with both cost+weight columns
    const hasItemHeader = headers.some(h=>h.includes('item')||h.includes('armor')||h.includes('name'));
    const hasCostHeader = headers.some(h=>h.includes('cost')||h.includes('price'));
    const hasWeightHeader = headers.some(h=>h.includes('weight')||h.includes('mass'));
    if (!(hasItemHeader || (hasCostHeader && hasWeightHeader))) {
      // special-case: trinket tables often have headers like '1d100' and 'Trinket'
      const isTrinket = headers.some(h=>h.includes('trinket')||h.includes('1d100')) || (headers.length===2 && (headers[0].includes('1d100')||headers[1].includes('trinket')));
      if (isTrinket){
        const trinketIdx = headers.findIndex(h=>h.includes('trinket')) >= 0 ? headers.findIndex(h=>h.includes('trinket')) : (headers.length>1?1:0);
        $table.find('tr').slice(1).each((r,tr)=>{
          const tds = $(tr).find('td');
          if (tds.length === 0) return;
          const name = (tds[trinketIdx]) ? $(tds[trinketIdx]).text().trim() : $(tds[tds.length-1]).text().trim();
          if (name) items.push({ name, weight: null, cost: null, description: null, source: 'dnd2024' });
        });
        return;
      }

      // special-case: poison tables (headers may include 'poison'/'effect' and 'cost')
      const isPoison = headers.some(h=>h.includes('poison')) || (headers.some(h=>h.includes('effect')) && hasCostHeader);
      if (isPoison){
        const nameIdx = headers.findIndex(h=>h.includes('poison')||h.includes('name')||h.includes('item')) >=0 ? headers.findIndex(h=>h.includes('poison')||h.includes('name')||h.includes('item')) : 0;
        const costIdx = headers.findIndex(h=>h.includes('cost')||h.includes('price'));
        const descIdx = headers.findIndex(h=>h.includes('effect')||h.includes('function')||h.includes('description'));
        $table.find('tr').slice(1).each((r,tr)=>{
          const tds = $(tr).find('td');
          if (tds.length === 0) return;
          const name = (tds[nameIdx]) ? $(tds[nameIdx]).text().trim() : $(tds[0]).text().trim();
          const cost = (costIdx>=0 && tds[costIdx]) ? $(tds[costIdx]).text().trim() : null;
          const desc = (descIdx>=0 && tds[descIdx]) ? $(tds[descIdx]).text().trim() : null;
          if (name) items.push({ name, weight: null, cost, description: desc, source: 'dnd2024' });
        });
        return;
      }

      return; // not the equipment table
    }

    // map header positions (allow multiple synonyms)
    const idx = {
      item: headers.findIndex(h=>h.includes('item')||h.includes('armor')||h.includes('name')),
      weight: headers.findIndex(h=>h.includes('weight')||h.includes('mass')),
      cost: headers.findIndex(h=>h.includes('cost')||h.includes('price')),
      func: headers.findIndex(h=>h.includes('function')||h.includes('description')||h.includes('notes'))
    };

    $table.find('tr').slice(1).each((r,tr)=>{
      const tds = $(tr).find('td');
      if (tds.length === 0) return;
      const name = idx.item >=0 ? $(tds[idx.item]).text().trim() : $(tds[0]).text().trim();
      const weight = (idx.weight>=0 && tds[idx.weight]) ? $(tds[idx.weight]).text().trim() : null;
      const cost = (idx.cost>=0 && tds[idx.cost]) ? $(tds[idx.cost]).text().trim() : null;
      const func = (idx.func>=0 && tds[idx.func]) ? $(tds[idx.func]).text().trim() : null;
      if (name) items.push({ name, weight, cost, description: func, source: 'dnd2024' });
    });
  });

  return items;
}

function findExistingByName(name, nameMap, normalizedMap){
  if (!name) return null;
  const exact = db.prepare('SELECT id FROM equipment WHERE name = ?').get(name);
  if (exact && exact.id) return exact.id;
  const lower = db.prepare('SELECT id FROM equipment WHERE lower(name) = lower(?)').get(name);
  if (lower && lower.id) return lower.id;
  const norm = normalizeKeyName(name);
  if (normalizedMap.has(norm)) return normalizedMap.get(norm).id;
  return null;
}

async function run(){
  const allLinks = new Set();
  const allTableItems = [];
  for (const url of CATEGORY_URLS){
    try{
      const links = await collectItemLinks(url);
      console.log('Category', url, '->', links.length, 'links');
      for (const l of links) allLinks.add(l);
      // parse inline tables on category page
      const tableItems = await collectTableItems(url);
      console.log('Category', url, '->', tableItems.length, 'table items');
      for (const it of tableItems) allTableItems.push(it);
      await sleep(100);
    }catch(err){
      console.warn('Failed collecting',url,err.message);
    }
  }

  const links = Array.from(allLinks);
  console.log('Total item links to process:', links.length);
  console.log('Total table items to process:', allTableItems.length);

  // build normalized map of existing equipment
  const existing = db.prepare('SELECT id,name FROM equipment').all();
  const normalizedMap = new Map();
  for (const e of existing) normalizedMap.set(normalizeKeyName(e.name), { id: e.id, name: e.name });

  let processed=0, updated=0, created=0, failed=0;

  for (const href of links){
    try{
      // first, parse any tables on the linked page (some pages contain item tables)
      try{
        const tableItems = await collectTableItems(href);
        for (const it of tableItems){
          const foundId = findExistingByName(it.name, null, normalizedMap);
          const payload = {
            name: it.name,
            category: null,
            cost: it.cost || null,
            weight: it.weight || null,
            properties: [],
            description: it.description || (`Imported from dnd2024 table ${href}`),
            source: it.source || 'dnd2024'
          };
          if (foundId){
            const gp = parseCostToGp(payload.cost);
            db.prepare('UPDATE equipment SET cost = ?, cost_gp = ?, weight = ?, description = ?, source = ? WHERE id = ?')
              .run(payload.cost, gp, payload.weight, payload.description, payload.source, foundId);
            updated++;
          } else {
            equipmentModel.upsertEquipment(payload);
            created++;
          }
        }
      }catch(e){
        // non-fatal
      }

      // then parse the page as an individual item (key/value tables)
      const html = await fetchText(href);
      const $ = cheerio.load(html);
      const f = parseItemPage($, href);
      if (!f.name) { failed++; continue; }

      const foundId = findExistingByName(f.name, null, normalizedMap);
      const payload = {
        name: f.name,
        category: null,
        cost: f.cost || null,
        weight: f.weight || null,
        properties: f.properties || [],
        description: `Imported from dnd2024 ${href} (damage:${f.damage||''} mastery:${f.mastery||''})`,
        source: 'dnd2024'
      };

      if (foundId) {
        const gp = parseCostToGp(payload.cost);
        db.prepare('UPDATE equipment SET cost = ?, cost_gp = ?, weight = ?, properties = ?, description = ?, source = ? WHERE id = ?')
          .run(payload.cost, gp, payload.weight, JSON.stringify(payload.properties||[]), payload.description, payload.source, foundId);
        updated++;
      } else {
        equipmentModel.upsertEquipment(payload);
        created++;
      }
      processed++;
      await sleep(80);
    }catch(err){
      console.warn('Failed processing',href,err.message);
      failed++;
    }
  }

  // process inline table items
  for (const it of allTableItems){
    try{
      const foundId = findExistingByName(it.name, null, normalizedMap);
      const payload = {
        name: it.name,
        category: null,
        cost: it.cost || null,
        weight: it.weight || null,
        properties: [],
        description: it.description || (`Imported from dnd2024 table`),
        source: it.source || 'dnd2024'
      };
      if (foundId){
        const gp = parseCostToGp(payload.cost);
        db.prepare('UPDATE equipment SET cost = ?, cost_gp = ?, weight = ?, description = ?, source = ? WHERE id = ?')
          .run(payload.cost, gp, payload.weight, payload.description, payload.source, foundId);
        updated++;
      } else {
        equipmentModel.upsertEquipment(payload);
        created++;
      }
    }catch(err){
      console.warn('Failed processing table item',it.name,err.message);
      failed++;
    }
  }

  console.log(`Done. processed=${processed}, updated=${updated}, created=${created}, failed=${failed}`);
}

run().catch(err=>{console.error('Import categories failed',err);process.exit(1);});
