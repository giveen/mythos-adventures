const characterModel = require('../models/characterModel');
const db = require('../db/characters');

function showChar(id){
  const c = characterModel.getCharacter(id);
  console.log('Created character:', c.id, c.name, 'gold=', c.gold);
  console.log('Inventory:', c.inventory);
}

const id = characterModel.createCharacter({ name: 'TrinketTest', class: 'Rogue' });
showChar(id);
