import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const port = Number(argValue('--port', process.env.PORT || '4173'));
const host = argValue('--host', '0.0.0.0');
const root = process.cwd();
const mime = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp'
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let file = join(root, safe);
    const info = await stat(file).catch(() => null);
    if (!info || !info.isFile()) file = join(root, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache' });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { 'Content-Type':'text/plain; charset=utf-8' });
    res.end(`Server error: ${error.message}`);
  }
});
server.listen(port, host, () => console.log(`Agentic AI Master Guide: http://${host}:${port}`));
