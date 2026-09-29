const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
  // scroll to applications section
  await page.evaluate(() => {
    const el = document.getElementById('applications');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(4000);
  // find the leaflet container and report its computed size + child img count
  const info = await page.evaluate(() => {
    const c = document.querySelector('.counter-uas-leaflet');
    if (!c) return { found: false };
    const tiles = c.querySelectorAll('img.leaflet-tile');
    const rect = c.getBoundingClientRect();
    const cs = getComputedStyle(c);
    return {
      found: true,
      width: rect.width,
      height: rect.height,
      tileCount: tiles.length,
      bg: cs.backgroundColor,
      filter: getComputedStyle(document.querySelector('.leaflet-tile') || c).filter,
    };
  });
  console.log('MAP INFO:', JSON.stringify(info, null, 2));
  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
  await page.screenshot({ path: 'C:/Users/ASUS Vivobook/Downloads/aeromac-aiceptor-main/aeromac-aiceptor-main/cuas-shot.png', fullPage: false });
  await browser.close();
})();
