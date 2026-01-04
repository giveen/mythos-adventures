#!/usr/bin/env node
const fs = require('fs');
const cheerio = require('cheerio');
const db = require('../db/characters');

function safe(s){ return String(s||'').trim(); }

async function run(){
  const path = process.argv[2] || '/home/jeremy/spell2.txt';
  if (!fs.existsSync(path)) {
    console.error('File not found:', path);
    process.exit(1);
  }
  const html = fs.readFileSync(path, 'utf8');
  const $ = cheerio.load(html);

  let updated = 0;
  const unmatched = [];

  // scan all tables for Name + Spell lists / Classes / School headers
  $('table').each((ti, table) => {
    const headers = [];
    const $table = $(table);
    $table.find('th').each((hi, th) => headers.push($(th).text().trim().toLowerCase()));
    const nameIdx = headers.findIndex(h => /(^|\W)name(\W|$)/.test(h));
    let classesIdx = headers.findIndex(h => /spell\s*lists?/.test(h));
    if (classesIdx === -1) classesIdx = headers.findIndex(h => /classes?/.test(h));
    if (classesIdx === -1) classesIdx = headers.findIndex(h => /school/.test(h));
    if (nameIdx === -1 || classesIdx === -1) return;

    $table.find('tr').each((ri, tr) => {
      if (ri === 0) return;
      const cells = $(tr).find('td');
      if (!cells || cells.length <= Math.max(nameIdx, classesIdx)) return;
      const rowName = safe($(cells[nameIdx]).text());
      const rowClasses = safe($(cells[classesIdx]).text());
      if (!rowName || !rowClasses) return;

      const clsList = rowClasses.split(/[,\/;]+/).map(s=>s.trim().toLowerCase()).filter(Boolean);
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
          unmatched.push({ title: rowName, classes: classesText });
        }
      }
    });
  });

  console.log('Finished. Updated', updated, 'spells.');
  if (unmatched.length) {
    const out = ['title,classes'];
    for (const u of unmatched) {
      const safeq = s => (`"${String(s||'').replace(/"/g,'""')}"`);
      out.push([safeq(u.title), safeq(u.classes)].join(','));
    }
    fs.writeFileSync('wikidot_unmatched.csv', out.join('\n'));
    console.log('Wrote', unmatched.length, 'unmatched to wikidot_unmatched.csv');
  }
}

run().catch(e=>{ console.error(e); process.exit(1); });
