import { mkdir, readFile, readdir, rename, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const origin = 'https://peelmark.modulify.website';
const root = 'targets/peelmark/clone';
const skipHost = 'analytics.modulify.ai';

async function download(pathname) {
  const url = new URL(pathname, origin);
  const path = join(root, url.pathname);
  await mkdir(dirname(path), { recursive: true });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
  return url.pathname;
}

function chunkPathsFrom(text) {
  const found = new Set();
  const patterns = [
    /\/_next\/static\/chunks\/[A-Za-z0-9._~-]+\.js/g,
    /\/_next\/static\/[A-Za-z0-9._~-]+\/_[A-Za-z0-9]+\.js/g,
    /\/_next\/static\/media\/[A-Za-z0-9._~-]+\.woff2/g,
    /\/_next\/static\/chunks\/[A-Za-z0-9._~-]+\.css/g,
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) found.add(match[0]);
  }
  return found;
}

const original = await readFile('source/original.html', 'utf8');
const captured = await readFile('targets/peelmark/dom.html', 'utf8');
const tags = [...captured.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(match => match[0]);
const scripts = [];
const downloaded = new Set();
const queue = [];

for (const tag of tags) {
  const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
  if (src?.includes(skipHost) || src?.startsWith('https://analytics.')) continue;
  if (src?.includes('/_next/')) {
    queue.push(src);
    scripts.push(tag);
  } else if (tag.includes('id="__NEXT_DATA__"')) {
    scripts.push(tag);
  }
}

queue.push(
  '/_next/static/chunks/0t9e_m4e_rpto.css',
  '/favicon.svg',
  '/images/modulify-logo.png',
);

while (queue.length) {
  const pathname = queue.shift();
  if (!pathname || downloaded.has(pathname)) continue;
  downloaded.add(pathname);
  try {
    const saved = await download(pathname);
    console.log(saved);
    if (/\.(?:js|css)$/.test(pathname)) {
      const text = await readFile(join(root, pathname), 'utf8');
      for (const extra of chunkPathsFrom(text)) {
        if (!downloaded.has(extra)) queue.push(extra);
      }
    }
  } catch (error) {
    console.warn(`skip ${pathname}: ${error.message}`);
  }
}

let html = await readFile(`${root}/index.html`, 'utf8');
html = html.replace(/<!-- original-runtime -->[\s\S]*?<!-- \/original-runtime -->/, '');
const initial = original.match(/<body[^>]*>([\s\S]*?)<script/)[1];
html = html.replace(/(<body[^>]*>)[\s\S]*?(?=<style[^>]*>\[data-modulify-badge\])/, `$1${initial}`);

const data = scripts.filter(tag => tag.includes('__NEXT_DATA__')).join('');
const paths = scripts.map(tag => tag.match(/src="([^"]+)"/)?.[1]).filter(Boolean);
const loader = `// Replay the original locally hosted runtime in dependency order.
(async()=>{for(const src of ${JSON.stringify(paths)}){await new Promise((resolve,reject)=>{const script=document.createElement("script");script.src=src;script.async=false;script.onload=resolve;script.onerror=()=>reject(new Error("Failed to load "+src));document.body.appendChild(script);});}})().catch(console.error);
`;
await writeFile(`${root}/fixes.js`, loader);
html = html.replace('</body>', `<!-- original-runtime -->${data}<script src="/fixes.js"></script><!-- /original-runtime --></body>`);
await writeFile(`${root}/index.html`, html);

try {
  await mkdir(join(root, '_next'), { recursive: true });
  await copyFile(join(root, 'assets/media/image'), join(root, '_next/image'));
} catch (error) {
  console.warn(`next/image copy: ${error.message}`);
}

const fontDir = join(root, 'assets/fonts');
const nextMedia = join(root, '_next/static/media');
await mkdir(nextMedia, { recursive: true });
for (const name of await readdir(fontDir)) {
  await copyFile(join(fontDir, name), join(nextMedia, name));
  console.log(`font ${name}`);
}
const nextCss = join(root, '_next/static/chunks/0t9e_m4e_rpto.css');
let nextCssText = await readFile(nextCss, 'utf8');
nextCssText = nextCssText.replaceAll('0wkzw~je483f-', '0wkzwje483f-').replaceAll('0rhz0arwfsn~5', '0rhz0arwfsn5');
await writeFile(nextCss, nextCssText);

const files = await readdir(root, { recursive: true });
const renamed = files.filter(file => file.includes('~'));
for (const file of files) {
  if (!/\.(?:js|html|json|css)$/.test(file)) continue;
  let text = await readFile(join(root, file), 'utf8');
  let changed = false;
  for (const old of renamed) {
    const name = old.split('/').pop();
    const next = name.replaceAll('~', '-');
    if (text.includes(name)) {
      text = text.split(name).join(next);
      changed = true;
    }
  }
  if (changed) await writeFile(join(root, file), text);
}
for (const old of renamed) {
  await rename(join(root, old), join(root, old.replaceAll('~', '-')));
  console.log(`renamed ${old} -> ${old.replaceAll('~', '-')}`);
}
