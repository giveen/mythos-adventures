const assert = require('assert');
const characterModel = require('../models/characterModel');

async function run() {
  console.log('Running characterModel tests...');

  const id = characterModel.createCharacter({
    name: 'TestChar',
    race: 'Human',
    class: 'Fighter',
    level: 1,
    stats: { str: 12, dex: 10, con: 14, int: 8, wis: 10, cha: 10 },
    inventory: [],
    metadata: {}
  });

  const fetched = characterModel.getCharacter(id);
  assert(fetched, 'Created character should be retrievable');
  assert.strictEqual(fetched.name, 'TestChar');

  // Update a stat
  const updated = characterModel.updateCharacter(id, { stats: { ...fetched.stats, str: 16 } });
  assert.strictEqual(updated.stats.str, 16);

  // Cleanup
  const del = characterModel.deleteCharacter(id);
  assert(del && del.changes >= 0);

  console.log('characterModel tests passed');
}

module.exports = { run };
