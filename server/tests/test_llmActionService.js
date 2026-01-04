const assert = require('assert');
const characterModel = require('../models/characterModel');
const activeCharacter = require('../models/activeCharacter');
const { executeAction, resetRateLimits } = require('../services/llmActionService');

async function run() {
  console.log('Running llmActionService tests...');
  resetRateLimits();

  const id = characterModel.createCharacter({
    name: 'ActionChar',
    race: 'Elf',
    class: 'Wizard',
    level: 1,
    stats: { str: 8, dex: 12, con: 10, int: 16, wis: 10, cha: 10 },
    inventory: [],
    metadata: {}
  });

  activeCharacter.setActiveCharacter(id);

  // give_item
  const giveRes = await executeAction({ action: 'give_item', character_id: id, item: { name: 'Wand of Tests' } });
  assert(giveRes.success, 'give_item should succeed');
  const afterGive = characterModel.getCharacter(id);
  assert(Array.isArray(afterGive.inventory) && afterGive.inventory.some(i => i.name === 'Wand of Tests'));

  // set_stat
  const setRes = await executeAction({ action: 'set_stat', character_id: id, stat: 'STR', value: 14 });
  assert(setRes.success, 'set_stat should succeed');
  const afterSet = characterModel.getCharacter(id);
  assert.strictEqual(Number(afterSet.stats.str), 14);

  // grant_spell
  const grantRes = await executeAction({ action: 'grant_spell', character_id: id, spell: { name: 'Test Spell' } });
  assert(grantRes.success, 'grant_spell should succeed');
  const afterGrant = characterModel.getCharacter(id);
  assert(Array.isArray(afterGrant.metadata.spells) && afterGrant.metadata.spells.some(s => s.name === 'Test Spell'));

  // adjust_hp
  const curHp = Number(afterGrant.hit_points || 0);
  const adjRes = await executeAction({ action: 'adjust_hp', character_id: id, amount: -2 });
  assert(adjRes.success, 'adjust_hp should succeed');
  const afterHp = characterModel.getCharacter(id);
  assert.strictEqual(afterHp.hit_points, Math.max(0, curHp - 2));

  // remove_item
  const remRes = await executeAction({ action: 'remove_item', character_id: id, item_name: 'Wand of Tests' });
  assert(remRes.success, 'remove_item should succeed');

  // rate limit: exceed quickly
  resetRateLimits();
  const max = 15;
  for (let i = 0; i < max; i++) {
    // use add_xp cheap action
    // Note: actions count against rate limiter
    const r = await executeAction({ action: 'add_xp', character_id: id, xp: 1 });
    assert(r.success, 'add_xp should succeed in rate window');
  }

  let rateError = null;
  try {
    await executeAction({ action: 'add_xp', character_id: id, xp: 1 });
  } catch (err) {
    rateError = err;
  }
  assert(rateError, 'Expected rate limit error after exceeding max actions');

  // Cleanup
  characterModel.deleteCharacter(id);
  console.log('llmActionService tests passed');
}

module.exports = { run };
