const model = require('../models/characterModel');

function makeChar(name) {
  return {
    name,
    class: 'Barbarian',
    race: 'Human',
    background: 'Outlander',
    alignment: 'Neutral',
    xp: 0,
    stats: {str:15,dex:12,con:14,int:10,wis:11,cha:9}
  };
}

async function run() {
  console.log('Creating two test barbarians...');
  const id1 = model.createCharacter(makeChar('Test Barb 1'));
  const id2 = model.createCharacter(makeChar('Test Barb 2'));

  const c1 = model.getCharacter(id1);
  const c2 = model.getCharacter(id2);

  console.log('Character 1 gold:', c1.gold);
  console.log('Character 2 gold:', c2.gold);

  // cleanup
  model.deleteCharacter(id1);
  model.deleteCharacter(id2);

  console.log('Done.');
}

run().catch((e)=>{console.error(e); process.exit(1);});
