// node tools/montage.js out.png img1.png img2.png ... — tiles segment screenshots side by side for review
const { chromium } = require('playwright-core');
const fs = require('fs');
(async () => {
  const [out, ...imgs] = process.argv.slice(2);
  const tags = imgs.map(i => `<img src="data:image/png;base64,${fs.readFileSync(i).toString('base64')}" style="display:block">`).join('');
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 400, height: 400 } });
  await p.setContent(`<body style="margin:0;display:flex;gap:12px;background:#999;align-items:flex-start">${tags}</body>`);
  await p.waitForTimeout(300);
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
  console.log(out);
})();
