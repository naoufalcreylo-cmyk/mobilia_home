// Minimal static server for the prototype: node tools/serve.js [port]
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.join(__dirname, '..', 'prototype'); const port = +process.argv[2] || 4173;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }); return res.end('Not found'); }
    const type = types[path.extname(f)] || 'application/octet-stream';
    const gz = /text|json|javascript|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '');
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache', ...(gz ? { 'content-encoding': 'gzip' } : {}) });
    res.end(gz ? zlib.gzipSync(buf) : buf);
  });
}).listen(port, () => console.log('http://localhost:' + port));
