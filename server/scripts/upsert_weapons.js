#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const equipmentModel = require('../models/equipmentModel');
const db = require('../db/characters');

function backup() {
  const ts = new Date().toISOString().replace(/[:.-]/g, '').slice(0,15);
  const name = `equipment_backup_weapons_${ts}`;
  db.prepare(`CREATE TABLE IF NOT EXISTS ${name} AS SELECT * FROM equipment WHERE category LIKE '%Weapon%'`).run();
  console.log('Backup created:', name);
}

const weapons = [
  // Simple Melee
  { name: 'Club', category: 'Weapon', cost: '1 SP', weight: 2, properties: ['Light'], description: '1d4 Bludgeoning' },
  { name: 'Dagger', category: 'Weapon', cost: '2 GP', weight: 1, properties: ['Finesse','Light','Thrown (20/60)'], description: '1d4 Piercing' },
  { name: 'Greatclub', category: 'Weapon', cost: '2 SP', weight: 10, properties: ['Two-Handed'], description: '1d8 Bludgeoning' },
  { name: 'Handaxe', category: 'Weapon', cost: '5 GP', weight: 2, properties: ['Light','Thrown (20/60)'], description: '1d6 Slashing' },
  { name: 'Javelin', category: 'Weapon', cost: '5 SP', weight: 2, properties: ['Thrown (30/120)'], description: '1d6 Piercing' },
  { name: 'Light Hammer', category: 'Weapon', cost: '2 GP', weight: 2, properties: ['Light','Thrown (20/60)'], description: '1d4 Bludgeoning' },
  { name: 'Mace', category: 'Weapon', cost: '5 GP', weight: 4, properties: [], description: '1d6 Bludgeoning' },
  { name: 'Quarterstaff', category: 'Weapon', cost: '2 SP', weight: 4, properties: ['Versatile (1d8)'], description: '1d6 Bludgeoning' },
  { name: 'Sickle', category: 'Weapon', cost: '1 GP', weight: 2, properties: ['Light'], description: '1d4 Slashing' },
  { name: 'Spear', category: 'Weapon', cost: '1 GP', weight: 3, properties: ['Thrown (20/60)','Versatile (1d8)'], description: '1d6 Piercing' },

  // Simple Ranged
  { name: 'Dart', category: 'Weapon', cost: '5 CP', weight: 0.25, properties: ['Finesse','Thrown (20/60)'], description: '1d4 Piercing' },
  { name: 'Light Crossbow', category: 'Weapon', cost: '25 GP', weight: 5, properties: ['Ammunition (80/320)','Loading','Two-Handed'], description: '1d8 Piercing' },
  { name: 'Shortbow', category: 'Weapon', cost: '25 GP', weight: 2, properties: ['Ammunition (80/320)','Two-Handed'], description: '1d6 Piercing' },
  { name: 'Sling', category: 'Weapon', cost: '1 SP', weight: 0.1, properties: ['Ammunition (30/120)'], description: '1d4 Bludgeoning' },

  // Martial Melee
  { name: 'Battleaxe', category: 'Weapon', cost: '10 GP', weight: 4, properties: ['Versatile (1d10)'], description: '1d8 Slashing' },
  { name: 'Flail', category: 'Weapon', cost: '10 GP', weight: 2, properties: [], description: '1d8 Bludgeoning' },
  { name: 'Glaive', category: 'Weapon', cost: '20 GP', weight: 6, properties: ['Heavy','Reach','Two-Handed'], description: '1d10 Slashing' },
  { name: 'Greataxe', category: 'Weapon', cost: '30 GP', weight: 7, properties: ['Heavy','Two-Handed'], description: '1d12 Slashing' },
  { name: 'Greatsword', category: 'Weapon', cost: '50 GP', weight: 6, properties: ['Heavy','Two-Handed'], description: '2d6 Slashing' },
  { name: 'Halberd', category: 'Weapon', cost: '20 GP', weight: 6, properties: ['Heavy','Reach','Two-Handed'], description: '1d10 Slashing' },
  { name: 'Lance', category: 'Weapon', cost: '10 GP', weight: 6, properties: ['Heavy','Reach','Two-Handed (mounted)'], description: '1d10 Piercing' },
  { name: 'Longsword', category: 'Weapon', cost: '15 GP', weight: 3, properties: ['Versatile (1d10)'], description: '1d8 Slashing' },
  { name: 'Maul', category: 'Weapon', cost: '10 GP', weight: 10, properties: ['Heavy','Two-Handed'], description: '2d6 Bludgeoning' },
  { name: 'Morningstar', category: 'Weapon', cost: '15 GP', weight: 4, properties: [], description: '1d8 Piercing' },
  { name: 'Pike', category: 'Weapon', cost: '5 GP', weight: 18, properties: ['Heavy','Reach','Two-Handed'], description: '1d10 Piercing' },
  { name: 'Rapier', category: 'Weapon', cost: '25 GP', weight: 2, properties: ['Finesse'], description: '1d8 Piercing' },
  { name: 'Scimitar', category: 'Weapon', cost: '25 GP', weight: 3, properties: ['Finesse','Light'], description: '1d6 Slashing' },
  { name: 'Shortsword', category: 'Weapon', cost: '10 GP', weight: 2, properties: ['Finesse','Light'], description: '1d6 Piercing' },
  { name: 'Trident', category: 'Weapon', cost: '5 GP', weight: 4, properties: ['Thrown (20/60)','Versatile (1d10)'], description: '1d8 Piercing' },
  { name: 'Warhammer', category: 'Weapon', cost: '15 GP', weight: 5, properties: ['Versatile (1d10)'], description: '1d8 Bludgeoning' },
  { name: 'War Pick', category: 'Weapon', cost: '5 GP', weight: 2, properties: ['Versatile (1d10)'], description: '1d8 Piercing' },
  { name: 'Whip', category: 'Weapon', cost: '2 GP', weight: 3, properties: ['Finesse','Reach'], description: '1d4 Slashing' },

  // Martial Ranged
  { name: 'Blowgun', category: 'Weapon', cost: '10 GP', weight: 1, properties: ['Ammunition (25/100)','Loading'], description: '1 Piercing' },
  { name: 'Hand Crossbow', category: 'Weapon', cost: '75 GP', weight: 3, properties: ['Ammunition (30/120)','Light','Loading'], description: '1d6 Piercing' },
  { name: 'Heavy Crossbow', category: 'Weapon', cost: '50 GP', weight: 18, properties: ['Ammunition (100/400)','Heavy','Loading','Two-Handed'], description: '1d10 Piercing' },
  { name: 'Longbow', category: 'Weapon', cost: '50 GP', weight: 2, properties: ['Ammunition (150/600)','Heavy','Two-Handed'], description: '1d8 Piercing' },
  { name: 'Musket', category: 'Weapon', cost: '500 GP', weight: 10, properties: ['Ammunition (40/120)','Loading','Two-Handed'], description: '1d12 Piercing' },
  { name: 'Pistol', category: 'Weapon', cost: '250 GP', weight: 3, properties: ['Ammunition (30/90)','Loading'], description: '1d10 Piercing' }
];

function run() {
  backup();
  let added = 0;
  for (const w of weapons) {
    const id = equipmentModel.upsertEquipment({
      name: w.name,
      category: 'Weapon',
      cost: w.cost,
      weight: w.weight,
      properties: w.properties,
      description: w.description,
      source: 'manual-weapons'
    });
    console.log('Upserted:', w.name, '-> id', id);
    added++;
  }
  console.log(`Processed ${added} weapons`);
}

run();
