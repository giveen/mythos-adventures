#!/usr/bin/env node
const cheerio = require('cheerio');
const db = require('../db/characters');

const LIST_URL = 'https://roll20.net/compendium/dnd5e/Spells%20List#content';

function createTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level INTEGER,
    school TEXT,
    casting_time TEXT,
    range TEXT,
    target TEXT,
    components TEXT,
    description TEXT,
    source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();
  console.log('Ensured spells table exists');
}

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  return await res.text();
}

function textOrNull(s) { return s == null ? null : String(s).trim(); }

function extractFieldsFromHtml(html) {
  const $ = cheerio.load(html);
  // roll20 pages vary; try to extract a description block and label:value pairs
  const content = $('#content').text() || $('body').text();
  const out = {};
  // heuristics: look for lines like "Level: 1st" or "Casting Time: 1 action"
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const m = line.match(/^(Level|School|Casting Time|Range|Target|Components)\s*[:-]\s*(.*)$/i);
    if (m) {
      const k = m[1].toLowerCase().replace(/\s+/g,'_');
      out[k] = m[2];
    }
  }
  // fallback: full description as remaining text
  out.description = lines.join('\n');
  return out;
}

async function importSpells(options = {}) {
  // options: { fetch: boolean, file: path }
  createTable();
  const insert = db.prepare(`INSERT INTO spells (name, level, school, casting_time, range, target, components, description, source) VALUES (?,?,?,?,?,?,?,?,?)`);

  if (options.file) {
    const fs = require('fs');
    const path = options.file;
    console.log('Reading local file:', path);
    const txt = fs.readFileSync(path, 'utf8');
    // split into blocks by detecting spell name lines (lines without ':' that start a block)
    const lines = txt.split(/\r?\n/);
    const blocks = [];
    let curName = null;
    let curLines = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      // treat as a name if the line does not contain ':' and the next non-empty line contains 'level:' or similar
      const nextNonEmpty = (() => {
        for (let j = i+1; j < lines.length; j++) {
          if (lines[j].trim()) return lines[j].trim();
        }
        return '';
      })();
      if (!line.includes(':') && /^(level|school|casting time|range|target|components|duration)\b/i.test(nextNonEmpty)) {
        // flush previous
        if (curName && curLines.length) blocks.push({ name: curName, text: curLines.join(' ') });
        curName = line;
        curLines = [];
        continue;
      }
      if (curName) curLines.push(line);
    }
    // push last
    if (curName && curLines.length) blocks.push({ name: curName, text: curLines.join(' ') });

    console.log('Parsed', blocks.length, 'spell blocks from file');

    for (const b of blocks) {
      const txt = b.text.replace(/\s+/g,' ');
      const keys = ['level','school','casting time','range','target','components','duration'];
      const out = {};
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];
        const idx = txt.toLowerCase().indexOf(key + ':');
        if (idx === -1) continue;
        // find next key index
        let nextIdx = txt.length;
        for (let m = k+1; m < keys.length; m++) {
          const ni = txt.toLowerCase().indexOf(keys[m] + ':', idx+1);
          if (ni !== -1 && ni < nextIdx) nextIdx = ni;
        }
        const value = txt.substring(idx + key.length + 1, nextIdx).trim();
        out[key.replace(/\s+/g,'_')] = value || null;
      }
      const levelRaw = (out.level || '').match(/(\d+)/);
      const level = levelRaw ? Number(levelRaw[1]) : ((out.level || '').toLowerCase().includes('cantrip') ? 0 : null);
      insert.run(
        textOrNull(b.name),
        level,
        textOrNull(out.school),
        textOrNull(out['casting_time']),
        textOrNull(out.range),
        textOrNull(out.target),
        textOrNull(out.components),
        textOrNull(b.text),
        'spells-txt'
      );
    }
    console.log('Imported', blocks.length, 'spells from file');
    return;
  }

  if (options.fetch) {
    console.log('Fetching spell list from Roll20...');
    const listHtml = await fetchHtml(LIST_URL);
    const $ = cheerio.load(listHtml);
    // gather compendium links under #content
    const anchors = $('#content a').toArray().map(a => $(a).attr('href')).filter(Boolean);
    const compLinks = anchors
      .filter(h => h.includes('/compendium/dnd5e/'))
      .map(h => (h.startsWith('http') ? h : new URL(h, 'https://roll20.net').href));

    console.log('Found', compLinks.length, 'links (filtered).');

    for (const lnk of compLinks) {
      try {
        const h = await fetchHtml(lnk);
        const details = extractFieldsFromHtml(h);
        // try to parse name from page title
        const $$ = cheerio.load(h);
        const title = ($$('title').text() || '').replace(/\s*-\s*Roll20 Compendium.*/i,'').trim();
        const levelRaw = String(details.level || '').match(/(\d+)/);
        const level = levelRaw ? Number(levelRaw[1]) : (String(details.level || '').toLowerCase().includes('cantrip') ? 0 : null);

        insert.run(
          textOrNull(title) || textOrNull(details.name) || 'Unknown',
          level,
          textOrNull(details.school),
          textOrNull(details.casting_time),
          textOrNull(details.range),
          textOrNull(details.target),
          textOrNull(details.components),
          textOrNull(details.description),
          'roll20'
        );
        console.log('Imported:', title || '(no title)');
        // be polite
        await new Promise(r => setTimeout(r, 250));
      } catch (err) {
        console.error('Failed to import', lnk, err.message);
      }
    }
    console.log('Import finished');
    return;
  }

  console.log('Run with --fetch to pull spells from Roll20 or --file <path> to import from a local file. Table created only.');
}

const args = process.argv.slice(2);
const opts = { fetch: args.includes('--fetch') };
const fileIdx = args.indexOf('--file');
if (fileIdx !== -1 && args[fileIdx + 1]) opts.file = args[fileIdx + 1];
importSpells(opts).catch(err => { console.error(err); process.exit(1); });
