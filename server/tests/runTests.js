const tests = [
  require('./test_characterModel'),
  require('./test_llmActionService')
];

async function runAll() {
  for (const t of tests) {
    if (typeof t.run === 'function') {
      try {
        await t.run();
      } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
      }
    }
  }
  console.log('All tests passed');
}

runAll();
