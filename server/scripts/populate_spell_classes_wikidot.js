#!/usr/bin/env node
const fetch = (typeof global.fetch === 'function') ? global.fetch : require('node-fetch');
const cheerio = require('cheerio');
const db = require('../db/characters');
const fs = require('fs');

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function fetchText(url){
  const res = await fetch(url, { headers: { 'User-Agent': 'mythos-wikidot-import/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

async function run(){
  const INDEX = 'http://dnd2024.wikidot.com/spell:all';
  console.log('Fetching spell index from', INDEX);
  const html = await fetchText(INDEX);
  const $ = cheerio.load(html);

  // Process any index tables that look like spell lists (have Name + Spell lists/Classes/School headers)
  const processedNames = new Set();
  $('table').each((ti, table) => {
    const headers = [];
    const $table = $(table);
    $table.find('th').each((hi, th) => headers.push($(th).text().trim().toLowerCase()));
    const nameIdx = headers.findIndex(h => /(^|\W)name(\W|$)/.test(h));
    let classesIdx = headers.findIndex(h => /spell\s*lists?/.test(h));
    if (classesIdx === -1) classesIdx = headers.findIndex(h => /classes?/.test(h));
    if (classesIdx === -1) classesIdx = headers.findIndex(h => /school/.test(h));
    if (nameIdx !== -1 && classesIdx !== -1) {
      $table.find('tr').each((ri, tr) => {
        if (ri === 0) return;
        const cells = $(tr).find('td');
        if (!cells || cells.length <= Math.max(nameIdx, classesIdx)) return;
        const rowName = $(cells[nameIdx]).text().trim();
        const rowClasses = $(cells[classesIdx]).text().trim();
        if (!rowName || !rowClasses) return;
        processedNames.add(rowName.toLowerCase());
        const clsList = rowClasses.split(/[,\/;]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
        const classesText = Array.from(new Set(clsList)).join(',');
        const exact = db.prepare('SELECT id,name FROM spells WHERE lower(name) = ?').get(rowName.toLowerCase());
        if (exact) {
          db.prepare('UPDATE spells SET classes = ? WHERE id = ?').run(classesText, exact.id);
          updated++;
          console.log(`[${updated}] Updated ${exact.name} -> ${classesText}`);
        } else {
          const like = db.prepare('SELECT id,name FROM spells WHERE lower(name) LIKE ? LIMIT 1').get(`%${rowName.toLowerCase()}%`);
          if (like) {
            db.prepare('UPDATE spells SET classes = ? WHERE id = ?').run(classesText, like.id);
            updated++;
            console.log(`[${updated}] Fuzzy Updated ${like.name} (matched ${rowName}) -> ${classesText}`);
          } else {
            unmatched.push({ title: rowName, url: `index:table-${ti}`, classes: classesText });
          }
        }
      });
    }
  });

  // collect links to spell pages for per-spell fallback (skip names we already processed)
  const links = new Set();
  $('a').each((i, a) => {
    const href = ($(a).attr('href') || '').trim();
    if (!href) return;
    if (href.includes('/spell:') || href.includes('spell:')) {
      let url = href.startsWith('http') ? href : (href.startsWith('/') ? 'http://dnd2024.wikidot.com' + href : 'http://dnd2024.wikidot.com/' + href);
      links.add(url.replace(/#.*$/, ''));
    }
  });

  const linkArr = Array.from(links).filter(Boolean);
  console.log('Found', linkArr.length, 'spell links (raw).');

  let updated = 0;
  const unmatched = [];

  for (let i = 0; i < linkArr.length; i++) {
    const url = linkArr[i];
    try {
      const page = await fetchText(url);
      const $$ = cheerio.load(page);

      // First, look for tables that include both 'name' and a 'spell lists'/'classes'/'school' column
      let handledMulti = false;
      $$('table').each((ti, table) => {
        if (handledMulti) return;
        const headers = [];
        $$(table).find('th').each((hi, th) => headers.push($$(th).text().trim().toLowerCase()));
        const nameIdx = headers.findIndex(h => /(^|\W)name(\W|$)/.test(h));
        let classesIdx = headers.findIndex(h => /spell\s*lists?/.test(h));
        if (classesIdx === -1) classesIdx = headers.findIndex(h => /classes?/.test(h));
        if (classesIdx === -1) classesIdx = headers.findIndex(h => /school/.test(h));

        if (nameIdx !== -1 && classesIdx !== -1) {
          // process each data row
          $$(table).find('tr').each((ri, tr) => {
            if (ri === 0) return; // skip header
            const cells = $$(tr).find('td');
            if (!cells || cells.length <= Math.max(nameIdx, classesIdx)) return;
            const rowName = $$(cells[nameIdx]).text().trim();
            const rowClasses = $$(cells[classesIdx]).text().trim();
            if (!rowName || !rowClasses) return;

            const clsList = rowClasses.split(/[,\/;]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
            const classesText = Array.from(new Set(clsList)).join(',');

            const exact = db.prepare('SELECT id,name FROM spells WHERE lower(name) = ?').get(rowName.toLowerCase());
            if (exact) {
              db.prepare('UPDATE spells SET classes = ? WHERE id = ?').run(classesText, exact.id);
              updated++;
              console.log(`[${updated}] Updated ${exact.name} -> ${classesText}`);
            } else {
              const like = db.prepare('SELECT id,name FROM spells WHERE lower(name) LIKE ? LIMIT 1').get(`%${rowName.toLowerCase()}%`);
              if (like) {
                db.prepare('UPDATE spells SET classes = ? WHERE id = ?').run(classesText, like.id);
                updated++;
                console.log(`[${updated}] Fuzzy Updated ${like.name} (matched ${rowName}) -> ${classesText}`);
              } else {
                unmatched.push({ title: rowName, url, classes: classesText });
              }
            }
          });
          handledMulti = true;
        }
      });

      if (!handledMulti) {
        // fallback: single-spell pages — look for 'Spell lists' or 'Classes' inline in the body
        const bodyText = $$('body').text();
        const m = bodyText.match(/(Spell lists|Spell list|Classes?)[:\s]*([A-Za-z ,\/\-()']+)/i);
        if (m && m[2]) {
          const classesRaw = m[2];
          const clsList = classesRaw.split(/[,\/;]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
          const classesText = Array.from(new Set(clsList)).join(',');

          const title = ($$('title').text() || '').replace(/\s*-\s*dnd2024.*/i,'').trim() || $$('h1').first().text().trim();
          const name = title || url.split('/').pop().replace(/spell:/i,'').replace(/-/g,' ').trim();

          const exact = db.prepare('SELECT id,name FROM spells WHERE lower(name) = ?').get(name.toLowerCase());
          if (exact) {
            db.prepare('UPDATE spells SET classes = ? WHERE id = ?').run(classesText, exact.id);
            updated++;
            console.log(`[${updated}] Updated ${exact.name} -> ${classesText}`);
          } else {
            const like = db.prepare('SELECT id,name FROM spells WHERE lower(name) LIKE ? LIMIT 1').get(`%${name.toLowerCase()}%`);
            if (like) {
              db.prepare('UPDATE spells SET classes = ? WHERE id = ?').run(classesText, like.id);
              updated++;
              console.log(`[${updated}] Fuzzy Updated ${like.name} (matched ${name}) -> ${classesText}`);
            } else {
              unmatched.push({ title: name, url, classes: classesText });
            }
          }
        }
      }

      await sleep(200);
    } catch (err) {
      console.warn('Failed to process', url, err && err.message ? err.message : err);
      await sleep(200);
    }
  }

  console.log('Finished. Updated', updated, 'spells.');

  if (unmatched.length) {
    const out = ['title,url,classes'];
    for (const u of unmatched) {
      const safe = s => (`"${String(s || '').replace(/"/g,'""')}"`);
      out.push([safe(u.title), safe(u.url), safe(u.classes)].join(','));
    }
    const path = 'wikidot_unmatched.csv';
    fs.writeFileSync(path, out.join('\n'));
    console.log(`Wrote ${unmatched.length} unmatched entries to ${path}`);
  }
}

run().catch(err => { console.error('Script failed:', err); process.exit(1); });
