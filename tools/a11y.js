// node tools/a11y.js — runs axe-core (WCAG 2.0/2.1 A+AA) on key templates, desktop + mobile
const { chromium } = require('playwright-core'); const fs = require('fs');
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const U = 'http://localhost:4173/';
const pages = ['', 'collection.html?c=salons-d-angle-sur-mesure', 'product.html?p=salon-angle-valmora-390x290-design-organique-bois-massif', 'collection.html?q=zzzz'];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const w of [1440, 390]) for (const p of pages) {
    const page = await b.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(U + p, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'))); await page.waitForTimeout(1300);
    await page.addScriptTag({ content: axe });
    const r = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] })).violations
      .map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 2).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n')[1]) })));
    console.log(`\n== ${w}px /${p} — ${r.length} rule(s)`);
    r.forEach(v => console.log(`  [${v.impact}] ${v.id} ×${v.n}\n    ${v.ex.join('\n    ')}`));
    await page.close();
  }
  await b.close();
})();
