#!/usr/bin/env node
const path = require('path');
const db = require('../db/characters');

function normalize(s){return (s||'').trim();}

const id = process.argv[2];
if(!id){
  console.error('Usage: node give_trinket_to_character.js <characterId>');
  process.exit(2);
}

// pick random trinket
const trinkets = db.prepare("SELECT id,name,source FROM equipment WHERE lower(category)='trinket'").all();
if(!trinkets || trinkets.length===0){
  console.error('No trinkets found in equipment table');
  process.exit(1);
}
const pick = trinkets[Math.floor(Math.random()*trinkets.length)];

const row = db.prepare('SELECT inventory FROM characters WHERE id = ?').get(id);
if(!row){
  console.error('Character not found:', id);
  process.exit(1);
}

let inv = [];
try{ inv = JSON.parse(row.inventory || '[]'); }catch(e){ inv = []; }
inv.push({ id: pick.id, name: pick.name, source: pick.source || 'dnd2024' });

db.prepare('UPDATE characters SET inventory = ? WHERE id = ?').run(JSON.stringify(inv), id);
console.log('Added trinket to character', id, ':', pick.name);
