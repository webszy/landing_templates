const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../targets/aster/clone');
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
const cssDirectory = path.join(root, 'assets/css');
for (const name of fs.readdirSync(cssDirectory)) {
  const css = fs.readFileSync(path.join(cssDirectory, name), 'utf8');
  for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) checkRef(match[2]);
}
for (const name of fs.readdirSync(path.join(root, 'assets/fonts'))) {
  const file = path.join(root, 'assets/fonts', name);
  assert.equal(fs.readFileSync(file).subarray(0, 4).toString(), 'wOF2', `Invalid font: ${name}`);
}
const media = path.join(root, 'assets/media');
assert.equal(fs.readFileSync(path.join(media, 'aster.webm')).subarray(0, 4).toString('hex'), '1a45dfa3');
assert.equal(fs.readFileSync(path.join(media, 'aster.mp4')).subarray(4, 8).toString(), 'ftyp');
assert.equal(fs.readFileSync(path.join(media, 'favicon.png')).subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.match(fs.readFileSync(path.join(media, 'logo.svg'), 'utf8'), /<svg\b/);
assert(!/<script\b[^>]*src="(?!fixes\.js")/i.test(html), 'Unexpected runtime script');
assert(!html.includes('analytics.modulify.ai'), 'Original analytics must be stripped');
assert.match(html, /<script src="fixes\.js" defer><\/script>/);
console.log(`Aster static assets OK: ${checked.size} local references; font and media signatures valid.`);
