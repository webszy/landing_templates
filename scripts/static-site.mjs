import listenPreview from './listen-preview.cjs';
import { createReadStream } from 'node:fs';
import { access, cp, readFile, readdir, rm, stat } from 'node:fs/promises';
import http from 'node:http';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const appRoot = process.cwd();
const manifest = JSON.parse(await readFile(join(appRoot, 'package.json'), 'utf8'));
if (!manifest.config?.siteRoot) throw new Error('Run this command from an app with config.siteRoot.');
const root = resolve(appRoot, manifest.config.siteRoot);
const action = process.argv[2];

async function findFile(path) {
  for (const candidate of [path, join(path, 'index.html'), `${path}.html`]) {
    try {
      const metadata = await stat(candidate);
      if (metadata.isFile()) return { path: candidate, size: metadata.size };
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
    }
  }
  return null;
}

if (action === 'build') {
  await access(join(root, 'index.html'));
  const dist = join(appRoot, 'dist');
  await rm(dist, { recursive: true, force: true });
  await cp(root, dist, { recursive: true });
  console.log(`${manifest.name}: built dist/`);
} else if (action === 'check') {
  const failures = [];
  let references = 0;
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const file = join(entry.parentPath, entry.name);
    const extension = extname(file);
    if (['.js', '.mjs', '.cjs'].includes(extension)) {
      const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      if (result.status !== 0) failures.push(result.stderr || `Syntax check failed: ${file}`);
    }
    if (!['.html', '.css'].includes(extension)) continue;
    const text = await readFile(file, 'utf8');
    const refs = [...text.matchAll(/(?:src|href|poster)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^"')\s]+)["']?\s*\)/g)];
    for (const ref of new Set(refs.map(match => match[1] || match[2]))) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(ref)) continue;
      const url = new URL(ref, `http://local.test/${relative(root, file).split(sep).join('/')}`);
      const path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
      references++;
      if (!(await findFile(path))) failures.push(`${relative(root, file)}: missing ${ref}`);
    }
  }
  if (failures.length) {
    console.error([...new Set(failures)].join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`PASS ${manifest.name}: script syntax and ${references} local asset/route references.`);
  }
} else if (action === 'serve') {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.webm': 'video/webm' };
  const server = http.createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end('Static preview only.');
        return;
      }
      let pathname;
      try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
      catch { response.writeHead(400).end('Bad request'); return; }
      const path = resolve(root, `.${pathname}`);
      if (path !== root && !path.startsWith(root + sep)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const file = await findFile(path);
      if (!file) { response.writeHead(404).end('Not found'); return; }
      response.writeHead(200, { 'Content-Type': types[extname(file.path)] || 'application/octet-stream', 'Content-Length': file.size, 'Cache-Control': 'no-cache' });
      if (request.method === 'HEAD') response.end();
      else createReadStream(file.path).on('error', () => response.destroy()).pipe(response);
    } catch (error) {
      console.error(error.message);
      if (!response.headersSent) response.writeHead(500);
      response.end();
    }
  });
  listenPreview(server, { name: manifest.name });
} else {
  throw new Error('Expected serve, build, or check.');
}
