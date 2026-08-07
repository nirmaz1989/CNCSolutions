// Minimal static file server for local preview of the Dialed In CNC site.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 4321;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const send = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(root, path.normalize(urlPath));
  if (!filePath.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) return send(res, filePath);
    // Mirror Vercel cleanUrls: an extensionless path (e.g. /services) maps to /services.html
    if (!path.extname(filePath)) {
      const htmlPath = filePath + '.html';
      return fs.stat(htmlPath, (e2, s2) => (!e2 && s2.isFile()) ? send(res, htmlPath) : (res.writeHead(404), res.end('Not found')));
    }
    res.writeHead(404); res.end('Not found');
  });
}).listen(port, () => console.log(`Dialed In preview running at http://localhost:${port}`));
