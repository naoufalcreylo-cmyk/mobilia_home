// Overflow + console-error sweep across pages × breakpoints
const { chromium } = require('playwright-core');
const U = 'http://localhost:4173/';
const pages = ['', 'collection.html?c=salons-d-angle-sur-mesure', 'collection.html?c=outlet-roches-noires', 'collection.html?room=chambre', 'collection.html?q=table', 'collection.html?list=favoris', 'collection.html?c=nope', 'product.html?p=salon-angle-valmora-390x290-design-organique-bois-massif', 'product.html?p=pack-chambre-a-coucher-bellat-lit-rangement-6-pieces', 'product.html?p=nope'];
const widths = [375, 430, 768, 1024, 1280, 1440, 1920];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' }); let bad = 0;
  for (const w of widths) for (const p of pages) {
    const page = await b.newPage({ viewport: { width: w, height: 900 } }); const errs = [];
    page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text().slice(0, 120)));
    await page.goto(U + p, { waitUntil: 'networkidle' });
    const o = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (o > 0 || errs.length) { bad++; console.log(`${w}px /${p} overflow=${o} errors=${JSON.stringify(errs)}`); }
    await page.close();
  }
  console.log(`checked ${widths.length * pages.length} combos, ${bad} with issues`); await b.close();
})();
