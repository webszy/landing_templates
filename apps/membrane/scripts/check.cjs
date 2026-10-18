const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../targets/membrane/clone');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const checked = new Set();

function checkRef(ref) {
  if (/^(data:|#)/i.test(ref)) return;
  assert(!/^(https?:|\/\/|blob:)/i.test(ref), `Non-local asset: ${ref}`);
  const file = path.resolve(root, '.' + (ref.startsWith('/') ? '' : '/') + ref.split(/[?#]/)[0]);
  assert(file.startsWith(root + path.sep), `Asset escapes clone directory: ${ref}`);
  assert(fs.statSync(file).isFile(), `Missing asset: ${ref}`);
  checked.add(file);
}

for (const tag of html.matchAll(/<(?:link|script|source|video|img)\b[^>]*>/gi)) {
  for (const attr of tag[0].matchAll(/\b(?:src|href|poster)="([^"]+)"/gi)) checkRef(attr[1]);
}
for (const name of fs.readdirSync(path.join(root, 'assets/css'))) {
  const css = fs.readFileSync(path.join(root, 'assets/css', name), 'utf8');
  for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) checkRef(match[2]);
}
for (const name of fs.readdirSync(path.join(root, 'assets/fonts'))) {
  assert.equal(fs.readFileSync(path.join(root, 'assets/fonts', name)).subarray(0, 4).toString(), 'wOF2', `Invalid font: ${name}`);
}
for (const name of fs.readdirSync(path.join(root, 'assets/media'))) {
  const bytes = fs.readFileSync(path.join(root, 'assets/media', name));
  assert(bytes.length > 0, `Empty media: ${name}`);
  if (/\.jpe?g$/.test(name)) assert.equal(bytes.subarray(0, 2).toString('hex'), 'ffd8', `Invalid JPEG: ${name}`);
  if (/\.png$/.test(name)) assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `Invalid PNG: ${name}`);
  if (/\.ico$/.test(name)) assert.equal(bytes.subarray(0, 4).toString('hex'), '00000100', `Invalid ICO: ${name}`);
  if (/\.svg$/.test(name)) assert.match(bytes.toString(), /<svg\b/, `Invalid SVG: ${name}`);
}
assert.match(html, /<canvas\b/);
assert.match(html, /<script src="fixes\.js" defer><\/script>/);
assert(!/<script\b[^>]*src="(?!fixes\.js")/i.test(html), 'Unexpected runtime script');
assert(!html.includes('analytics.modulify.ai'), 'Original analytics must be stripped');
console.log(`Static assets OK: ${checked.size} local references; font and image signatures valid.`);
