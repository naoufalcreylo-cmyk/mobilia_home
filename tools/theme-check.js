// Runs Shopify Theme Check (same engine as `shopify theme check`) on ./theme
const path = require('path');
const { themeCheckRun } = require('@shopify/theme-check-node');
(async () => {
  const root = path.join(__dirname, '..', 'theme');
  const { offenses } = await themeCheckRun(root, undefined, () => {});
  const sev = ['ERROR', 'WARN', 'INFO'];
  const rows = offenses.map(o => `${sev[o.severity] || o.severity} ${o.check} ${o.uri.split('/theme/')[1]}:${(o.start?.line ?? 0) + 1} — ${o.message}`);
  const counts = offenses.reduce((m, o) => ((m[sev[o.severity]] = (m[sev[o.severity]] || 0) + 1), m), {});
  console.log(rows.sort().join('\n')); console.log('\nTOTAL', offenses.length, JSON.stringify(counts));
})().catch(e => { console.error(e); process.exit(1); });
