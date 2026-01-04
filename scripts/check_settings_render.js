const puppeteer = require('puppeteer');

async function run() {
  const url = process.env.URL || 'http://localhost:3000/settings';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(15000);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the Ollama panel selector
    const sel = '.ollama-panel';
    try {
      await page.waitForSelector(sel, { timeout: 8000 });
      const content = await page.$eval(sel, el => el.innerText.slice(0, 1000));
      console.log('OK: Ollama panel found. Content snippet:\n', content);
      // Save a screenshot for inspection
      await page.screenshot({ path: 'settings_ollama_screenshot.png', fullPage: true });
      process.exitCode = 0;
    } catch (err) {
      console.error('ERROR: Ollama panel not found within timeout.');
      // Dump body for debugging
      const body = await page.evaluate(() => document.body.innerText.slice(0, 2000));
      console.error('Page body snippet:\n', body);
      process.exitCode = 2;
    }
  } catch (err) {
    console.error('ERROR: puppeteer navigation failed:', err);
    process.exitCode = 3;
  } finally {
    await browser.close();
  }
}

run();
