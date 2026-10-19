import { spawn } from 'node:child_process';
import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const appRoot = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://sandiego-template.modulify.website';
const seen = new Set(['/']);
const queue = [];
const routes = [];

function discover(html) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(href, origin);
    const path = url.pathname.replace(/\/$/, '') || '/';
    if (url.origin !== origin || seen.has(path) || path.startsWith('/api/')) continue;
    seen.add(path);
    if (seen.size > 60) throw new Error('More than 60 routes found; inspect the crawl before continuing.');
    queue.push(path);
  }
}

function command(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('pingfusi', args, { cwd: appRoot, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`pingfusi ${args.join(' ')} exited ${code}`)));
  });
}

discover(await readFile(new URL('../targets/sandiego/dom.html', import.meta.url), 'utf8'));
// These companion captures inventory geometry and content. All routes share the
// authored animation engine restored from the primary target's public source scripts.
while (queue.length) {
  const route = queue.shift();
  const target = `sandiego-${route.slice(1).replaceAll('/', '--')}`;
  const directory = new URL(`../targets/${target}/`, import.meta.url);
  try { await access(new URL('target.json', directory)); }
  catch { await command(['new', target, origin + route]); }
  try { await access(new URL('dom.html', directory)); }
  catch { await command(['capture-run', target, '--side', 'live', '--no-motion']); }
  const html = await readFile(new URL('dom.html', directory), 'utf8');
  const snapshot = JSON.parse(await readFile(new URL('live.json', directory), 'utf8'));
  routes.push({ route, target, leaves: snapshot.elements ? Object.keys(snapshot.elements).length : null });
  discover(html);
  await writeFile(new URL('../routes.json', import.meta.url), JSON.stringify(routes, null, 2) + '\n');
  console.log(`Captured ${route}; ${routes.length} complete, ${queue.length} queued.`);
}
