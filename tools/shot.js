// Usage: node tools/shot.js <url> <out.png> [width=1440] [height=900] [mode=full|seg|view] [actions-js]
// Scrolls the page to trigger lazy images / reveals, then captures.
//  full: one full-page image · seg: full page split into <out>-N.png of ~2x viewport · view: viewport only
// Prints horizontal overflow, console errors and failed requests.
const { chromium } = require('playwright-core');

(async () => {
  const [url, out, w = '1440', h = '900', mode = 'full', actions] = process.argv.slice(2);
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, hasTouch: +w < 1024, isMobile: +w < 768 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('requestfailed', r => errors.push('REQFAIL ' + r.url().slice(0, 120)));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (mode !== 'view') {
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += +h * 0.7) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(120); }
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.evaluate(() => { scrollTo(0, 0); document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')); });
    await page.waitForTimeout(900);
  }
  if (actions) await eval('(async()=>{' + actions + '})()');
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const outs = [];
  if (mode === 'seg') {
    // Hide sticky chrome after the first segment so it doesn't repeat
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const segH = +h * 2;
    for (let y = 0, i = 0; y < H; y += segH, i++) {
      const f = out.replace(/\.png$/, `-${i}.png`);
      await page.screenshot({ path: f, fullPage: true, clip: { x: 0, y, width: +w, height: Math.min(segH, H - y) } });
      outs.push(f);
    }
  } else {
    await page.screenshot({ path: out, fullPage: mode === 'full' }); outs.push(out);
  }
  console.log(JSON.stringify({ outs, overflow, errors: [...new Set(errors)].slice(0, 15) }));
  await browser.close();
})();
