// Point the clone's cross-page links at the original site.
//
// Only the homepage is cloned, so the captured markup's root-relative routes
// (/pilot, /apps, /full-service?app=…#showcase, /privacy-policy, …) have no local
// target — clicking one would 404 and `npm run check` would report them as missing
// local references. This rewrites exactly those hrefs to absolute URLs on the
// original host, leaving the clone's own anchors, assets and the home link alone.
//
// Re-run it after every `pingfusi capture-build flowcraft`, which regenerates
// index.html from the captured DOM.

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(join(appRoot, 'package.json'), 'utf8'));
const siteRoot = resolve(appRoot, manifest.config.siteRoot);
const origin = manifest.config.originalOrigin;
if (!origin) throw new Error('package.json config.originalOrigin is required.');

const file = join(siteRoot, 'index.html');
const html = await readFile(file, 'utf8');
let rewritten = 0;

const output = html.replace(/(href=")(\/(?![^"]*\/assets\/)[^"]*)(")/g, (match, open, route, close) => {
  if (route === '/' || route.startsWith('//')) return match;
  if (route.startsWith('/assets/') || route.startsWith('/_next/')) return match;
  rewritten++;
  return `${open}${origin}${route}${close}`;
});

await writeFile(file, output);
console.log(`flowcraft: rewrote ${rewritten} cross-page link(s) to ${origin}`);
