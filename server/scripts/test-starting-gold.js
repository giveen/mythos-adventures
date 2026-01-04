const model = require('../models/characterModel');

const classes = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Fighter',
  'Paladin',
  'Ranger',
  'Rogue',
  'Warlock',
  'Wizard',
  'Druid',
  'Monk',
  'Sorcerer'
];

function makeChar(name, cls) {
  return {
    name,
    class: cls,
    race: 'Human',
    background: 'Test',
    alignment: 'Neutral',
    xp: 0,
    stats: {str:10,dex:10,con:10,int:10,wis:10,cha:10}
  };
}

async function run() {
  console.log('Testing starting gold for classes:');
  for (const cls of classes) {
    console.log(`\nClass: ${cls}`);
    const ids = [];
    for (let i = 0; i < 3; i++) {
      const id = model.createCharacter(makeChar(`${cls} Test ${i+1}`, cls));
      ids.push(id);
      const c = model.getCharacter(id);
      console.log(`  ${cls} Test ${i+1}: ${c.gold} gp`);
    }
    // cleanup
    for (const id of ids) model.deleteCharacter(id);
  }
  console.log('\nDone.');
}

run().catch((e)=>{console.error(e); process.exit(1);});
